'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { pokemonTypes, type Pokemon } from '../lib/pokemon'
import { PokemonList } from './pokemon-list'

export function PokedexFilter({ pokemon, hydrationDemo = false }: { pokemon: Pokemon[]; hydrationDemo?: boolean }) {
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')
  const [interactive, setInteractive] = useState(true)
  const visible = interactive ? pokemon.filter((entry) =>
    entry.name.toLowerCase().includes(search.trim().toLowerCase()) &&
    (!type || entry.types.some((value) => value === type)),
  ) : pokemon
  return <>
    {hydrationDemo && <div className="panel lab-hydration">
      <div className="segmented" role="group" aria-label="Bước hydration">
        <button aria-pressed={!interactive} onClick={() => setInteractive(false)}>HTML ban đầu</button>
        <button aria-pressed={interactive} onClick={() => setInteractive(true)}>Sau hydration</button>
      </div>
      <p aria-live="polite">{interactive
        ? 'Sau hydration: gõ “Pikachu” hoặc chọn hệ Điện để thấy danh sách đổi ngay.'
        : 'HTML ban đầu: danh sách đã xuất hiện. Bộ lọc đang được khóa để mô phỏng thời điểm trước hydration.'}</p>
    </div>}
    <div className="filter-row">
      <label className="search"><Search size={17} aria-hidden /><input disabled={!interactive} aria-label="Tìm Pokémon" placeholder="Tìm theo tên Pokémon…" value={interactive ? search : ''} onChange={(event) => setSearch(event.target.value)} /></label>
      <label className="filter-select"><span className="sr-only">Hệ Pokémon</span><select disabled={!interactive} value={interactive ? type : ''} onChange={(event) => setType(event.target.value)}><option value="">Tất cả hệ</option>{pokemonTypes.map((value) => <option key={value}>{value}</option>)}</select></label>
    </div>
    {hydrationDemo && <p className="lab-filter-count caption" role="status">Hiển thị {visible.length}/{pokemon.length} Pokémon</p>}
    <PokemonList pokemon={visible} />
  </>
}
