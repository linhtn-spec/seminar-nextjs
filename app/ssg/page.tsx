import { PokemonList } from '../../components/pokemon-list'
import { RenderingPage } from '../../components/rendering-page'
import { getPokemon } from '../../lib/pokemon-server'

export const dynamic = 'force-static'
export const revalidate = false

export default async function Page() {
  return <RenderingPage strategy="SSG"><PokemonList pokemon={await getPokemon()} /></RenderingPage>
}
