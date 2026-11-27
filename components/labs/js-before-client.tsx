'use client'

import { PokedexAnalyticsHeavy } from '../pokedex-analytics-heavy'
import { PokemonList } from '../pokemon-list'
import type { Pokemon } from '../../lib/pokemon'

export function JsBeforeClient({ pokemon }: { pokemon: Pokemon[] }) {
  return (
    <>
      <section className="section">
        <div className="section-heading">
          <div>
            <h2>9 Pokémon nổi bật (cùng bị đóng gói vào Client Bundle)</h2>
            <p>Vì component bao ngoài dùng &apos;use client&apos; và import đồng bộ, toàn bộ mã và dataset 151 loài tải ngay lúc mở trang.</p>
          </div>
        </div>
        <PokemonList pokemon={pokemon} />
      </section>
      <PokedexAnalyticsHeavy />
    </>
  )
}
