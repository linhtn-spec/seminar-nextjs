import { z } from 'zod'

export const pokemonTypes = ['Lá', 'Độc', 'Lửa', 'Nước', 'Điện', 'Thường', 'Tiên', 'Ma', 'Rồng'] as const

export const pokemonSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  types: z.array(z.enum(pokemonTypes)).nonempty(),
  region: z.string(),
  habitat: z.string(),
})

export const pokedexSchema = z.array(pokemonSchema)
export type Pokemon = z.infer<typeof pokemonSchema>
