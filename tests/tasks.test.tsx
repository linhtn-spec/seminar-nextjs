/**
 * Demo Component Testing (Slide 25–26): Vitest + React Testing Library + User Event.
 * Viết theo cấu trúc 3 bước AAA (Arrange – Act – Assert).
 * Trạng thái kỳ vọng khi demo: 1 case ĐẠT (tìm kiếm), 1 case THẤT BẠI (tạo nhiệm vụ)
 * vì schema ở `lib/tasks.ts` đang cố tình chưa kiểm tra tên rỗng/toàn khoảng trắng.
 */
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { TaskManager } from '../components/task-manager'
import { taskScenarios } from '../lib/test-scenarios'

describe('Nhiệm vụ nghiên cứu', () => {
  // Case 1 · THẤT BẠI CÓ CHỦ ĐÍCH: kiểm tra validation + tạo nhiệm vụ mới
  it(taskScenarios.create.title, async () => {
    // ARRANGE: khởi tạo user mô phỏng, render component (có sẵn 3 nhiệm vụ mẫu) và mở form tạo mới
    const user = userEvent.setup()
    render(<TaskManager />)

    await user.click(screen.getByRole('button', { name: 'Thêm nhiệm vụ' }))
    const form = screen.getByRole('form', { name: 'Nhiệm vụ mới' })
    const title = within(form).getByRole('textbox', { name: 'Tên nhiệm vụ' })
    const save = within(form).getByRole('button', { name: 'Lưu nhiệm vụ' })
    const list = screen.getByRole('list', { name: 'Danh sách nhiệm vụ' })

    // ACT (1): để trống tên và bấm Lưu nhiệm vụ
    await user.click(save)

    // ASSERT (1) — ĐIỂM TEST BẮT LỖI:
    // Kỳ vọng form chặn lại và hiện thông báo "Tên nhiệm vụ là bắt buộc."
    // Thực tế test dừng ở đây vì `taskTitleLengthSchema` (lib/tasks.ts) chỉ mới kiểm tra `.max(90)`.
    expect(
      screen.queryByText('Tên nhiệm vụ là bắt buộc.'),
      'Tên nhiệm vụ trống phải hiện lỗi “Tên nhiệm vụ là bắt buộc.”',
    ).not.toBeNull()
    expect(form).toBeInTheDocument()
    expect(within(list).getAllByRole('listitem')).toHaveLength(3)

    // ACT (2): nhập tên chỉ toàn khoảng trắng và bấm Lưu
    await user.type(title, '   ')
    await user.click(save)

    // ASSERT (2): tên toàn khoảng trắng sau khi trim() cũng phải báo lỗi, danh sách giữ nguyên 3 mục và input bắt buộc nhập
    expect(
      screen.queryByText('Tên nhiệm vụ là bắt buộc.'),
      'Tên nhiệm vụ chỉ có khoảng trắng phải hiện lỗi “Tên nhiệm vụ là bắt buộc.”',
    ).not.toBeNull()
    expect(form).toBeInTheDocument()
    expect(within(list).getAllByRole('listitem')).toHaveLength(3)
    expect(title).toBeRequired()

    // ACT (3): nhập tên hợp lệ "Tìm Eevee" và Lưu
    await user.clear(title)
    await user.type(title, 'Tìm Eevee')
    await user.click(save)

    // ASSERT (3): nhiệm vụ mới hiện ra với nhãn "Nhiệm vụ của bạn"
    const heading = await screen.findByRole('heading', { name: 'Tìm Eevee' })
    expect(heading).toBeVisible()
    expect(within(heading.closest('li')!).getByText('Nhiệm vụ của bạn')).toBeVisible()
  })

  // Case 2 · ĐẠT: kiểm tra lọc theo từ khóa và trạng thái không có kết quả
  it(taskScenarios.search.title, async () => {
    // ARRANGE: render component và lấy ô nhập tìm kiếm theo vai trò textbox
    const user = userEvent.setup()
    render(<TaskManager />)
    const search = screen.getByRole('textbox', { name: 'Tìm nhiệm vụ' })

    // ACT (1): gõ từ khóa khớp một phần tên
    await user.type(search, 'squirtle')

    // ASSERT (1): danh sách còn đúng 1 mục "Khảo sát Squirtle ven hồ"
    const list = screen.getByRole('list', { name: 'Danh sách nhiệm vụ' })
    expect(within(list).getAllByRole('listitem')).toHaveLength(1)
    expect(within(list).getByRole('heading', { name: 'Khảo sát Squirtle ven hồ' })).toBeVisible()

    // ACT (2): xóa từ khóa cũ và nhập cụm không khớp dữ liệu mẫu
    await user.clear(search)
    await user.type(search, 'không có')

    // ASSERT (2): giao diện hiển thị thông báo trạng thái rỗng
    expect(screen.getByText('Không có nhiệm vụ phù hợp.')).toBeVisible()
  })
})
