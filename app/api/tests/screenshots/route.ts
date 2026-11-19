import { captureTestCase } from '../../../../lib/capture-test-case'
import { localTestOrigin } from '../../../../lib/local-test-origin'
import { testGroups } from '../../../../lib/test-scenarios'

export const runtime = 'nodejs'
const cases = testGroups.flatMap(({ cases }) => cases)
let capturing = false

export async function POST(request: Request) {
  const origin = localTestOrigin(request)
  if (!origin) return Response.json({ error: 'Mở Pokédex Lab qua localhost để chụp ảnh.' }, { status: 403 })
  const id = new URL(request.url).searchParams.get('case')
  if (!id || !cases.some((scenario) => scenario.id === id)) {
    return Response.json({ error: 'Không tìm thấy test case.' }, { status: 400 })
  }
  if (capturing) return Response.json({ error: 'Một phiên Chrome đang chụp ảnh. Hãy thử lại sau khi phiên đó kết thúc.' }, { status: 409 })

  capturing = true
  const encoder = new TextEncoder()
  const cancel = new AbortController()
  const signal = AbortSignal.any([cancel.signal, request.signal, AbortSignal.timeout(35_000)])
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: object) => {
        if (!cancel.signal.aborted && !request.signal.aborted) controller.enqueue(encoder.encode(JSON.stringify(event) + '\n'))
      }
      try {
        await captureTestCase(id, origin, signal, (step, image) => send({ type: 'frame', step, image }))
      } catch (cause) {
        const detail = cause instanceof Error ? cause.message : ''
        send({ type: 'error', message: `Không chụp được ảnh trên Chrome. ${detail}` })
      } finally {
        capturing = false
        if (!cancel.signal.aborted) controller.close()
      }
    },
    cancel() {
      cancel.abort()
    },
  })
  return new Response(stream, { headers: { 'Content-Type': 'application/x-ndjson', 'Cache-Control': 'no-store' } })
}
