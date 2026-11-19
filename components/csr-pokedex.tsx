'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { RefreshCw } from 'lucide-react'
import { pokedexSchema } from '../lib/pokemon'
import { PokemonList, PokemonSkeleton } from './pokemon-list'
import { QueryProvider } from './query-provider'

function ClientList({ controls }: { controls: boolean }) {
  const [fail, setFail] = useState(false)
  const [shown, setShown] = useState(true)
  const query = useQuery({
    queryKey: ['pokemon', fail],
    enabled: shown,
    queryFn: async ({ signal }) => {
      const response = await fetch(fail ? '/api/pokemon?loi=1' : '/api/pokemon', { signal })
      if (!response.ok) throw new Error(fail ? 'API trả về lỗi mô phỏng (503).' : 'Không tải được Pokédex.')
      return pokedexSchema.parse(await response.json())
    },
  })
  return <>
    {controls && <div className="actions query-controls">
      <button className="button" onClick={() => setFail(!fail)}>{fail ? 'Khôi phục API' : 'Mô phỏng lỗi API'}</button>
      <button className="button" onClick={() => query.refetch()} disabled={!shown || query.isFetching}><RefreshCw size={15} /> Gọi lại API</button>
      <button className="button" onClick={() => setShown(!shown)}>{shown ? 'Ẩn danh sách' : 'Mở lại danh sách'}</button>
      <span className="caption" aria-live="polite">{query.isFetching ? 'Đang gọi API' : query.data ? 'Có dữ liệu trong cache' : 'Chưa có dữ liệu trong cache'}</span>
    </div>}
    {shown && (query.isPending ? <PokemonSkeleton /> : query.isError ? <div className="state" role="alert">
      <p>{query.error.message}</p><button className="button" onClick={() => query.refetch()}>Thử lại</button>
    </div> : <PokemonList pokemon={query.data} />)}
  </>
}

export function CsrPokedex({ controls = false }: { controls?: boolean }) {
  return <QueryProvider><ClientList controls={controls} /></QueryProvider>
}
