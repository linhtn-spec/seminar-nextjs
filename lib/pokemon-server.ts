import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { pokedexSchema } from './pokemon'

export async function getPokemon() {
  const file = await readFile(join(process.cwd(), 'lib', 'pokemon.json'), 'utf8')
  return pokedexSchema.parse(JSON.parse(file))
}
