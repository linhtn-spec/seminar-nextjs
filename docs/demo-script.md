# Kịch bản seminar trực tiếp · 14 phút

## Chuẩn bị

Chạy `pnpm benchmark` trước buổi trình bày để tạo bản build và báo cáo. Chạy `pnpm start` từ thư mục dự án, sau đó mở trang production tại `http://127.0.0.1:3000`. Chuẩn bị Chrome DevTools Network, một tab cho View Page Source và tab IDE mở `.next/server/app/ssg.html`.

| Thời gian | Thao tác | Nội dung trình bày |
| --- | --- | --- |
| 0:00–2:30 | Mở sổ nghiên cứu. Thử lưu form trống, rồi thêm nhiệm vụ Eevee. Mở `/tests`, bấm **Chạy** ở case **Sổ nghiên cứu không được thêm nhiệm vụ khi tên trống** để Chrome chụp các bước và Vitest kiểm tra. Sau đó dùng **Bước trước** và **Bước tiếp** để xem lại ảnh của lần chạy. Để tái hiện, quay lại Sổ nghiên cứu, bấm **Thêm nhiệm vụ**, để trống tên và bấm **Lưu nhiệm vụ**. Danh sách xuất hiện một nhiệm vụ không có tên. | Đối chiếu thao tác trên web với từng kết quả Vitest. Dữ liệu Pokédex dùng để đo được lưu riêng. |
| 2:30–4:30 | Vào Mô phỏng rendering. Dùng Phát cho CSR, Bước tiếp cho SSR, rồi chuyển SSG và xem bước Build. | Điểm khác biệt là thời điểm danh sách xuất hiện trong HTML hoặc DOM. Animation dùng để minh họa trình tự. |
| 4:30–7:30 | Tải trực tiếp ba route. Trong Network tìm request API của CSR. Tìm `data-pokemon-id="25"` trong View Page Source và trong file SSG. | SSR đọc dữ liệu theo request, SSG có HTML build sẵn, CSR render danh sách sau cầu nối API. |
| 7:30–9:30 | Mở Components. Chọn **HTML ban đầu** để thấy danh sách khi bộ lọc đang khóa. Chọn **Sau hydration**, gõ Pikachu và chọn hệ Điện. | Server Component lấy dữ liệu. JavaScript của bộ lọc hydrate và xử lý tương tác trên browser. |
| 9:30–12:00 | Mở Performance. Tải biểu đồ một lần, tăng bộ đếm cha và đối chiếu hai ô memo, ẩn/mở Pokédex rồi bật và khôi phục lỗi API. | Xem chunk động và request trong Network. So sánh commit và cache, chỉ ra vị trí đo INP trong Performance. |
| 12:00–14:00 | Mở Benchmark. Đọc một chỉ số tải, một chỉ số main thread và dung lượng JS. | Nêu số lượt, thiết bị, cache lạnh, throttling mô phỏng và lý do cần đo INP riêng. Chốt điều kiện chọn CSR, SSR và SSG. |

### Hai lỗi bổ sung trong Sổ nghiên cứu

| Lỗi | Cách tái hiện | Vị trí chỉnh sửa |
| --- | --- | --- |
| Mức ưu tiên bị đổi khi tạo | Thêm nhiệm vụ Khảo sát Eevee, chọn **Cao** rồi lưu. Thẻ mới hiện **Ưu tiên vừa**. | Trong nhánh tạo mới của `components/task-manager.tsx`, giữ nguyên `input.priority`. |
| Tìm kiếm bỏ qua ghi chú | Tìm `tuyến ven hồ`. Cụm từ nằm trong ghi chú của nhiệm vụ Squirtle, song danh sách trống. | Trong `filterTasks` ở `lib/tasks.ts`, đưa phần ghi chú vào chuỗi được tìm kiếm. |

Nếu Network quá nhanh để thấy skeleton, bật throttling trước khi tải lại CSR. Để chạy lại demo CRUD từ đầu, dùng **Khôi phục mẫu** trên sổ nghiên cứu.
