# Ba chiến lược rendering

| Route | Thời điểm danh sách được render | HTML đầu | Dữ liệu trong Network |
| --- | --- | --- | --- |
| `/csr` | Browser có JavaScript và API phản hồi | Skeleton | Browser gọi `/api/pokemon` |
| `/ssr` | Server xử lý mỗi request | Có thẻ Pokémon | Dữ liệu được đọc trong server |
| `/ssg` | Next.js build trước request | Có thẻ Pokémon | Server trả HTML đã tạo |

## Kiểm chứng trong production

1. Chạy `pnpm build` rồi `pnpm start`. Truy cập từng route bằng URL trực tiếp để đo điều hướng tài liệu.
2. Trong DevTools Network, tải lại `/csr`, bật **Disable cache** và lọc **Fetch/XHR** để thấy `/api/pokemon`. Có thể bật throttling để giữ skeleton trên màn hình lâu hơn.
3. Mở **View Page Source**, tìm `data-pokemon-id="25"` tại cả ba route. Lặp lại qua tab Elements sau khi CSR đã gọi API để so sánh DOM thực tế với HTML phản hồi.
4. Kiểm tra ký hiệu route trong output build. `/ssr` có ký hiệu động. `/ssg` tạo `.next/server/app/ssg.html`. Shell của `/csr` cũng được prerender, còn dữ liệu Pokédex xuất hiện khi browser render danh sách.
5. Nếu muốn minh họa độ mới, chỉnh dữ liệu địa điểm của một Pokémon khi production đang chạy và tải lại. SSR và API đọc fixture đang có trên đĩa. SSG giữ nội dung cũ tới lần rebuild vì demo không cấu hình revalidation. Khôi phục fixture trước khi đo benchmark tiếp.

Tham khảo [cấu hình route segment của Next.js](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config).
