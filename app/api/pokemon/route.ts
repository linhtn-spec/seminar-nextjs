import { getPokemon } from '../../../lib/pokemon-server'

export async function GET(request: Request) {
  if (new URL(request.url).searchParams.has('loi')) {
    return Response.json({ error: 'Lỗi API mô phỏng để quan sát trạng thái lỗi.' }, { status: 503 })
  }
  try {
    return Response.json(await getPokemon(), { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return Response.json({ error: 'Không đọc được dữ liệu Pokédex.' }, { status: 500 })
  }
}
