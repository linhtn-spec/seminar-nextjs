# Kịch bản thuyết trình · Rendering, tối ưu hiệu năng và kiểm thử component

**Thời lượng gợi ý:** 23–25 phút trình bày, sau đó hỏi đáp. Dùng deck `Seminar_05_Frontend_Roadmap_Tieng_Viet_Da_Chinh_Sua.pptx` ở thư mục gốc, cạnh `README.md`. Nội dung bám sát cấu trúc **Mở đầu → Phần 1: Rendering → Phần 2: Chỉ số & Tối ưu (gồm đo Lighthouse Before/After & Component Test) → Q&A**. Phần **Nói** là lời dẫn nói miệng mạch lạc theo slide; phần **Demo** là thao tác trực hành trên trình duyệt/IDE ở các slide có nhãn **DEMO** (8, 11, 16, 17, 18, 20, 21 và 26).

## Chuẩn bị trước buổi nói

1. Từ thư mục project, chạy `pnpm build`, rồi `pnpm exec next start --hostname 127.0.0.1 -p 4173`. Dùng `http://127.0.0.1:4173` làm địa chỉ gốc. Bắt buộc dùng production build khi đối chiếu HTML ban đầu, `<link rel="preload">` và tab Network.
2. Mở sẵn các tab `/csr`, `/ssr`, `/ssg`, `/components`, `/benchmark`, `/labs/js-before`, `/labs/js-after`, `/labs/banner-before`, `/labs/banner-after`, `/lazy-load`, `/performance`, `/tests`. Tất cả đều có trong menu điều hướng bên trái.
3. Mở Chrome DevTools, giữ tab Network; bật **Disable cache** khi demo lần tải mới. Trong IDE, mở `app/ssr/page.tsx`, `app/ssg/page.tsx`, `app/components/page.tsx`, `components/pokedex-filter.tsx`, `app/labs/js-after/page.tsx`, `app/labs/banner-after/page.tsx`, `tests/tasks.test.tsx`.
4. **Test tạo nhiệm vụ đang thất bại có chủ đích.** Form hiện cho lưu tên rỗng, còn test vẫn đòi thông báo “Tên nhiệm vụ là bắt buộc.” Khi chạy `pnpm test` hoặc trang `/tests`, kết quả dự kiến là 1 đạt, 1 thất bại. Đừng trình bày đây là một bộ test đã xanh.
5. Bảng số liệu trên `/benchmark` và trong slide được đo thực tế từ bản production ngày **27/11/2026** bằng script `pnpm benchmark` (Chrome headless, Lighthouse 13.6.0, mobile preset). Nếu sửa code hoặc đổi máy, chạy lại `pnpm benchmark` trước khi đọc số mới.

## Lời dẫn theo slide

### Slide 1 · Mở đầu · 0:00–0:30

**Nói:** “Chào mọi người, hôm nay mình đại diện trình bày chuyên đề Lộ trình Frontend do mình và Vương An Khang thực hiện. Chủ đề hôm nay là cách chọn chiến lược Rendering kết hợp các kỹ thuật tối ưu hóa và kiểm thử để giải bài toán nâng cao hiệu năng lẫn chất lượng code, có đo lường thực tế bằng Lighthouse.”

### Slide 2 · Nội dung trình bày (Menu) · 0:30–1:00

**Nói:** “Bài nói gồm phần Mở đầu đặt bài toán và hai phần trọng tâm. Phần một là Rendering: phân tích cơ chế, ưu nhược điểm và khi nào dùng CSR, SSR, SSG cũng như Server và Client Components. Phần hai đi vào Chỉ số Core Web Vitals, các kỹ thuật tối ưu thực tế như lazy load, giảm JS, tối ưu ảnh, cache, memo, server state, đối chiếu số liệu Lighthouse trước/sau sửa code, và cuối cùng là viết Component Test.”

### Slide 3 · Tổng quan bài toán: Hiệu năng & Chất lượng code · 1:00–1:40

**Nói:** “Bài chia sẻ hôm nay không đi theo hướng lý thuyết rời rạc. Thực tế một trang web thường chậm vì HTML về muộn, gửi thừa JavaScript, hoặc ảnh và dữ liệu tải trễ; đồng thời khi tối ưu hoặc sửa code mà thiếu test thì rất dễ phát sinh lỗi hồi quy. Vì vậy mục tiêu của nhóm là phối hợp đúng kiến trúc render với các biện pháp tối ưu cụ thể trên ứng dụng Pokédex Lab, sau đó dùng Lighthouse đo định lượng trước và sau khi sửa code để chứng minh hiệu quả.”

### Slide 4 · Hai trục quyết định trên cùng một trang · 1:40–2:10

**Nói:** “Trước khi đi sâu vào từng kỹ thuật, cần tách rõ hai quyết định độc lập trên cùng một trang. Thứ nhất là thời điểm tạo HTML: ở trình duyệt (CSR), theo từng request (SSR), hay lúc build (SSG). Thứ hai là nơi chạy mã React: giữ ở Server Component hay gửi xuống Client Component.”

### Slide 5 · CSR: Cơ chế, ưu nhược điểm & khi dùng · 2:10–2:50

**Nói:** “Với CSR, HTML ban đầu chỉ là khung rỗng; trình duyệt phải tải JavaScript rồi gọi API để dựng nội dung. Ưu điểm của CSR là giảm tải tính toán HTML cho server và xử lý tương tác nhiều trạng thái rất mượt. Nhược điểm là HTML đầu tiên chưa có dữ liệu, tốn thêm dung lượng JS và kéo dài thời gian chờ API. Vì vậy nên dùng CSR cho trang quản trị nội bộ, vùng dữ liệu tải sau đăng nhập hoặc widget nhiều tương tác.”

### Slide 6 · SSR: Cơ chế, ưu nhược điểm & khi dùng · 2:50–3:30

**Nói:** “Ngược lại, ở SSR, mỗi khi có request tới, máy chủ đọc dữ liệu và tạo sẵn HTML hoàn chỉnh gửi về trình duyệt. Ưu điểm là người dùng và công cụ tìm kiếm nhận được nội dung ngay trong HTML đầu tiên, luôn mới theo từng yêu cầu. Nhược điểm là server tốn CPU xử lý mỗi lượt truy cập và nếu API/DB chậm thì TTFB và LCP sẽ chậm theo. SSR phù hợp cho trang cần dữ liệu cá nhân hóa theo người dùng hoặc thay đổi liên tục theo từng request.”

### Slide 7 · SSG: Cơ chế, ưu nhược điểm & khi dùng · 3:30–4:10

**Nói:** “Còn với SSG, toàn bộ HTML được tạo sẵn một lần ngay lúc build và dùng lại cho mọi lượt truy cập. Ưu điểm là tốc độ phản hồi cực nhanh qua CDN, gần như không tốn công xử lý trên server và TBT rất thấp. Nhược điểm là nội dung đứng yên cho đến lần build sau hoặc phải cấu hình làm mới định kỳ. Do đó SSG rất hợp cho trang giới thiệu, tài liệu kỹ thuật, blog hoặc danh mục công khai ít thay đổi.”

### Slide 8 · So sánh 3 kiểu render & Demo 1 · 4:10–6:10

**Nói:** “Cùng một danh sách 9 Pokémon, ba chiến lược khác nhau hoàn toàn ở thời điểm nội dung xuất hiện: CSR chờ JS và API, SSR tạo HTML ở mỗi request, còn SSG tạo sẵn lúc build. Mình mở trực tiếp trên trình duyệt để kiểm chứng bằng Network và View Page Source.”

**Demo (khoảng 2 phút):** Mở `/csr`, bật Network và lọc **Fetch/XHR** để chỉ rõ request `/api/pokemon`. Tiếp theo mở `/ssr` và `/ssg`, mở **View Page Source**, tìm `data-pokemon-id="25"` để thấy dữ liệu đã nằm sẵn trong HTML gốc. Mở `/visualizer` hoặc IDE đối chiếu `force-dynamic` ở `app/ssr/page.tsx` với `force-static` ở `app/ssg/page.tsx`.

### Slide 9 · Chọn CSR, SSR, SSG khi nào? · 6:10–6:45

**Nói:** “Tóm gọn tiêu chí lựa chọn trong dự án: nội dung công khai ít đổi thì ưu tiên SSG; trang bắt buộc HTML mới từng request hoặc phụ thuộc phiên đăng nhập thì dùng SSR; còn vùng giao diện tương tác nặng sau khi trang đã lên khung thì chọn CSR. Thực tế một ứng dụng kết hợp linh hoạt cả ba.”

### Slide 10 · Server & Client Components: Cơ chế, ưu nhược điểm · 6:45–7:25

**Nói:** “Chuyển sang trục thứ hai là Server và Client Components trong React. Server Component chạy hoàn toàn trên máy chủ, đọc trực tiếp dữ liệu, giữ bí mật và gửi 0 KB JavaScript xuống trình duyệt. Client Component dùng chỉ thị `'use client'` để xử lý state, sự kiện bấm/nhập và Web API, nhưng đổi lại phải đóng gói mã JS gửi cho browser. Nguyên tắc là chỉ đặt `'use client'` đúng ở nút bấm, form hoặc vùng lọc tương tác.”

### Slide 11 · Cây thành phần & Demo Server/Client · 7:25–8:45

**Nói:** “Nhìn vào cây component thực tế: component trang đọc dữ liệu vẫn nằm trên Server, còn phần thanh tìm kiếm và lọc hệ mới đánh dấu `'use client'`. Ranh giới client càng nhỏ thì dung lượng JS gửi xuống trình duyệt càng nhẹ. Mình kiểm chứng trực tiếp ở route `/components`.”

**Demo (khoảng 1 phút):** Mở `/components` cùng `app/components/page.tsx` và `components/pokedex-filter.tsx`. Chỉ rõ `getPokemon()` chạy trên server và `'use client'` chỉ nằm ở `PokedexFilter`. Gõ tìm kiếm để minh họa phần tương tác chạy mượt trên client.

### Slide 12 · Hydration: gắn tương tác vào HTML · 8:45–9:15

**Nói:** “Một điểm dễ nhầm là cứ Client Component thì chỉ có CSR. Thực tế nhờ bước Hydration, HTML của cả Server và Client Component vẫn có thể được SSR/SSG dựng sẵn từ server để hiển thị sớm; sau đó React mới tải JS và gắn bộ lắng nghe sự kiện vào các nút bấm trên trình duyệt.”

### Slide 13 · Core Web Vitals: LCP, INP/TBT và CLS · 9:15–10:00

**Nói:** “Sang Phần hai về chỉ số và tối ưu. Trải nghiệm người dùng được lượng hóa qua ba chỉ số Core Web Vitals. LCP đo lúc nội dung lớn nhất xuất hiện, ngưỡng tốt dưới 2,5 giây. INP đo độ trễ phản hồi khi người dùng thao tác, ngưỡng tốt dưới 200 ms — lưu ý khi đo tải trang bằng Lighthouse (Lab), mình dùng chỉ số TBT để phản ánh mức tắc luồng chính trước khi tương tác. Cuối cùng CLS đo độ xô lệch bố cục, cần giữ dưới 0,1.”

### Slide 14 · Lab Data và Field Data: đo khi nào? · 10:00–10:35

**Nói:** “Mình cũng tách rõ hai nguồn số liệu: Lab Data đo bằng Lighthouse trong điều kiện mô phỏng chuẩn hóa giúp so sánh công bằng trước và sau mỗi lần sửa code, và đây là phạm vi demo hôm nay. Khi đưa sản phẩm lên production thật, team cần thu thêm Field Data qua CrUX hoặc thư viện `web-vitals` để theo dõi INP, LCP và CLS thực tế từ thiết bị người dùng.”

### Slide 15 · Đo Lighthouse trên bản production · 10:35–11:10

**Nói:** “Để phép đo không bị sai lệch, toàn bộ benchmark phải chạy trên bản build production, giữ cùng dữ liệu, cùng thiết bị mô phỏng mobile và đo lặp tối thiểu 3 lượt lấy trung vị. Sáu chỉ số mình đối chiếu xuyên suốt là: điểm Performance, FCP, LCP, CLS, TBT và dung lượng JavaScript truyền qua mạng.”

### Slide 16 · Demo 1 · Kết quả Lighthouse: CSR vs SSR vs SSG · 11:10–12:30

**Nói:** “Trên cùng một trang Pokédex 9 loài, đây là kết quả đo thực tế ngày 27/11 bằng Lighthouse. CSR tốn khoảng 183,6 kB JS (15 request), TBT 121 ms và LCP 758 ms. Trong khi đó SSR và SSG giảm xuống còn 139,3 kB JS (10 request), TBT chỉ còn 101 ms và 80 ms, điểm Performance đạt 99–100. Mình mở tab `/benchmark` để xem chi tiết từng chỉ số.”

**Demo (khoảng 1 phút):** Mở `/benchmark`, đối chiếu biểu đồ LCP và bảng tổng hợp giữa `/csr`, `/ssr` và `/ssg`. Giải thích vì sao CSR tốn nhiều JS và nhiều request hơn (tải thêm TanStack Query và gọi `/api/pokemon`), còn vì sao trên fixture đọc tại chỗ thì SSR đang có FCP/LCP rất tốt (607 ms).

### Slide 17 · Giảm JavaScript ban đầu & Lazy load · 12:30–13:30

**Nói:** “Từ kết quả đo, mình bước vào nhóm giải pháp tối ưu. Nhóm thứ nhất là giảm JS ban đầu và Lazy load. Thay vì bọc `'use client'` tràn lan và import đồng bộ các widget dữ liệu lớn ngay khi mở trang, mình giữ khung chính ở Server Component, tách widget nặng bằng `next/dynamic(..., { ssr: false })` chỉ tải khi bấm mở, và dùng `IntersectionObserver` để hoãn ảnh phía dưới màn hình ở `/lazy-load`. Lưu ý quan trọng: không bao giờ lazy load phần tử chính ở màn hình đầu kẻo hỏng LCP.”

**Demo (khoảng 1 phút 15 giây):** Mở tab Network (lọc **JS**, bật **Disable cache**). Truy cập `/labs/js-before` để thấy bundle nặng chứa dữ liệu 151 loài Kanto tải ngay lập tức; chuyển sang `/labs/js-after` tải lại thấy tổng JS ban đầu nhẹ đi đáng kể, sau đó bấm nút **Tải và mở phân tích 151 Pokémon** để thấy chunk JS mới được nạp động. Nếu kịp, lướt nhanh `/lazy-load` cuộn trong khung ảnh để thấy ảnh chỉ tải khi lọt vào vùng nhìn thấy.

### Slide 18 · Tối ưu ảnh & Tải sớm banner (`priority`) · 13:30–14:35

**Nói:** “Kỹ thuật thứ hai nhắm thẳng vào LCP và CLS là tối ưu ảnh và tải sớm banner. Ảnh lớn đầu trang không nên để `loading=\"lazy\"` chờ JS chạy xong mới tải. Khi chuyển sang định dạng WebP, khai báo đủ `width`/`height` giữ khung chống CLS, và gắn `priority` trên `<Image>`, Next.js tự chèn thẻ `<link rel=\"preload\" as=\"image\">` ngay trong HTML đầu tiên giúp banner được tải song song trước cả script.”

**Demo (khoảng 1 phút):** Mở DevTools Network trên `/labs/banner-before` và `/labs/banner-after`. Chỉ vào thứ tự waterfall: ở `banner-before`, ảnh PNG nặng (989 KB) chỉ bắt đầu tải sau khi JS hydrate; sang `banner-after`, `banner-kanto.webp` (30,6 KB) có `fetchpriority="high"` và xuất hiện ngay đầu danh sách request sau HTML.

### Slide 19 · Cache đa tầng & Quản lý Server State · 14:35–15:25

**Nói:** “Kỹ thuật thứ ba là Cache đa tầng và quản lý Server State. Ở tầng mạng và build, SSG cùng header `Cache-Control` giúp tái sử dụng HTML/ảnh nhanh chóng. Còn với dữ liệu API lấy trên trình duyệt (Server State), dữ liệu nằm ở server và có thể cũ hoặc lỗi, nên mình dùng TanStack Query quản lý cache trong bộ nhớ qua `queryKey`, cấu hình `staleTime` để không gọi trùng lặp và xử lý rõ loading/error.”

### Slide 20 · Memo hóa & Demo Cache / Memo · 15:25–16:50

**Nói:** “Kỹ thuật thứ tư là Memo hóa bằng `React.memo` và `useMemo` nhằm bỏ qua render hoặc tính toán lặp lại khi props không đổi — tất nhiên chỉ áp dụng ở nơi đã đo thấy tốn chi phí vì nếu state hay context đổi thì component vẫn render lại. Mình mở `/performance` để kiểm chứng trực tiếp cả `React.memo` lẫn cache Server State của TanStack Query.”

**Demo (khoảng 1 phút 15 giây):** Trên `/performance`, bấm **Tăng bộ đếm cha** hai lần: bộ đếm của component thường tăng, ô `React.memo` giữ nguyên; sau đó bấm **Đổi khu khảo sát** để thấy khi props đổi thì cả hai cập nhật. Tiếp theo ở mục Server State bên dưới, bấm **Ẩn danh sách** rồi **Mở lại danh sách** trong vòng 60 giây — không có request mới trên Network; bấm **Gọi lại API** hoặc **Mô phỏng lỗi API** để xem xử lý lỗi 503.

### Slide 21 · Demo 2 · Số liệu Lighthouse Trước / Sau sửa code · 16:50–18:10

**Nói:** “Đây là kết quả tổng hợp đo bằng Lighthouse để thấy rõ tác động sau khi sửa code. Ở thí nghiệm tối ưu tải JS (`js-before` sang `js-after`), dung lượng JS truyền qua mạng giảm 42% từ 255,4 kB xuống 148,4 kB, TBT giảm mạnh 75% từ 370 ms xuống 91 ms, đẩy điểm Performance từ 91 lên 100. Còn ở thí nghiệm ảnh banner `priority`, cùng dung lượng JS khoảng 146 kB nhưng LCP giảm từ 2.166 ms xuống 1.808 ms (nhanh hơn 17%, giữ CLS = 0 và đạt 100 điểm Performance).”

**Demo (khoảng 1 phút):** Mở `/benchmark#before-after`, chỉ trực tiếp hai bảng so sánh **Trước và Sau** đủ 6 chỉ số `Performance`, `LCP`, `CLS`, `TBT`, `FCP` và `JavaScript`, kèm hai nút mở nhanh bản Trước/Sau để đối chiếu trực tiếp.

### Slide 22 · Chất lượng code: Vấn đề khi không viết test · 18:10–18:50

**Nói:** “Tối ưu hiệu năng tốt rồi nhưng nếu code dễ gãy khi chỉnh sửa thì hiệu năng cũng không bền vững. Khi dự án thiếu test tự động, mỗi lần sửa code team phải bấm tay kiểm tra lại từ đầu, dễ sót regression bug và rất ngại refactor.”

### Slide 23 · Component Testing là gì? · 18:50–19:25

**Nói:** “Component Testing là viết test tự động kiểm tra hành vi của một phần giao diện dựa trên đúng thứ người dùng nhìn thấy và thao tác: từ render nội dung, tác động của props, nhập liệu, bấm nút cho tới các thông báo lỗi validation.”

### Slide 24 · Công cụ Component Testing · 19:25–20:00

**Nói:** “Trong demo này mình dùng ba công cụ tiêu chuẩn: Vitest để chạy và báo cáo kết quả test; React Testing Library để render và truy vấn UI theo vai trò truy cập; và User Event để mô phỏng thao tác gõ phím, bấm nút sát hành vi thật.”

### Slide 25 · Nguyên tắc viết test: AAA · 20:00–20:35

**Nói:** “Mỗi bài test giữ cấu trúc ba bước AAA rõ ràng: Arrange chuẩn bị dữ liệu và render component, Act thực hiện thao tác như người dùng, và Assert kiểm tra kết quả hiển thị trên giao diện. Cấu trúc này giúp nhìn vào test thất bại là biết ngay giao diện đang sai ở đâu.”

### Slide 26 · Kết quả demo: Test phát hiện lỗi · 20:35–22:00

**Nói:** “Bây giờ mình chạy bộ test sổ nhiệm vụ gồm hai luồng: tìm kiếm và tạo mới. Kết quả cho thấy test tìm kiếm đạt, còn test tạo mới thất bại đúng như thiết kế để minh họa khả năng bắt bug: form đang cho lưu tên rỗng trong khi test yêu cầu thông báo lỗi bắt buộc.”

**Demo (khoảng 1 phút 15 giây):** Mở `/tests`, bấm **Chạy tất cả test** để thấy kết quả **1 đạt, 1 thất bại**. Mở chi tiết case tạo nhiệm vụ và đối chiếu ba bước AAA trong `tests/tasks.test.tsx`.

### Slide 27 · Tổng kết bài toán: Hiệu năng & Chất lượng code · 22:00–22:50

**Nói:** “Để khép lại toàn bộ mạch bài, đây là bức tranh tổng hợp bốn bước giải bài toán thực tế: thứ nhất chọn đúng chiến lược render và thu gọn ranh giới Client; thứ hai áp dụng các biện pháp tối ưu như giảm JS bằng `dynamic()`, ưu tiên banner `priority`/WebP, cache đa tầng và `memo`; thứ ba kiểm chứng lại bằng số liệu Lighthouse trước và sau kèm Field data ở production; và thứ tư bảo vệ chất lượng code khi bảo trì bằng Component Test.”

### Slide 28 · Q&A · Hỏi đáp & Thảo luận · 22:50–24:00

**Nói:** “Phần trình bày của tụi mình xin phép dừng ở đây. Cảm ơn mọi người đã theo dõi — trên màn hình là ba câu hỏi gợi mở liên quan đến chọn Render và thu gọn JS, theo dõi Field data bên cạnh Lighthouse Before/After, và ưu tiên viết Component Test. Mời cả nhóm cùng đặt câu hỏi và thảo luận ạ.”

## Khi demo không ra đúng dấu vết

- Nếu DevTools không hiện lại chunk `dynamic` hoặc ảnh ở `/lazy-load`, nhớ bật **Disable cache** và tải lại trang khi DevTools đã mở; riêng `/lazy-load` cần cuộn *bên trong khung ảnh*.
- Nếu CSR hết skeleton quá nhanh trên local, dùng throttling trong Network (ví dụ *Slow 3G*) để thấy rõ chuỗi request và waterfall banner `before` vs `after`.
- Nếu `/tests` trả lỗi khi chạy, kiểm tra server đang chạy qua `127.0.0.1` hoặc `localhost` và dependency đã cài đầy đủ. Trạng thái kỳ vọng vẫn là 1 đạt, 1 thất bại có chủ đích.
- Nếu cần đối chiếu lại số liệu sau khi sửa code, chạy `pnpm benchmark` (cần Chrome/Chromium trên máy local).

## Tài liệu đối chiếu

- [Next.js: Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Next.js: Image Optimization & `priority`](https://nextjs.org/docs/app/api-reference/components/image)
- [Next.js: Lazy Loading](https://nextjs.org/docs/app/guides/lazy-loading)
- [Web Vitals](https://web.dev/articles/vitals)
- [Lighthouse Performance Scoring](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring)
