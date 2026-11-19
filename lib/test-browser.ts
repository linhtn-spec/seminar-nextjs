import { launch } from 'chrome-launcher'
import { setTimeout as delay } from 'node:timers/promises'

type Pending = { resolve: (result: unknown) => void; reject: (error: Error) => void }
type Message = { id?: number; method?: string; params?: { requestId?: string }; error?: { message: string }; result?: unknown }

async function connect(url: string, signal: AbortSignal) {
  signal.throwIfAborted()
  const socket = new WebSocket(url)
  const connectionSignal = AbortSignal.any([signal, AbortSignal.timeout(5000)])
  try {
    await new Promise<void>((resolve, reject) => {
      connectionSignal.addEventListener('abort', () => reject(connectionSignal.reason), { once: true })
      socket.addEventListener('open', () => resolve(), { once: true })
      socket.addEventListener('error', () => reject(new Error('Không kết nối được Chrome.')), { once: true })
    })
  } catch (error) {
    socket.close()
    throw error
  }
  return socket
}

export async function withTestBrowser<T>(origin: string, signal: AbortSignal, run: (browser: TestBrowser) => Promise<T>) {
  const chrome = await launch({ chromeFlags: ['--headless', '--disable-dev-shm-usage'] })
  let socket: WebSocket | undefined
  try {
    const response = await fetch(`http://127.0.0.1:${chrome.port}/json/list`, { signal })
    if (!response.ok) throw new Error('Không mở được phiên chụp Chrome.')
    const tabs: { type: string; webSocketDebuggerUrl: string }[] = await response.json()
    const tab = tabs.find(({ type }) => type === 'page')
    if (!tab) throw new Error('Chrome chưa mở tab để chụp.')
    socket = await connect(tab.webSocketDebuggerUrl, signal)
    const browser = new TestBrowser(socket, origin, signal)
    await browser.initialize()
    return await run(browser)
  } finally {
    socket?.close()
    await chrome.kill()
  }
}

export class TestBrowser {
  private id = 0
  private pausedRequest?: string
  private failNextPokemon = false
  private pending = new Map<number, Pending>()

  constructor(private socket: WebSocket, private origin: string, private signal: AbortSignal) {
    socket.addEventListener('message', ({ data }) => {
      const message: Message = JSON.parse(data)
      if (message.method === 'Fetch.requestPaused' && message.params?.requestId) {
        const requestId = message.params.requestId
        if (this.failNextPokemon) {
          this.failNextPokemon = false
          void this.command('Fetch.fulfillRequest', {
            requestId,
            responseCode: 503,
            responseHeaders: [{ name: 'Content-Type', value: 'application/json' }],
            body: Buffer.from(JSON.stringify({ error: 'Lỗi API trong lần gọi đầu.' })).toString('base64'),
          }).catch(() => undefined)
        } else {
          this.pausedRequest = requestId
        }
      }
      if (message.method === 'Page.javascriptDialogOpening') {
        void this.command('Page.handleJavaScriptDialog', { accept: true }).catch(() => undefined)
      }
      if (message.id === undefined) return
      const pending = this.pending.get(message.id)
      if (message.error) pending?.reject(new Error(message.error.message))
      else pending?.resolve(message.result)
    })
    socket.addEventListener('close', () => {
      for (const pending of this.pending.values()) pending.reject(new Error('Phiên chụp Chrome đã đóng.'))
    })
  }

  async initialize() {
    await this.command('Page.enable')
    await this.command('Emulation.setDeviceMetricsOverride', { width: 1200, height: 890, deviceScaleFactor: 1, mobile: false })
  }

  private command<T>(method: string, params: object = {}) {
    this.signal.throwIfAborted()
    const id = ++this.id
    return new Promise<T>((resolve, reject) => {
      const finish = () => {
        this.pending.delete(id)
        clearTimeout(timer)
        this.signal.removeEventListener('abort', abort)
      }
      const fail = (error: Error) => { finish(); reject(error) }
      const abort = () => fail(this.signal.reason)
      const timer = setTimeout(() => fail(new Error(`Chrome phản hồi quá chậm ở ${method}.`)), 7000)
      this.signal.addEventListener('abort', abort, { once: true })
      this.pending.set(id, { resolve: (result) => { finish(); resolve(result as T) }, reject: fail })
      try {
        this.socket.send(JSON.stringify({ id, method, params }))
      } catch (error) {
        finish()
        reject(error)
      }
    })
  }

  private async evaluate<T>(expression: string) {
    const response = await this.command<{ result: { value: T }; exceptionDetails?: unknown }>('Runtime.evaluate', { expression, returnByValue: true })
    if (response.exceptionDetails) throw new Error('Thao tác trên giao diện chụp ảnh không hoàn tất.')
    return response.result.value
  }

  async wait(condition: string) {
    for (let check = 0; check < 80; check++) {
      if (await this.evaluate<boolean>(condition)) return
      await delay(100, undefined, { signal: this.signal })
    }
    throw new Error('Giao diện không chuyển sang trạng thái cần chụp.')
  }

  async go(path: string) {
    const navigation = await this.command<{ errorText?: string }>('Page.navigate', { url: this.origin + path })
    if (navigation.errorText) throw new Error('Không mở được trang cần chụp.')
    await this.wait(`location.pathname === ${JSON.stringify(path)} && document.readyState === 'complete' && !!document.querySelector('h1')`)
  }

  async pausePokemon(failFirst = false) {
    this.failNextPokemon = failFirst
    await this.command('Fetch.enable', { patterns: [{ urlPattern: this.origin + '/api/pokemon', requestStage: 'Request' }] })
  }

  async resumePokemon() {
    if (this.pausedRequest) {
      await this.command('Fetch.continueRequest', { requestId: this.pausedRequest })
    }
    await this.command('Fetch.disable')
  }

  button(label: string) {
    return this.evaluate(`[...document.querySelectorAll('button')].find(button => button.textContent.trim() === ${JSON.stringify(label)}).click()`)
  }

  click(selector: string) {
    return this.evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`)
  }

  input(selector: string, value: string, isSelect = false) {
    return this.evaluate(`(() => {
      const element = document.querySelector(${JSON.stringify(selector)});
      const value = ${JSON.stringify(value)};
      if (element instanceof HTMLSelectElement) {
        element.value = value;
      } else {
        element.focus();
        const prototype = element instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
        Object.getOwnPropertyDescriptor(prototype, 'value').set.call(element, value);
      }
      element.dispatchEvent(new Event(${isSelect ? "'change'" : "'input'"}, { bubbles: true }));
    })()`)
  }

  async screenshot(selector: string) {
    const clip = await this.evaluate<object>(`(() => {
      const element = document.querySelector(${JSON.stringify(selector)});
      const rect = element.getBoundingClientRect();
      return { x: Math.max(0, rect.left + scrollX - 8), y: Math.max(0, rect.top + scrollY - 8),
        width: rect.width + 16, height: Math.min(600, rect.height + 16), scale: 1 };
    })()`)
    const { data } = await this.command<{ data: string }>('Page.captureScreenshot', {
      format: 'webp', quality: 80, clip, captureBeyondViewport: true,
    })
    return `data:image/webp;base64,${data}`
  }
}
