import { PokemonList } from '../../components/pokemon-list'
import { RenderingPage } from '../../components/rendering-page'
import { getPokemon } from '../../lib/pokemon-server'

export const dynamic = 'force-dynamic'

export default async function Page() {
  return <RenderingPage strategy="SSR"><PokemonList pokemon={await getPokemon()} /></RenderingPage>
}
