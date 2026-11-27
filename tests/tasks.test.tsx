import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { TaskManager } from '../components/task-manager'
import { taskScenarios } from '../lib/test-scenarios'

describe('Nhiệm vụ nghiên cứu', () => {
  it(taskScenarios.create.title, async () => {
    const user = userEvent.setup()
    render(<TaskManager />)

    await user.click(screen.getByRole('button', { name: 'Thêm nhiệm vụ' }))
    const form = screen.getByRole('form', { name: 'Nhiệm vụ mới' })
    const title = within(form).getByRole('textbox', { name: 'Tên nhiệm vụ' })
    const save = within(form).getByRole('button', { name: 'Lưu nhiệm vụ' })
    const list = screen.getByRole('list', { name: 'Danh sách nhiệm vụ' })

    await user.click(save)
    expect(
      screen.queryByText('Tên nhiệm vụ là bắt buộc.'),
      'Tên nhiệm vụ trống phải hiện lỗi “Tên nhiệm vụ là bắt buộc.”',
    ).not.toBeNull()
    expect(form).toBeInTheDocument()
    expect(within(list).getAllByRole('listitem')).toHaveLength(3)

    await user.type(title, '   ')
    await user.click(save)
    expect(
      screen.queryByText('Tên nhiệm vụ là bắt buộc.'),
      'Tên nhiệm vụ chỉ có khoảng trắng phải hiện lỗi “Tên nhiệm vụ là bắt buộc.”',
    ).not.toBeNull()
    expect(form).toBeInTheDocument()
    expect(within(list).getAllByRole('listitem')).toHaveLength(3)

    expect(title).toBeRequired()
    await user.clear(title)
    await user.type(title, 'Tìm Eevee')
    await user.click(save)

    const heading = await screen.findByRole('heading', { name: 'Tìm Eevee' })
    expect(heading).toBeVisible()
    expect(within(heading.closest('li')!).getByText('Nhiệm vụ của bạn')).toBeVisible()
  })

  it(taskScenarios.search.title, async () => {
    const user = userEvent.setup()
    render(<TaskManager />)
    const search = screen.getByRole('textbox', { name: 'Tìm nhiệm vụ' })

    await user.type(search, 'squirtle')
    const list = screen.getByRole('list', { name: 'Danh sách nhiệm vụ' })
    expect(within(list).getAllByRole('listitem')).toHaveLength(1)
    expect(within(list).getByRole('heading', { name: 'Khảo sát Squirtle ven hồ' })).toBeVisible()

    await user.clear(search)
    await user.type(search, 'không có')
    expect(screen.getByText('Không có nhiệm vụ phù hợp.')).toBeVisible()
  })
})
