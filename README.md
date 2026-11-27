# Pokédex Lab · Frontend Roadmap

Demo Next.js App Router cho seminar bằng tiếng Việt. Ứng dụng minh họa hai phần thực hành trọng tâm: so sánh chiến lược rendering (**CSR, SSR, SSG, Server & Client Components**) và kiểm chứng các biện pháp tối ưu hiệu năng (**giảm JS với `dynamic()`, ảnh banner `priority` + WebP, lazy load, cache, `React.memo`, Server state**) bằng số liệu **Lighthouse Trước / Sau** cùng **Component Testing**.

## Chạy trên máy local

Cần Node.js 22.19+ và pnpm 11.9.0. Chrome hoặc Chromium cần cho benchmark. Nếu đã có pnpm đúng phiên bản, chạy từ thư mục này:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Mở [http://127.0.0.1:3000](http://127.0.0.1:3000). Khi trình bày View Page Source, cache, `<link rel="preload">` hay Network, hãy sử dụng production:

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
| `/labs/js-before` | Thí nghiệm JS (Trước): tải đồng bộ widget phân tích 151 loài Kanto trên Client |
| `/labs/js-after` | Thí nghiệm JS (Sau): Server Component + tách `next/dynamic()` chỉ tải khi bấm |
| `/labs/banner-before` | Thí nghiệm Banner (Trước): tải PNG lớn sau hydrate, `loading="lazy"`, không `priority` |
| `/labs/banner-after` | Thí nghiệm Banner (Sau): Server Component + WebP + `priority` (`<link rel="preload">`) |
| `/performance` | `React.memo`, TanStack Query Server state và Core Web Vitals |
| `/lazy-load` | Demo lazy load ảnh khi cuộn trong thư viện |
| `/tests` | Hai test thêm và tìm kiếm nhiệm vụ, hiển thị các bước kiểm tra và kết quả Vitest |
| `/benchmark` | Bảng Lighthouse so sánh CSR/SSR/SSG và cặp Trước/Sau tối ưu (6 chỉ số) |
| `/api/pokemon` | API nội bộ. Thêm `?loi=1` để lấy phản hồi lỗi mô phỏng |

Sau build, mở [.next/server/app/ssg.html](.next/server/app/ssg.html) và tìm `data-pokemon-id="25"`. Dữ liệu Pokédex đọc từ `lib/pokemon.json`; nút **Khôi phục mẫu** chỉ tác động đến nhiệm vụ của browser hiện tại.

```text
app/         Route (kể cả app/labs/* Before/After), layout, API và CSS
components/  Giao diện nhiệm vụ, Pokédex, mô phỏng, analytics và thử nghiệm
lib/         Dữ liệu (pokemon.json, kanto-telemetry.json), schema và bước rendering
tests/       Hai test Vitest và React Testing Library: thêm và tìm kiếm nhiệm vụ
scripts/     Script đo Lighthouse cho CSR/SSR/SSG và các cặp Before/After
docs/        Tài liệu, kịch bản thuyết trình và Q&A
reports/     Báo cáo JSON và Markdown sau khi đo
public/      Ảnh banner (banner-kanto.webp, banner-kanto-raw.png) và ảnh minh họa
```

## Benchmark và tài liệu

```sh
pnpm benchmark
```

Script tự build, chạy `next start` trên `127.0.0.1:4173`, kiểm tra phản hồi ban đầu và đo ba lần mỗi route (7 route: `csr`, `ssr`, `ssg`, `js-before`, `js-after`, `banner-before`, `banner-after`) theo thứ tự luân phiên. Benchmark không thu INP. [Hướng dẫn Ubuntu và định nghĩa chỉ số](docs/benchmark.md) · [Slide trình bày seminar](Seminar_05_Frontend_Roadmap_Tieng_Viet_Da_Chinh_Sua.pptx) · [Kịch bản demo 23–25 phút](docs/demo-script.md) · [Q&A và 15 câu hỏi ôn tập](docs/qa.md) · [Báo cáo Markdown](reports/benchmark.md) · [Dữ liệu JSON](reports/benchmark.json)

| Tài liệu | Chủ đề |
| --- | --- |
| [Kiến trúc](docs/architecture.md) | Ranh giới dữ liệu, route và lưu trữ |
| [Rendering](docs/rendering.md) | Kiểm chứng CSR, SSR, SSG từ HTML ban đầu |
| [Components](docs/components.md) | RSC payload, client graph và hydration |
| [Hiệu năng](docs/performance.md) | Lazy loading, memo, server state và đo Web Vitals |
| [Kết luận](docs/conclusion.md) | Tiêu chí chọn cách render cho team |
# seminar-nextjs
