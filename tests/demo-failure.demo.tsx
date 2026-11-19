import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it } from 'vitest'
import { TaskManager } from '../components/task-manager'
import { failureScenario, noteSearchFailureScenario, priorityFailureScenario } from '../lib/test-scenarios'

it(failureScenario.title, async () => {
  const user = userEvent.setup()
  render(<TaskManager />)
  const countTasks = () => within(screen.getByRole('list', { name: 'Danh sách nhiệm vụ' })).getAllByRole('listitem').length
  const before = countTasks()

  await user.click(screen.getByRole('button', { name: 'Thêm nhiệm vụ' }))
  await act(async () => {
    await user.click(screen.getByRole('button', { name: 'Lưu nhiệm vụ' }))
  })

  expect(countTasks(), 'Sổ nghiên cứu đã thêm một nhiệm vụ dù tên còn trống.').toBe(before)
})


it(priorityFailureScenario.title, async () => {
  const user = userEvent.setup()
  render(<TaskManager />)

  await user.click(screen.getByRole('button', { name: 'Thêm nhiệm vụ' }))
  await user.type(screen.getByLabelText('Tên nhiệm vụ'), 'Khảo sát Eevee')
  await user.selectOptions(screen.getByLabelText('Ưu tiên'), 'Cao')
  await user.click(screen.getByRole('button', { name: 'Lưu nhiệm vụ' }))

  const heading = await screen.findByRole('heading', { name: 'Khảo sát Eevee' })
  const card = heading.closest('li')!
  const priority = within(card).getByText(/^Ưu tiên /)
  expect(priority.textContent).toBe('Ưu tiên cao')
})

it(noteSearchFailureScenario.title, async () => {
  const user = userEvent.setup()
  render(<TaskManager />)

  await user.type(screen.getByRole('textbox', { name: 'Tìm nhiệm vụ' }), 'tuyến ven hồ')

  expect(screen.queryByRole('heading', { name: 'Khảo sát Squirtle ven hồ' })).toBeInTheDocument()
})
