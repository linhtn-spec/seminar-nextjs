# Pokédex Lab · Frontend Roadmap

Demo Next.js App Router cho seminar bằng tiếng Việt. Cùng chín Pokémon vùng Kanto được hiển thị theo CSR, SSR và SSG. Trang chủ có sổ nhiệm vụ nghiên cứu với tìm kiếm, lọc và CRUD lưu trên trình duyệt. Các địa điểm quan sát và dữ liệu biểu đồ được đặt để minh họa.

## Chạy trên máy local

Cần Node.js 22.19+ và pnpm 11.9.0. Chrome hoặc Chromium cần cho benchmark. Nếu đã có pnpm đúng phiên bản, chạy từ thư mục này:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Mở [http://127.0.0.1:3000](http://127.0.0.1:3000). Khi trình bày View Page Source, cache hay Network, hãy sử dụng production:

```sh
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm start
```

## Các trang

| Đường dẫn | Nội dung |
| --- | --- |
| `/` | Quản lý nhiệm vụ nghiên cứu Pokémon và mở các demo rendering |
| `/visualizer` | Mô phỏng Browser, Server và Build có điều khiển từng bước |
| `/csr` | Skeleton trong HTML, sau đó TanStack Query gọi API trên browser |
| `/ssr` | Server đọc dữ liệu theo request và trả HTML đã có Pokédex |
| `/ssg` | Next.js tạo HTML Pokédex khi build |
| `/components` | Server Component đọc dữ liệu, Client Component tìm và lọc |
| `/performance` | Lazy loading, React.memo, TanStack Query và Core Web Vitals |
| `/lazy-load` | Demo lazy load ảnh khi cuộn trong thư viện |
| `/tests` | Hai test thêm và tìm kiếm nhiệm vụ, hiển thị các bước kiểm tra và kết quả Vitest |
| `/benchmark` | Phương pháp đo và bảng trung vị từ báo cáo Lighthouse |
| `/api/pokemon` | API nội bộ. Thêm `?loi=1` để lấy phản hồi lỗi mô phỏng |

Sau build, mở [.next/server/app/ssg.html](.next/server/app/ssg.html) và tìm `data-pokemon-id="25"`. Dữ liệu Pokédex đọc từ `lib/pokemon.json`; nút **Khôi phục mẫu** chỉ tác động đến nhiệm vụ của browser hiện tại.

```text
app/         Route, layout, API và CSS
components/  Giao diện nhiệm vụ, Pokédex, mô phỏng và thử nghiệm
lib/         Dữ liệu, schema và định nghĩa các bước rendering
tests/       Hai test Vitest và React Testing Library: thêm và tìm kiếm nhiệm vụ
scripts/     Script đo Lighthouse
docs/        Tài liệu và kịch bản trình bày
reports/     Báo cáo JSON và Markdown sau khi đo
public/      Ảnh bìa phong cảnh cục bộ
```

## Benchmark và tài liệu

```sh
pnpm benchmark
```

Script tự build, chạy `next start` trên `127.0.0.1:4173`, kiểm tra HTML và đo ba lần mỗi route theo thứ tự luân phiên. Benchmark không thu INP. [Hướng dẫn Ubuntu và định nghĩa chỉ số](docs/benchmark.md) · [Slide lý thuyết seminar](Seminar_05_Frontend_Roadmap_Tieng_Viet_Da_Chinh_Sua.pptx) · [Kịch bản demo 22–24 phút](docs/demo-script.md) · [15 câu hỏi ôn tập](docs/qa.md) · [Báo cáo Markdown](reports/benchmark.md) · [Dữ liệu JSON](reports/benchmark.json)

| Tài liệu | Chủ đề |
| --- | --- |
| [Kiến trúc](docs/architecture.md) | Ranh giới dữ liệu, route và lưu trữ |
| [Rendering](docs/rendering.md) | Kiểm chứng CSR, SSR, SSG từ HTML ban đầu |
| [Components](docs/components.md) | RSC payload, client graph và hydration |
| [Hiệu năng](docs/performance.md) | Lazy loading, memo, server state và đo Web Vitals |
| [Kết luận](docs/conclusion.md) | Tiêu chí chọn cách render cho team |
# seminar-nextjs
