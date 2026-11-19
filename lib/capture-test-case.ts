import { type TestBrowser, withTestBrowser } from './test-browser'

const tasks = '#nhiem-vu'
const form = '.task-form'
const title = '.task-form input[name=title]'
const note = '.task-form textarea'
const search = '.filter-row input'
const filter = '.filter-row select'
const pokedex = 'main .section'
const components = 'section[aria-labelledby=filter-heading]'

async function newTask(browser: TestBrowser, name?: string) {
  await browser.button('Thêm nhiệm vụ')
  await browser.wait('!!document.querySelector(".task-form")')
  if (name) await browser.input(title, name)
}

async function saveTask(browser: TestBrowser) {
  await browser.button('Lưu nhiệm vụ')
  await browser.wait('!document.querySelector(".task-form")')
}

export async function captureTestCase(
  id: string,
  origin: string,
  signal: AbortSignal,
  frame: (step: number, image: string) => void,
) {
  return withTestBrowser(origin, signal, async (browser) => {
    let index = 0
    const shot = async (selector = tasks) => frame(index++, await browser.screenshot(selector))
    if (id.startsWith('task-')) await browser.go('/')

    switch (id) {
      case 'task-list':
        await shot()
        await shot('.task-list')
        await browser.input(search, 'xyz')
        await browser.wait('!!document.querySelector("#nhiem-vu .state")')
        await shot()
        break
      case 'task-form':
        await newTask(browser, 'Tìm Eevee')
        await shot(form)
        await browser.button('Hủy')
        await browser.wait('!document.querySelector(".task-form")')
        await shot()
        await shot()
        break
      case 'task-validation':
        await newTask(browser, '  Tìm Eevee  ')
        await browser.input(note, '  Đồng cỏ  ')
        await shot(form)
        await saveTask(browser)
        await shot()
        await newTask(browser, 'Tìm Eevee')
        await browser.input(note, 'a'.repeat(241))
        await browser.button('Lưu nhiệm vụ')
        await browser.wait('!!document.querySelector(".task-form [role=alert]")')
        await shot(form)
        break
      case 'task-filter':
        await shot()
        await browser.input(search, 'P')
        await browser.input(filter, 'Đang làm', true)
        await browser.wait('document.querySelectorAll(".task-list li").length === 1')
        await shot()
        await shot()
        break
      case 'task-flow':
        await newTask(browser, 'Tìm Eevee')
        await saveTask(browser)
        await shot()
        await browser.go('/')
        await browser.wait('document.querySelector(".task-list")?.textContent.includes("Tìm Eevee")')
        await shot()
        await browser.click('[aria-label="Sửa: Tìm Eevee"]')
        await browser.wait('!!document.querySelector(".task-form")')
        await browser.input(title, 'Theo dấu Eevee')
        await shot(form)
        await saveTask(browser)
        await browser.click('[aria-label="Đánh dấu hoàn thành: Theo dấu Eevee"]')
        await browser.input(search, 'eevee')
        await browser.input(filter, 'Hoàn thành', true)
        await browser.wait('document.querySelectorAll(".task-list li").length === 1')
        await shot()
        await browser.click('[aria-label="Xóa: Theo dấu Eevee"]')
        await browser.wait('!!document.querySelector("#nhiem-vu .state")')
        await shot()
        await browser.button('Khôi phục mẫu')
        await browser.wait('document.querySelectorAll(".task-list li").length === 3')
        await shot()
        break
      case 'task-empty-title-regression':
        await shot()
        await newTask(browser)
        await shot(form)
        await browser.button('Lưu nhiệm vụ')
        await browser.wait('!document.querySelector(".task-form") || !!document.querySelector(".task-form [role=alert]")')
        await shot()
        break
      case 'task-create-priority-regression':
        await newTask(browser, 'Khảo sát Eevee')
        await shot(form)
        await browser.input('.task-form select[name=priority]', 'Cao', true)
        await shot(form)
        await saveTask(browser)
        await shot()
        break
      case 'task-search-note-regression':
        await shot()
        await browser.input(search, 'tuyến ven hồ')
        await browser.wait('document.querySelectorAll(".task-list li").length <= 1')
        await shot()
        await shot()
        break
      case 'pokedex-loading':
        await browser.pausePokemon()
        await browser.go('/csr')
        await browser.wait('!!document.querySelector(".skeleton")')
        await shot(pokedex)
        await shot(pokedex)
        await browser.resumePokemon()
        await browser.wait('document.querySelectorAll("[data-pokemon-id]").length === 9')
        await shot(pokedex)
        break
      case 'pokedex-retry':
        await browser.pausePokemon(true)
        await browser.go('/csr')
        await browser.wait('!!document.querySelector("main [role=alert]")')
        await shot(pokedex)
        await shot(pokedex)
        await browser.resumePokemon()
        await browser.button('Thử lại')
        await browser.wait('document.querySelectorAll("[data-pokemon-id]").length === 9')
        await shot(pokedex)
        break
      case 'pokedex-filter':
        await browser.go('/components')
        await browser.input(search, 'pika')
        await browser.wait('document.querySelectorAll("[data-pokemon-id]").length === 1')
        await shot(components)
        await shot(components)
        await browser.input(filter, 'Nước', true)
        await browser.wait('!!document.querySelector("section[aria-labelledby=filter-heading] .state")')
        await shot(components)
        break
      default:
        throw new Error('Case chưa có thao tác chụp ảnh.')
    }
  })
}
