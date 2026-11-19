import { Circle, Droplets, Flame, Ghost, Leaf, Sparkles, Zap, Moon, Wind, MapPin } from 'lucide-react'
import type { Pokemon } from '../lib/pokemon'

const typeIcon = {
  'Lá': Leaf, 'Độc': Moon, 'Lửa': Flame, 'Nước': Droplets,
  'Điện': Zap, 'Thường': Circle, 'Tiên': Sparkles, 'Ma': Ghost, 'Rồng': Wind,
}
const typeColor = {
  'Lá': 'leaf', 'Độc': 'ghost', 'Lửa': 'fire', 'Nước': 'water',
  'Điện': 'electric', 'Thường': 'neutral', 'Tiên': 'fairy', 'Ma': 'ghost', 'Rồng': 'water',
}

export function PokemonList({ pokemon }: { pokemon: Pokemon[] }) {
  if (!pokemon.length) return <div className="state">Không tìm thấy Pokémon phù hợp.</div>
  return <ul className="pokemon-grid" aria-label="Danh sách Pokémon">
    {pokemon.map((entry) => {
      const Icon = typeIcon[entry.types[0]]
      return <li key={entry.id} data-pokemon-id={entry.id} className="pokemon-card">
        <div className={`pokemon-emblem tone-${typeColor[entry.types[0]]}`}><Icon size={25} aria-hidden /></div>
        <div>
          <span className="dex-id">#{String(entry.id).padStart(3, '0')}</span>
          <h3>{entry.name}</h3>
          <div className="pokemon-meta"><MapPin size={13} aria-hidden /> {entry.habitat}</div>
        </div>
        <div className="type-row">{entry.types.map((type) => <span key={type} className={`type-tag tone-${typeColor[type]}`}>{type}</span>)}</div>
      </li>
    })}
  </ul>
}

export function PokemonSkeleton() {
  return <div role="status" aria-label="Đang tải Pokédex" className="pokemon-grid">
    {Array.from({ length: 9 }, (_, index) => <div className="pokemon-card skeleton" key={index}><span /><span /></div>)}
  </div>
}
