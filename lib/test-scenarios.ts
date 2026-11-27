export const taskScenarios = {
  create: { title: 'thêm nhiệm vụ mới', steps: [
    'Để trống tên nhiệm vụ và bấm Lưu; kiểm tra form báo lỗi, danh sách không đổi.',
    'Nhập tên chỉ có khoảng trắng và bấm Lưu; kiểm tra vẫn không thêm nhiệm vụ.',
    'Nhập “Tìm Eevee”, lưu và kiểm tra nhiệm vụ mới xuất hiện trong danh sách.',
  ] },
  search: { title: 'tìm kiếm nhiệm vụ theo tên', steps: [
    'Nhập “squirtle” vào ô Tìm nhiệm vụ.',
    'Kiểm tra danh sách còn đúng một nhiệm vụ “Khảo sát Squirtle ven hồ”.',
    'Tìm từ khóa “không có” và kiểm tra thông báo không có nhiệm vụ phù hợp.',
  ] },
}

const taskCases = Object.entries(taskScenarios).map(([id, scenario]) => ({
  ...scenario, id: `task-${id}`, file: 'tests/tasks.test.tsx',
}))

export const testGroups = [
  { name: 'Nhiệm vụ nghiên cứu', cases: taskCases },
]
