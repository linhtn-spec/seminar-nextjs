# Benchmark CSR, SSR, SSG và Trước / Sau tối ưu

Script `pnpm benchmark` đo đồng thời hai nhóm thí nghiệm trên cùng bản build production để kiểm chứng bằng số liệu Lighthouse:

1. **So sánh chiến lược rendering (`/csr`, `/ssr`, `/ssg`):** Ba route dùng chung chín Pokémon, markup danh sách và layout. CSR gọi `/api/pokemon` và tải TanStack Query ở trình duyệt; SSR và SSG render danh sách ngay trên server.
2. **So sánh Trước / Sau khi sửa code:**
   - **Tối ưu tải JS (`/labs/js-before` → `/labs/js-after`):** Bản Trước đặt cả danh sách và widget phân tích 151 loài Kanto (`lib/kanto-telemetry.json`) đồng bộ trong Client Component; bản Sau giữ danh sách ở Server Component và tách widget nặng qua `next/dynamic(..., { ssr: false })` chỉ tải khi bấm mở.
   - **Ảnh banner tải sớm (`/labs/banner-before` → `/labs/banner-after`):** Bản Trước gắn banner PNG lớn (`banner-kanto-raw.png`) sau client hydrate với `loading="lazy"` không có `priority`; bản Sau render ngay ở Server Component dùng định dạng WebP (`banner-kanto.webp`), khai báo `width/height` giữ chỗ chống CLS và gắn `priority` (`<link rel="preload" as="image">`).

## Chạy trên Ubuntu

1. Cài Node.js 22.19+ và pnpm 11.9.0. Cài Chrome từ gói Debian của Google hoặc Chromium trên Ubuntu.
2. Từ thư mục dự án, chạy `pnpm install --frozen-lockfile`.
3. Chạy `pnpm benchmark`. Nếu Chrome không được phát hiện, chỉ đường dẫn bằng `CHROME_PATH=/usr/bin/google-chrome pnpm benchmark` hoặc `CHROME_PATH=/snap/bin/chromium pnpm benchmark`.
4. Nếu cổng đã có tiến trình lắng nghe, chọn cổng trống, ví dụ `BENCH_PORT=4180 pnpm benchmark`. Dùng `BENCH_RUNS=5 pnpm benchmark` khi muốn tăng số lượt.
5. Nếu môi trường đòi quyền loopback hoặc giới hạn Chrome headless, chạy từ terminal Ubuntu thông thường để Chrome hoạt động với sandbox của nó. Biến `BENCH_CHROME_NO_SANDBOX=1` dành cho container kiểm thử cô lập đã được thiết lập riêng.

## Điều kiện và cách đọc

Script chạy `next build` rồi `next start` trên loopback, kiểm tra trạng thái phản hồi ban đầu, dùng một Chrome headless mới cho mỗi lượt và xoay vòng thứ tự các route. Lighthouse dùng mobile preset và throttling mô phỏng, với thông số ghi trong JSON. Chrome mới có browser cache lạnh; tiến trình server dùng chung và được khởi động trước khi đo.

| Chỉ số | Cách lấy |
| --- | --- |
| Performance | Điểm Lighthouse theo thang 0–100 |
| FCP, LCP | Audit Lighthouse, mili giây |
| CLS | Audit Lighthouse, không có đơn vị |
| TBT | Audit Lighthouse, mili giây |
| JavaScript transfer size | Tổng `transferSize` của resource loại Script |
| HTML response size | `transferSize` của tài liệu HTML chính |
| Số request | Số dòng audit `network-requests` |

INP yêu cầu phiên tương tác phù hợp. Benchmark navigation này không thu INP. Báo cáo dùng trung vị cho từng chỉ số theo route; JSON lưu mọi mẫu gốc và thông tin môi trường để đối chiếu.

## Kết quả

Mở [báo cáo Markdown](../reports/benchmark.md), [dữ liệu JSON](../reports/benchmark.json) hoặc route `/benchmark` sau khi script chạy thành công.
