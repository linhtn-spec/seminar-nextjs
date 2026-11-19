import { z } from 'zod'

const screenshotEvent = z.discriminatedUnion('type', [
  z.object({ type: z.literal('frame'), step: z.number().int().nonnegative(), image: z.string().startsWith('data:image/webp;base64,') }),
  z.object({ type: z.literal('error'), message: z.string() }),
])

export async function* readScreenshots(response: Response) {
  if (!response.ok) {
    const body = await response.json()
    throw new Error(typeof body?.error === 'string' ? body.error : 'Không mở được phiên chụp ảnh.')
  }
  if (!response.body) throw new Error('Phiên Chrome chưa trả ảnh.')
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let pending = ''
  try {
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      pending += decoder.decode(value, { stream: true })
      const lines = pending.split('\n')
      pending = lines.pop() ?? ''
      for (const line of lines) {
        if (line) yield screenshotEvent.parse(JSON.parse(line))
      }
    }
  } finally {
    await reader.cancel().catch(() => undefined)
    reader.releaseLock()
  }
}
