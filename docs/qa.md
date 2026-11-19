# 15 câu hỏi kỹ thuật

1. **CSR trong demo render cái gì?** Danh sách Pokémon được tạo trên browser sau khi JavaScript chạy và API trả dữ liệu. HTML đầu có layout và skeleton.
2. **CSR shell được prerender có mâu thuẫn không?** Không. App Router có thể prerender khung trang, trong khi phần danh sách dùng dữ liệu chỉ lấy từ client.
3. **SSR đọc API qua mạng ở đâu?** Route SSR đọc fixture bằng hàm server nội bộ. Đường HTTP chỉ cần khi browser ở CSR gọi Route Handler.
4. **Cấu hình nào kích hoạt SSR của demo?** `dynamic = 'force-dynamic'` khiến Next.js render route theo request.
5. **SSG làm mới khi nào?** Trong cấu hình hiện tại, khi rebuild. Có thể cấu hình revalidation khi ứng dụng cần cập nhật định kỳ.
6. **RSC và SSR thuộc cùng nhóm lựa chọn không?** RSC thuộc kiến trúc component. SSR thuộc quyết định thời điểm render HTML. Chúng có thể cùng xuất hiện trên một route.
7. **Client Component có HTML ban đầu không?** Có thể có. `/components` có HTML danh sách và bộ lọc trước khi JavaScript gắn sự kiện.
8. **Hydration làm gì?** React khôi phục tính tương tác cho các phần client từ HTML ban đầu và dữ liệu render.
9. **RSC payload mang gì?** Biểu diễn kết quả Server Components, dữ liệu props đã tuần tự hóa và tham chiếu đến Client Components.
10. **Làm sao chứng minh SSR/SSG có nội dung ngay?** Soi HTTP response, View Page Source hoặc file `.next/server/app/ssg.html`. DOM sau tải có thể chứa nội dung do browser thêm.
11. **TanStack Query cache khác cache HTTP thế nào?** Cache query nằm trong bộ nhớ của ứng dụng theo query key, có chính sách stale và refetch riêng. Cache HTTP nằm ở browser hoặc hạ tầng theo header.
12. **React.memo có đáng dùng luôn không?** So sánh chi phí render và tần suất props thay đổi. So sánh props cũng có chi phí, nên cần đo workload thực tế.
13. **Lazy loading có đánh đổi gì?** Giảm JavaScript cần lúc đầu, nhưng lần đầu dùng tính năng phải chờ tải module và thực thi.
14. **TBT có thay được INP không?** TBT ghi thời gian chặn trong lần tải. INP phản ánh tương tác. Dùng phiên tương tác hoặc dữ liệu thực địa phù hợp để đo INP.
15. **Có thể kết luận SSG nhanh nhất từ bảng này không?** Bảng chỉ mô tả project này dưới điều kiện đã ghi. Cache, độ trễ API, dung lượng JS, dữ liệu và công việc render đều ảnh hưởng kết quả.
