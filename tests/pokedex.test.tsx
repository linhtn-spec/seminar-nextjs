import { render, screen } from '@testing-library/react'
import { pokedexScenarios } from '../lib/test-scenarios'
import userEvent from '@testing-library/user-event'
import { expect, it, vi } from 'vitest'
import { CsrPokedex } from '../components/csr-pokedex'
import { PokedexFilter } from '../components/pokedex-filter'
import { pokedexSchema } from '../lib/pokemon'
import fixture from '../lib/pokemon.json'

it(pokedexScenarios.loading.title, async () => {
  const fetchMock = vi.fn().mockResolvedValue(Response.json(fixture))
  vi.stubGlobal('fetch', fetchMock)
  render(<CsrPokedex />)
  expect(screen.getByRole('status', { name: 'Đang tải Pokédex' })).toBeVisible()
  expect(await screen.findByRole('heading', { name: 'Pikachu' })).toBeVisible()
  expect(fetchMock).toHaveBeenCalledWith('/api/pokemon', expect.anything())
})

it(pokedexScenarios.retry.title, async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(new Response(null, { status: 503 }))
    .mockResolvedValueOnce(Response.json(fixture)))
  render(<CsrPokedex />)
  expect(await screen.findByRole('alert')).toHaveTextContent('Không tải được Pokédex.')
  await userEvent.click(screen.getByRole('button', { name: 'Thử lại' }))
  expect(await screen.findByRole('heading', { name: 'Pikachu' })).toBeVisible()
})

it(pokedexScenarios.filter.title, async () => {
  const user = userEvent.setup()
  render(<PokedexFilter pokemon={pokedexSchema.parse(fixture)} />)
  await user.type(screen.getByRole('textbox', { name: 'Tìm Pokémon' }), 'pika')
  expect(screen.getAllByRole('listitem')).toHaveLength(1)
  await user.selectOptions(screen.getByRole('combobox', { name: 'Hệ Pokémon' }), 'Nước')
  expect(screen.getByText('Không tìm thấy Pokémon phù hợp.')).toBeVisible()
})
