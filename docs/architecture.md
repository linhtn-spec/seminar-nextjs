# Kiến trúc dự án

App Router định tuyến theo thư mục trong `app/`. Layout của các trang dùng chung sidebar. Mỗi route tải dữ liệu theo yêu cầu của riêng nó. TypeScript strict, schema Zod và lockfile pnpm giữ hợp đồng dữ liệu và phiên bản nhất quán.

| Luồng | Nguồn và nơi xử lý |
| --- | --- |
| CSR | Client Component → TanStack Query → Route Handler → fixture trên server |
| SSR | Server Component đọc fixture mỗi request |
| SSG | Server Component đọc fixture trong quá trình build |
| Components | Server Component truyền mảng đã đọc qua props của Client Component |
| Sổ nghiên cứu | React Hook Form + Zod → `localStorage` tại browser |
| Benchmark | Script → Next.js production → Lighthouse → JSON và Markdown |

`components/pokemon-list.tsx` dùng chung markup hiển thị Pokémon. Khi được import bởi Client Component, module tham gia client graph. Khi SSR hoặc SSG import trực tiếp từ trang server, module được chạy trên server.

Lần render đầu của sổ nghiên cứu dùng dữ liệu mẫu để HTML và lần hydrate đầu nhất quán. `useSyncExternalStore` đọc bản lưu khi browser sẵn sàng và nhận sự kiện lưu trữ từ tab khác. Nếu truy cập lưu trữ bị chặn, thay đổi tồn tại trong bộ nhớ của tab cho đến khi tải lại. Task mới có nhãn **Nhiệm vụ của bạn**, task mẫu giữ nhãn riêng khi chỉnh sửa. Pokédex có fixture riêng và API chỉ đọc, vì vậy CRUD của người dùng không đi vào benchmark.
