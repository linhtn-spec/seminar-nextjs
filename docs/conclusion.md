# Chọn chiến lược cho team

| Khi sản phẩm cần | Cách cân nhắc |
| --- | --- |
| Nội dung dùng chung, cập nhật theo lần phát hành hoặc có thời hạn làm mới rõ | Dùng SSG hoặc SSG kèm revalidation. Ước tính kích thước và thời gian build, chính sách làm mới. |
| Nội dung theo request, theo quyền hoặc bắt buộc mới ở lần hiển thị đầu | Dùng SSR cho phần dữ liệu đó. Đo độ trễ lấy dữ liệu và TTFB ở mức tải dự kiến. |
| Trải nghiệm sau đăng nhập hoặc dữ liệu chỉ cần khi người dùng mở một vùng tương tác | Dùng CSR cho vùng phù hợp. Thiết kế skeleton, lỗi, thử lại, cache và kiểm tra chi phí JavaScript. |

Với App Router, giữ phần đọc dữ liệu, tạo markup và logic chỉ chạy trên server trong Server Components khi phù hợp. Đặt ranh giới Client Component quanh vùng cần state, handler hoặc API browser. Chọn thời điểm render HTML theo độ mới của dữ liệu và lợi ích của nội dung hiển thị sớm.

Đối chiếu số đo tải ban đầu với trải nghiệm trong phiên sử dụng. Khi kết quả khác kỳ vọng, kiểm tra HTML ban đầu, waterfall, lượng JavaScript, LCP và trace tương tác trước khi đổi cả kiến trúc.
