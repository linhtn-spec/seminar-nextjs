export type Actor = 'browser' | 'server' | 'build'
type Step = { title: string; detail: string; from: Actor; to: Actor }

export const strategies = {
  CSR: {
    title: 'Render trên trình duyệt',
    summary: 'Browser tải JavaScript và lấy dữ liệu từ API để hiển thị Pokédex.',
    flow: 'Browser → JavaScript → API → Pokédex',
    steps: [
      { title: 'Gửi request', detail: 'Browser yêu cầu trang /csr.', from: 'browser', to: 'server' },
      { title: 'Trả HTML khung', detail: 'HTML ban đầu chứa skeleton chờ dữ liệu.', from: 'server', to: 'browser' },
      { title: 'Tải JavaScript', detail: 'Browser tải JS và hydrate phần client.', from: 'server', to: 'browser' },
      { title: 'Gọi API Pokédex', detail: 'TanStack Query gọi /api/pokemon và cache phản hồi.', from: 'browser', to: 'server' },
      { title: 'Hiển thị Pokédex', detail: 'API trả dữ liệu và React render danh sách trên browser.', from: 'server', to: 'browser' },
    ] satisfies Step[],
  },
  SSR: {
    title: 'Render theo request',
    summary: 'Server đọc dữ liệu và trả HTML có danh sách Pokémon trong từng request.',
    flow: 'Request → Đọc dữ liệu → HTML → Browser',
    steps: [
      { title: 'Gửi request', detail: 'Browser yêu cầu trang /ssr.', from: 'browser', to: 'server' },
      { title: 'Đọc dữ liệu', detail: 'Server đọc bộ dữ liệu cục bộ cho request này.', from: 'server', to: 'server' },
      { title: 'Tạo HTML', detail: 'Server render danh sách Pokémon thành HTML.', from: 'server', to: 'server' },
      { title: 'Hiển thị HTML', detail: 'Browser nhận HTML và có thể hiển thị danh sách ngay.', from: 'server', to: 'browser' },
      { title: 'Hydrate phần tương tác', detail: 'Nếu có Client Components, React gắn tương tác sau khi tải JS.', from: 'browser', to: 'browser' },
    ] satisfies Step[],
  },
  SSG: {
    title: 'Render lúc build',
    summary: 'Bản build lưu sẵn HTML có danh sách Pokémon. Dữ liệu được làm mới khi rebuild.',
    flow: 'Build → HTML có sẵn → Browser',
    steps: [
      { title: 'Tạo HTML lúc build', detail: 'Next.js đọc dữ liệu và lưu HTML trước khi có request.', from: 'build', to: 'build' },
      { title: 'Gửi request', detail: 'Browser yêu cầu trang /ssg.', from: 'browser', to: 'server' },
      { title: 'Phục vụ HTML có sẵn', detail: 'Server hoặc CDN trả file HTML đã tạo.', from: 'server', to: 'browser' },
      { title: 'Hiển thị Pokédex', detail: 'Browser hiển thị danh sách từ HTML.', from: 'browser', to: 'browser' },
    ] satisfies Step[],
  },
}

export type Strategy = keyof typeof strategies
export const strategyNames = Object.keys(strategies) as Strategy[]
