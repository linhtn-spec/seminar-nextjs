# Hỏi đáp & Thảo luận (Q&A)

Tài liệu gồm **3 câu hỏi gợi mở thảo luận** ở Slide 27 và **15 câu hỏi kỹ thuật chi tiết** để đối chiếu nhanh khi trả lời trong buổi seminar.

---

## Phần 1 · 3 câu hỏi thảo luận trên Slide 27

### 1. Dự án nên dùng SSR/SSG cho trang nào, và đặt ranh giới `'use client'` ở đâu?

- **Chọn chiến lược render theo độ mới và tính cá nhân hóa của dữ liệu:**
  - **SSG (hoặc SSG + revalidation):** Dùng cho trang nội dung dùng chung, ít thay đổi hoặc cập nhật theo chu kỳ/đợt phát hành (trang giới thiệu, tài liệu, danh mục công khai). Cần tính thêm thời gian build và chính sách làm mới dữ liệu.
  - **SSR:** Dùng cho trang bắt buộc HTML mới ở mỗi request, phụ thuộc quyền truy cập/phiên người dùng hoặc dữ liệu thay đổi liên tục ngay tại thời điểm tải trang. Cần đo TTFB và độ trễ truy vấn trên server ở mức tải dự kiến.
  - **CSR:** Dùng cho phần giao diện nhiều tương tác sau đăng nhập hoặc dữ liệu chỉ cần tải khi người dùng mở một vùng chức năng riêng. Cần thiết kế rõ trạng thái skeleton/loading, lỗi, thử lại và chiến lược cache.
- **Nguyên tắc đặt ranh giới `'use client'`:**
  - Giữ phần đọc dữ liệu (`getPokemon()` trong `app/components/page.tsx`), truy cập tài nguyên server (`node:fs/promises`), giữ bí mật và tạo khung HTML ở **Server Component**.
  - Chỉ gắn `'use client'` quanh phần nhỏ nhất thật sự cần `useState`, event handler, `localStorage` hoặc Web API của trình duyệt (như `components/pokedex-filter.tsx` hay `components/task-manager.tsx`). Đặt ranh giới client càng gọn thì lượng JavaScript gửi xuống browser càng dễ kiểm soát (như trong cây component ở `/components`, `PokemonList` chỉ bị kéo vào client graph khi được import từ Client Component `PokedexFilter`).

### 2. Ngoài đo Lighthouse (lab), team nên theo dõi thêm dữ liệu thật (field data) thế nào?

- **Phân biệt Lab data và Field data:**
  - **Lab data (`pnpm benchmark` / Lighthouse):** Chạy trong môi trường mô phỏng có kiểm soát (trong repo dùng Chrome headless, mobile preset, RTT 150 ms, thông lượng 1638.4 Kbit/s, CPU giảm tốc 4x, cache lạnh). Ưu điểm là dễ lặp lại để so sánh trước/sau một thay đổi code qua FCP, LCP, CLS, TBT, kích thước JS/HTML và số request. Tuy nhiên, benchmark navigation không thu được **INP**.
  - **Field data (dữ liệu người dùng thật / RUM):** Phản ánh thiết bị, băng thông, cache ấm/lạnh và thao tác thực tế của người dùng cuối (đặc biệt để đo **INP**, LCP và CLS thực tế ở phân vị 75).
- **Hướng theo dõi cho team:**
  - Dùng **Lab data** trong quá trình phát triển và trước khi merge để kiểm chứng thay đổi cấu trúc/bundle.
  - Bổ sung **Field data** trên production (ví dụ thu thập các chỉ số Core Web Vitals qua thư viện `web-vitals` hoặc dữ liệu CrUX/analytics theo từng route và thiết bị) để phát hiện nút thắt mà môi trường lab không mô phỏng hết (tương tác dài làm tăng INP, mạng yếu theo khu vực, hoặc cache miss). Khi số liệu thực tế khác kỳ vọng, đối chiếu lại HTML ban đầu, waterfall mạng, dung lượng JavaScript và trace tương tác trong DevTools Performance.

### 3. Những luồng UI nào nên ưu tiên viết Component Test trước để ít tốn công bảo trì?

- **Ưu tiên các luồng có giá trị bảo vệ cao nhất:**
  - **Form tạo/chỉnh sửa dữ liệu và validation:** Bắt lỗi thiếu ràng buộc ngay từ code (ví dụ trong `tests/tasks.test.tsx`, test phát hiện `taskTitleLengthSchema` ở `lib/tasks.ts` đang thiếu kiểm tra rỗng nên form cho lưu tên trống thay vì báo lỗi `"Tên nhiệm vụ là bắt buộc."`).
  - **Tìm kiếm, lọc và chuyển trạng thái hiển thị:** Đảm bảo người dùng thấy đúng dữ liệu hoặc thông báo rỗng/lỗi khi gõ từ khóa, chọn bộ lọc (như case tìm `"squirtle"` và `"không có"` ở `tests/tasks.test.tsx`).
  - **Các luồng nghiệp vụ chính dễ phát sinh regression bug khi refactor.**
- **Cách viết để ít tốn công bảo trì:**
  - Tổ chức theo **AAA (Arrange – Act – Assert)** bằng **Vitest**, **React Testing Library** và **`userEvent`**.
  - Truy vấn và kiểm chứng dựa trên **những gì người dùng nhìn thấy và thao tác** (`getByRole`, `getByText`, `toBeVisible`) thay vì phụ thuộc vào tên biến state nội bộ hay class CSS. Nhờ vậy, khi team refactor cấu trúc code bên trong mà hành vi giao diện không đổi, bộ test vẫn ổn định và không phải sửa lại liên tục.

---

## Phần 2 · 15 câu hỏi kỹ thuật về kiến trúc & demo

1. **Ở route `/csr`, quá trình render dữ liệu diễn ra như thế nào và HTML ban đầu chứa gì?**
   Route `/csr` (`app/csr/page.tsx`) dùng `CsrPokedex` (Client Component). Khi browser tải trang lần đầu, server chỉ trả về khung layout và trạng thái skeleton. Sau khi trình duyệt tải và thực thi JavaScript, TanStack Query mới gọi `GET /api/pokemon`, nhận JSON rồi dựng danh sách 9 Pokémon lên DOM.

2. **Tại sao `/csr` vẫn có shell prerender trong HTML ban đầu — điều này có mâu thuẫn với CSR không?**
   Không. Next.js App Router có thể prerender phần khung trang (layout, tiêu đề, skeleton) sẵn vào HTML để người dùng thấy bố cục sớm, còn dữ liệu chính (danh sách Pokémon) vẫn được fetch và render hoàn toàn phía client sau khi có JavaScript.

3. **Ở `/ssr`, Server Component lấy dữ liệu qua API mạng hay đọc trực tiếp trên server?**
   Ở `/ssr` (`app/ssr/page.tsx`), Server Component gọi trực tiếp hàm `getPokemon()` (`lib/pokemon-server.ts`) để đọc fixture JSON trên đĩa của server, không cần mở một HTTP request tới chính nó. Đường HTTP `/api/pokemon` chỉ phục vụ phía trình duyệt trong `/csr` và phần thử nghiệm TanStack Query ở `/performance`.

4. **Cấu hình nào trong code bắt buộc route `/ssr` render động ở mỗi request và `/ssg` tạo HTML tĩnh lúc build?**
   Trong `app/ssr/page.tsx`, dòng `export const dynamic = 'force-dynamic'` buộc Next.js render HTML lại theo từng request. Trong `app/ssg/page.tsx`, cặp `export const dynamic = 'force-static'` và `export const revalidate = false` chỉ thị Next.js tạo sẵn HTML tĩnh ở bước `pnpm build` (xuất ra `.next/server/app/ssg.html`) và phục vụ lại cho nhiều lượt truy cập.

5. **Khi dữ liệu trong `lib/pokemon.json` thay đổi, trang `/ssg` có tự cập nhật không và xử lý thực tế thế nào?**
   Trong cấu hình demo hiện tại (`revalidate = false`), `/ssg` giữ nguyên nội dung cũ cho đến lần `pnpm build` tiếp theo, trong khi `/ssr` và `/api/pokemon` đọc dữ liệu mới ngay khi tải lại. Trong sản phẩm thực tế, nếu nội dung ít đổi nhưng cần làm mới định kỳ, có thể bật Incremental Static Regeneration (`revalidate` theo giây hoặc revalidate theo tag/on-demand).

6. **Server/Client Components (RSC) và SSR/SSG khác nhau ở điểm nào — có thể dùng chung trên cùng một route không?**
   Khác nhau về trục quyết định: **CSR / SSR / SSG** trả lời câu hỏi *khi nào nội dung HTML được tạo* (ở browser, theo từng request trên server, hay lúc build); còn **Server / Client Components** trả lời *mã component chạy ở đâu* (chỉ ở server hay gửi xuống browser để chạy tương tác). Chúng hoàn toàn kết hợp được trên cùng một route: ví dụ một route SSR hoặc SSG vẫn có thể render sẵn HTML ban đầu cho cả Server Component lẫn Client Component (`PokedexFilter`).

7. **Nếu tắt JavaScript trên trình duyệt khi mở `/components`, người dùng có thấy danh sách Pokémon ban đầu không?**
   Có. Ở `app/components/page.tsx`, Server Component đọc sẵn dữ liệu Pokémon và trả HTML đầy đủ xuống trình duyệt ngay từ phản hồi đầu tiên. Khi tắt JavaScript, người dùng vẫn nhìn thấy danh sách Pokémon, chỉ có phần tương tác của Client Component (`PokedexFilter`: ô tìm kiếm và bộ lọc hệ) là chưa hoạt động.

8. **Hydration là gì và tại sao ở `/components` người dùng có thể thấy nút/ô nhập trước khi bấm được?**
   Hydration là bước React trên trình duyệt đối chiếu cây DOM từ HTML sẵn có và gắn event listener, state vào các Client Component. Vì HTML hiển thị được vẽ trước khi gói JavaScript tải xong và hydrate hoàn tất, người dùng có thể nhìn thấy giao diện trước một nhịp ngắn rồi các ô nhập/nút bấm mới thực sự phản hồi (mô phỏng trực tiếp qua hai trạng thái *HTML ban đầu* và *Sau hydration* ở `/components`).

9. **RSC payload mang dữ liệu gì từ server xuống trình duyệt?**
   RSC payload mang biểu diễn tuần tự hóa (serialized) của cây Server Components đã chạy trên server, các props truyền xuống Client Components (như mảng `pokemon` truyền vào `PokedexFilter`), cùng tham chiếu tới những module Client Component cần tải trong client graph. Nhờ vậy, mã chỉ chạy trên server (như đọc file `node:fs/promises`) không bị đóng gói gửi xuống browser.

10. **Làm thế nào để kiểm chứng chắc chắn HTML trả về của `/ssr` và `/ssg` đã có dữ liệu trước khi JavaScript chạy?**
    Chạy bản production (`pnpm build && pnpm start`), mở **View Page Source** (hoặc kiểm tra response document đầu tiên trong tab Network, hoặc mở file `.next/server/app/ssg.html`) rồi tìm chuỗi `data-pokemon-id="25"`. Tại `/ssr` và `/ssg`, thẻ Pokémon đã nằm sẵn trong HTML gốc; tại `/csr`, HTML gốc chỉ có skeleton và phải chờ request `/api/pokemon` hoàn tất mới xuất hiện trong DOM (tab Elements). Không dùng tab Elements sau khi trang đã chạy xong JS để suy ngược về HTML ban đầu.

11. **Cache của TanStack Query khác gì với HTTP cache của trình duyệt ở màn hình `/performance`?**
    Cache của TanStack Query nằm trong **bộ nhớ ứng dụng (in-memory)** trên JavaScript runtime, quản lý theo `queryKey`, `staleTime` và hỗ trợ invalidation/refetch chủ động ngay trong UI (như nút *Ẩn danh sách* / *Mở lại danh sách* trong 60 giây hoặc *Gọi lại API* ở `/performance`). Trong khi đó, HTTP cache nằm ở tầng mạng/trình duyệt hoặc CDN, được điều khiển bởi các HTTP header (`Cache-Control`, `ETag`...) và tồn tại độc lập với vòng đời React state.

12. **Có nên bọc `React.memo` cho mọi component để tối ưu hiệu năng không?**
    Không nên bọc tràn lan. `React.memo` chỉ có thể bỏ qua một lượt render lại khi toàn bộ props không thay đổi theo so sánh nông (shallow comparison), và bản thân phép so sánh props cũng tốn chi phí; ngoài ra nếu state nội bộ hoặc context bên trong đổi thì component vẫn render lại. Như thí nghiệm ở `/performance`, chỉ nên áp dụng khi đã đo được component đó render lại thường xuyên với props giữ nguyên và phép tính/DOM bên trong thực sự tốn thời gian (như vòng lặp tính toán ở `Population`).

13. **Lazy loading (`next/dynamic` hoặc trì hoãn tải ảnh) có đánh đổi gì và khi nào không nên dùng?**
    Lazy loading giúp giảm dung lượng JavaScript và tài nguyên cần tải ở lần mở trang đầu tiên (như `HabitatChart` dùng `next/dynamic(..., { ssr: false })` ở `/performance` hay ảnh cuộn trong `/lazy-load`). Đánh đổi là ở lần đầu người dùng mở/cuộn tới tính năng đó, trình duyệt phải chờ tải chunk/ảnh và thực thi trước khi hiển thị. Vì vậy **không nên** lazy load phần tử chính nằm ngay trong màn hình đầu tiên (above-the-fold), vì sẽ làm chậm **LCP**.

14. **Trong bảng đo Lighthouse, tại sao có chỉ số TBT mà không có INP — TBT có thay thế được INP không?**
    Không. **TBT (Total Blocking Time)** chỉ đo tổng thời gian luồng chính bị chặn bởi các long task trong lúc **tải trang ban đầu** ở môi trường lab (Lighthouse Navigation). Trong khi đó, **INP (Interaction to Next Paint)** đo độ trễ từ lúc người dùng thực sự tương tác (nhấp chuột, gõ phím) cho tới frame hiển thị tiếp theo xuyên suốt phiên sử dụng. TBT chỉ giúp cảnh báo sớm nguy cơ tắc luồng chính lúc tải, không thay thế được đo INP qua phiên tương tác trong DevTools Performance hoặc dữ liệu người dùng thật (field data).

15. **Từ bảng kết quả `reports/benchmark.md` (ngày 25/11/2026), có thể kết luận SSR luôn nhanh nhất trong mọi dự án không?**
    Không. Trong kết quả đo cụ thể của project này (median 3 lượt trên Chrome headless, mobile preset mô phỏng, server local đọc fixture tại chỗ): `/ssr` đạt LCP `608.495 ms`, TBT `76 ms`, JS `141,954 byte` (10 requests); `/ssg` đạt LCP `758.896 ms`, TBT `87 ms`, JS `141,954 byte` (10 requests); `/csr` đạt LCP `759.675 ms`, TBT `110 ms`, JS `187,264 byte` (15 requests). Kết quả này phản ánh đúng điều kiện dữ liệu nhẹ đọc tại local và cấu hình của bản build đó — ở hệ thống thật, nếu SSR phải chờ API/DB chậm từ xa thì TTFB và LCP có thể xấu hơn SSG rất nhiều.
