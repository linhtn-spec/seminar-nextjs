import { render, screen, within } from '@testing-library/react'
import { taskScenarios } from '../lib/test-scenarios'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TaskFilter } from '../components/task-filter'
import { TaskForm } from '../components/task-form'
import { TaskList } from '../components/task-list'
import { TaskManager } from '../components/task-manager'
import { sampleTasks, taskInputSchema } from '../lib/tasks'

describe('Nhiệm vụ nghiên cứu', () => {
  it(taskScenarios.list.title, () => {
    const handlers = { onDelete: vi.fn(), onEdit: vi.fn(), onToggle: vi.fn() }
    const { rerender } = render(<TaskList tasks={[sampleTasks[0]]} {...handlers} />)
    expect(screen.getByRole('heading', { name: sampleTasks[0].title })).toBeVisible()
    expect(screen.getByText('Dữ liệu mẫu')).toBeVisible()
    expect(screen.getByText('Ưu tiên cao')).toBeVisible()
    expect(screen.getByText('Đang làm')).toBeVisible()
    rerender(<TaskList tasks={[]} {...handlers} />)
    expect(screen.getByText('Không có nhiệm vụ phù hợp.')).toBeVisible()
  })

  it(taskScenarios.form.title, async () => {
    const user = userEvent.setup()
    const save = vi.fn()
    const cancel = vi.fn()
    render(<TaskForm onSave={save} onCancel={cancel} />)
    await user.type(screen.getByLabelText('Tên nhiệm vụ'), 'Tìm Eevee')
    await user.click(screen.getByRole('button', { name: 'Hủy' }))
    expect(cancel).toHaveBeenCalledTimes(1)
    expect(save).not.toHaveBeenCalled()
  })

  it(taskScenarios.validation.title, () => {
    const base = { title: '  Tìm Eevee  ', note: '  Đồng cỏ  ', status: 'Chưa làm', priority: 'Vừa' }
    expect(taskInputSchema.parse(base)).toMatchObject({ title: 'Tìm Eevee', note: 'Đồng cỏ' })
    expect(taskInputSchema.safeParse({ ...base, status: 'Khác' }).success).toBe(false)
    expect(taskInputSchema.safeParse({ ...base, note: 'a'.repeat(241) }).success).toBe(false)
  })

  it(taskScenarios.filter.title, async () => {
    const search = vi.fn()
    const status = vi.fn()
    render(<TaskFilter search="" status="" onSearch={search} onStatus={status} />)
    await userEvent.type(screen.getByRole('textbox', { name: 'Tìm nhiệm vụ' }), 'P')
    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Lọc theo trạng thái' }), 'Đang làm')
    expect(search).toHaveBeenCalledWith('P')
    expect(status).toHaveBeenCalledWith('Đang làm')
  })

  it(taskScenarios.flow.title, async () => {
    const user = userEvent.setup()
    const mounted = render(<TaskManager />)
    await user.click(screen.getByRole('button', { name: 'Thêm nhiệm vụ' }))
    await user.type(screen.getByLabelText('Tên nhiệm vụ'), 'Tìm Eevee')
    await user.click(screen.getByRole('button', { name: 'Lưu nhiệm vụ' }))
    expect(await screen.findByRole('heading', { name: 'Tìm Eevee' })).toBeVisible()
    expect(screen.getByText('Nhiệm vụ của bạn')).toBeVisible()
    mounted.unmount()
    render(<TaskManager />)
    await user.click(screen.getByRole('button', { name: 'Sửa: Tìm Eevee' }))
    const title = screen.getByLabelText('Tên nhiệm vụ')
    await user.clear(title)
    await user.type(title, 'Theo dấu Eevee')
    await user.click(screen.getByRole('button', { name: 'Lưu nhiệm vụ' }))
    await user.click(await screen.findByRole('button', { name: 'Đánh dấu hoàn thành: Theo dấu Eevee' }))
    await user.type(screen.getByRole('textbox', { name: 'Tìm nhiệm vụ' }), 'eevee')
    await user.selectOptions(screen.getByRole('combobox', { name: 'Lọc theo trạng thái' }), 'Hoàn thành')
    expect(within(screen.getByRole('list')).getAllByRole('listitem')).toHaveLength(1)
    expect(screen.getByText('Hoàn thành', { selector: 'span' })).toBeVisible()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    await user.click(screen.getByRole('button', { name: 'Xóa: Theo dấu Eevee' }))
    expect(screen.getByText('Không có nhiệm vụ phù hợp.')).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Khôi phục mẫu' }))
    expect(screen.getByRole('heading', { name: sampleTasks[0].title })).toBeVisible()
  })
})
