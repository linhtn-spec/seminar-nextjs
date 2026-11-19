export const taskScenarios = {
  list: { title: 'hiển thị trạng thái, ưu tiên, nguồn dữ liệu và trạng thái trống', steps: [
    'Hiển thị TaskList với một nhiệm vụ Pikachu từ dữ liệu mẫu.',
    'Kiểm tra tên nhiệm vụ và ba nhãn Dữ liệu mẫu, Ưu tiên cao, Đang làm.',
    'Hiển thị lại với danh sách trống và kiểm tra thông báo Không có nhiệm vụ phù hợp.',
  ] },
  form: { title: 'bấm Hủy gọi hàm hủy và không lưu nhiệm vụ', steps: [
    'Mở TaskForm và nhập tên hợp lệ “Tìm Eevee”.',
    'Bấm Hủy.',
    'Kiểm tra hàm hủy được gọi một lần và hàm lưu chưa được gọi.',
  ] },
  validation: { title: 'trim dữ liệu hợp lệ và chặn trạng thái hoặc ghi chú không hợp lệ', steps: [
    'Đưa tên và ghi chú có khoảng trắng hai đầu vào schema Zod.',
    'Kiểm tra tên và ghi chú đã được bỏ khoảng trắng.',
    'Thử trạng thái Khác và ghi chú 241 ký tự. Kiểm tra Zod từ chối cả hai.',
  ] },
  filter: { title: 'bộ lọc gửi giá trị tìm kiếm và trạng thái qua callback', steps: [
    'Hiển thị TaskFilter và theo dõi hai hàm nhận giá trị tìm kiếm và trạng thái.',
    'Gõ P vào ô tìm kiếm và chọn Đang làm.',
    'Kiểm tra hàm tìm kiếm nhận P và hàm trạng thái nhận Đang làm.',
  ] },
  flow: { title: 'thêm, lưu qua lần mở mới, sửa, hoàn thành, lọc và xóa một nhiệm vụ', steps: [
    'Bấm Thêm nhiệm vụ, nhập Tìm Eevee và lưu. Kiểm tra thẻ mới có nhãn Nhiệm vụ của bạn.',
    'Đóng rồi hiển thị lại TaskManager. Tìm nút sửa của nhiệm vụ vừa lưu.',
    'Đổi tên thành Theo dấu Eevee, lưu và bấm Đánh dấu hoàn thành.',
    'Tìm eevee và lọc Hoàn thành. Kiểm tra danh sách chỉ còn một mục có nhãn Hoàn thành.',
    'Xóa nhiệm vụ với xác nhận được mô phỏng. Kiểm tra thông báo danh sách trống.',
    'Bấm Khôi phục mẫu và kiểm tra thẻ Pikachu xuất hiện lại.',
  ] },
}

export const pokedexScenarios = {
  loading: { title: 'hiển thị skeleton trước khi có Pokémon', steps: [
    'Giả lập fetch trả về bộ dữ liệu Pokédex mẫu.',
    'Hiển thị CsrPokedex và kiểm tra skeleton Đang tải Pokédex.',
    'Chờ Pikachu xuất hiện và kiểm tra fetch đã gọi /api/pokemon.',
  ] },
  retry: { title: 'hiển thị lỗi API và thử lại thành công', steps: [
    'Giả lập API trả HTTP 503 lần đầu và trả dữ liệu ở lần kế tiếp.',
    'Kiểm tra cảnh báo Không tải được Pokédex rồi bấm Thử lại.',
    'Kiểm tra thẻ Pikachu xuất hiện sau lần gọi lại.',
  ] },
  filter: { title: 'tìm và lọc Pokémon trên tập dữ liệu đã nhận', steps: [
    'Hiển thị PokedexFilter bằng dữ liệu mẫu rồi nhập pika.',
    'Kiểm tra danh sách còn đúng một mục.',
    'Chọn hệ Nước và kiểm tra thông báo Không tìm thấy Pokémon phù hợp.',
  ] },
}

const regressionTestFile = { file: 'tests/demo-failure.demo.tsx', mode: 'failure' } as const

export const failureScenario = {
  ...regressionTestFile,
  id: 'task-empty-title-regression',
  title: 'Sổ nghiên cứu không được thêm nhiệm vụ khi tên trống',
  steps: [
    'Mở Sổ nghiên cứu và ghi lại số nhiệm vụ đang có.',
    'Bấm Thêm nhiệm vụ, giữ trống ô tên rồi bấm Lưu nhiệm vụ.',
    'Kiểm tra số nhiệm vụ trong danh sách vẫn giữ nguyên.',
  ],
  expected: 'Sổ nghiên cứu từ chối tên trống và số nhiệm vụ không đổi.',
  reproduction: {
    cause: 'Quy tắc kiểm tra tên nhiệm vụ đang thiếu giới hạn tối thiểu 3 ký tự.',
    source: 'lib/tasks.ts',
  },
} as const

export const priorityFailureScenario = {
  ...regressionTestFile,
  id: 'task-create-priority-regression',
  title: 'Nhiệm vụ mới phải giữ mức ưu tiên Cao đã chọn',
  steps: [
    'Bấm Thêm nhiệm vụ và nhập tên Khảo sát Eevee.',
    'Chọn mức ưu tiên Cao rồi bấm Lưu nhiệm vụ.',
    'Kiểm tra nhãn ưu tiên trên thẻ nhiệm vụ mới.',
  ],
  expected: 'Thẻ Khảo sát Eevee hiển thị “Ưu tiên cao”.',
  reproduction: {
    cause: 'Luồng tạo nhiệm vụ đổi mức Cao thành Vừa trước khi lưu.',
    source: 'components/task-manager.tsx',
  },
} as const

export const noteSearchFailureScenario = {
  ...regressionTestFile,
  id: 'task-search-note-regression',
  title: 'Tìm theo ghi chú phải hiện nhiệm vụ Squirtle',
  steps: [
    'Mở Sổ nghiên cứu với các nhiệm vụ mẫu.',
    'Gõ “tuyến ven hồ” vào ô Tìm nhiệm vụ. Cụm từ này nằm trong ghi chú của nhiệm vụ Squirtle.',
    'Kiểm tra thẻ Khảo sát Squirtle ven hồ còn trong danh sách.',
  ],
  expected: 'Danh sách có nhiệm vụ Khảo sát Squirtle ven hồ.',
  reproduction: {
    cause: 'Hàm filterTasks chỉ so từ khóa với tên nhiệm vụ và bỏ qua ghi chú.',
    source: 'lib/tasks.ts',
  },
} as const

const taskCases = Object.entries(taskScenarios).map(([id, scenario]) => ({
  ...scenario, id: `task-${id}`, file: 'tests/tasks.test.tsx', mode: 'suite' as const,
}))
const pokedexCases = Object.entries(pokedexScenarios).map(([id, scenario]) => ({
  ...scenario, id: `pokedex-${id}`, file: 'tests/pokedex.test.tsx', mode: 'suite' as const,
}))

export const testGroups = [
  { name: 'Nhiệm vụ nghiên cứu', cases: [...taskCases, failureScenario, priorityFailureScenario, noteSearchFailureScenario] },
  { name: 'Pokédex và API', cases: pokedexCases },
]
