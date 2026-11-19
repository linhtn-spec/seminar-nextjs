# Benchmark CSR, SSR và SSG

Ba route dùng chung chín Pokémon, markup danh sách và layout. CSR yêu cầu API và tải mã của React Query cùng client graph của danh sách. SSR và SSG hiển thị danh sách trên server. Benchmark so sánh ba cách triển khai trong project này, gồm cả sự khác biệt JavaScript phát sinh từ cách triển khai.

## Chạy trên Ubuntu

1. Cài Node.js 22.19+ và pnpm 11.9.0. Cài Chrome từ gói Debian của Google hoặc Chromium trên Ubuntu.
2. Từ thư mục dự án, chạy `pnpm install --frozen-lockfile`.
3. Chạy `pnpm benchmark`. Nếu Chrome không được phát hiện, chỉ đường dẫn bằng `CHROME_PATH=/usr/bin/google-chrome pnpm benchmark` hoặc `CHROME_PATH=/snap/bin/chromium pnpm benchmark`.
4. Nếu cổng đã có tiến trình lắng nghe, chọn cổng trống, ví dụ `BENCH_PORT=4180 pnpm benchmark`. Dùng `BENCH_RUNS=5 pnpm benchmark` khi muốn tăng số lượt.
5. Nếu môi trường đòi quyền loopback hoặc giới hạn Chrome headless, chạy từ terminal Ubuntu thông thường để Chrome hoạt động với sandbox của nó. Biến `BENCH_CHROME_NO_SANDBOX=1` dành cho container kiểm thử cô lập đã được thiết lập riêng.

## Điều kiện và cách đọc

Script chạy `next build` rồi `next start` trên loopback, kiểm tra HTML ban đầu, dùng một Chrome headless mới cho mỗi lượt và xoay thứ tự các route. Lighthouse dùng mobile preset và throttling mô phỏng, với thông số ghi trong JSON. Chrome mới có browser cache lạnh. Tiến trình server dùng chung và được khởi động trước khi đo. Giảm ứng dụng chạy nền và giữ thiết bị, browser, phiên bản Lighthouse và điều kiện mạng nhất quán khi so sánh lại.

| Chỉ số | Cách lấy |
| --- | --- |
| Performance | Điểm Lighthouse theo thang 0–100 |
| FCP, LCP | Audit Lighthouse, mili giây |
| CLS | Audit Lighthouse, không có đơn vị |
| TBT | Audit Lighthouse, mili giây |
| JavaScript transfer size | Tổng `transferSize` của resource loại Script |
| HTML response size | `transferSize` của tài liệu HTML chính, khác kích thước file HTML thô trên đĩa |
| Số request | Số dòng audit `network-requests` |

INP yêu cầu phiên tương tác phù hợp. Benchmark navigation này không thu INP. Phần tử được chọn cho LCP có thể là tiêu đề hoặc nội dung khác xuất hiện trước thẻ Pokémon. Để biết lúc danh sách sẵn sàng, đối chiếu waterfall của API với thời điểm danh sách xuất hiện trong trace. Báo cáo dùng trung vị cho từng chỉ số theo route. JSON lưu mọi mẫu gốc và thông tin môi trường để đối chiếu.

## Kết quả

Mở [báo cáo Markdown](../reports/benchmark.md), [dữ liệu JSON](../reports/benchmark.json) hoặc route `/benchmark` sau khi script chạy thành công.
