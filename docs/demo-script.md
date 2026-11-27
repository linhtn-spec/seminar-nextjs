# Kịch bản thuyết trình · Rendering, hiệu năng và test component

**Thời lượng gợi ý:** 22–24 phút trình bày, sau đó hỏi đáp. Dùng deck `Seminar_05_Frontend_Roadmap_Tieng_Viet_Da_Chinh_Sua.pptx` ở thư mục gốc, cạnh `README.md`. Nội dung bên dưới đi theo đúng số slide. Phần **Nói** là lời dẫn nói miệng mạch lạc theo slide; phần **Demo** là thao tác thực hành trên trình duyệt/IDE ở các slide có nhãn **DEMO** (8, 11, 17, 21 và 26).

## Chuẩn bị trước buổi nói

1. Từ thư mục project, chạy `pnpm build`, rồi `pnpm exec next start --hostname 127.0.0.1 -p 4173`. Dùng `http://127.0.0.1:4173` làm địa chỉ gốc. Production quan trọng khi đối chiếu HTML ban đầu và Network; `next dev` có thêm hành vi phát triển.
2. Mở sẵn các tab `/csr`, `/ssr`, `/ssg`, `/components`, `/lazy-load`, `/performance`, `/tests`, `/benchmark`. Hai route `/components` và `/performance` vẫn hoạt động khi nhập URL trực tiếp, dù không nằm trong menu.
3. Mở Chrome DevTools, giữ tab Network; bật **Disable cache** khi demo lần tải mới. Trong IDE, mở `app/ssr/page.tsx`, `app/ssg/page.tsx`, `app/components/page.tsx`, `components/pokedex-filter.tsx`, `tests/tasks.test.tsx`.
4. **Test tạo nhiệm vụ đang thất bại có chủ đích.** Form hiện cho lưu tên rỗng, còn test vẫn đòi thông báo “Tên nhiệm vụ là bắt buộc.” Khi chạy `pnpm test` hoặc trang `/tests`, kết quả dự kiến là 1 đạt, 1 thất bại. Đừng trình bày đây là một bộ test đã xanh.
5. Bảng benchmark là báo cáo đã lưu từ **25/11/2026**, không phải đo trong buổi này. Nếu thay build hoặc máy đo, chạy lại `pnpm benchmark` trước khi khẳng định số mới. Trong buổi nói, dùng bảng để giải thích cách đọc số và giới hạn của phép đo.

## Lời dẫn theo slide

### Slide 1 · Mở đầu · 0:00–0:30

**Nói:** “Chào mọi người, hôm nay mình đại diện trình bày chuyên đề Lộ trình Frontend do mình và Vương An Khang thực hiện. Mục tiêu buổi chia sẻ là trả lời ba câu hỏi thực tế: khi nào dùng CSR, SSR hay SSG; chia ranh giới Server và Client Components ra sao; và cách đo hiệu năng cũng như viết test cho giao diện.”

### Slide 2 · Nội dung trình bày (Menu) · 0:30–1:00

**Nói:** “Bài nói hôm nay gồm bốn phần chính: đầu tiên là chiến lược rendering; thứ hai là kiến trúc React và hydration; thứ ba là đo lường, tối ưu hiệu năng; và cuối cùng là kiểm thử component. Sau mỗi phần lý thuyết, mình sẽ mở trực tiếp ứng dụng mẫu để kiểm chứng trên trình duyệt và code.”

### Slide 3 · Vì sao trang có thể chậm? · 1:00–1:35

**Nói:** “Người dùng không nhìn code bên trong, họ chỉ cảm nhận hai thứ: trang hiện nhanh hay chậm, và bấm vào có mượt không. Một trang web thường chậm vì ba nút thắt: server trả HTML muộn, trình duyệt phải chạy quá nhiều JavaScript, hoặc dữ liệu API về trễ. Chọn đúng chiến lược render ngay từ đầu sẽ giúp giảm bớt những công việc không cần thiết.”

### Slide 4 · Hai quyết định khác nhau · 1:35–2:15

**Nói:** “Để chọn đúng cách triển khai, mình cần tách bạch hai quyết định độc lập. Thứ nhất là thời điểm tạo nội dung: tạo ở trình duyệt (CSR), tạo theo từng request (SSR), hay tạo sẵn lúc build (SSG). Thứ hai là nơi chạy mã: phần nào ở máy chủ, phần nào xuống trình duyệt. Hai trục này có thể kết hợp trên cùng một trang.”

### Slide 5 · CSR · 2:15–2:40

**Nói:** “Với CSR, HTML trả về ban đầu chỉ là khung rỗng. Trình duyệt phải tải JavaScript, chạy mã đó để gọi API rồi mới dựng nội dung lên màn hình. Vì vậy, người dùng phải chờ cả bước tải mã lẫn chờ API xong mới thấy phần dữ liệu chính.”

### Slide 6 · SSR · 2:40–3:05

**Nói:** “Ngược lại, với SSR, mỗi khi có request gửi lên, máy chủ sẽ lấy dữ liệu và tạo sẵn HTML hoàn chỉnh rồi mới gửi về trình duyệt. Nhờ vậy nội dung chính đã nằm sẵn trong HTML phản hồi — mình có thể kiểm tra ngay bằng View Page Source.”

### Slide 7 · SSG · 3:05–3:30

**Nói:** “Còn với SSG, file HTML được tạo sẵn một lần ngay lúc build và dùng lại cho tất cả lượt truy cập sau đó. Cách này rất nhanh và nhẹ cho server, phù hợp dữ liệu ít thay đổi; khi nội dung đổi, mình cần build lại hoặc bật cơ chế làm mới định kỳ.”

### Slide 8 · So sánh ba thời điểm · 3:30–5:45

**Nói:** “Tóm lại, cùng một nội dung nhưng khác nhau ở thời điểm nó xuất hiện: CSR chờ JavaScript và fetch ở trình duyệt, SSR tạo theo từng request, còn SSG tạo sẵn từ lúc build. Bây giờ mình mở demo thực tế để kiểm chứng khác biệt này trên Network và View Page Source.”

**Demo (khoảng 2 phút):** Mở `/csr`, bật Network và lọc **Fetch/XHR** để chỉ rõ request `/api/pokemon`. Tiếp theo, mở View Page Source của `/ssr` và `/ssg`, tìm `data-pokemon-id="25"` để thấy dữ liệu đã có sẵn trong HTML gốc. Trong IDE, đối chiếu `force-dynamic` ở `app/ssr/page.tsx` với `force-static` ở `app/ssg/page.tsx` (lưu ý: so từ HTML gốc, không suy ngược từ DOM sau khi JS đã chạy).

### Slide 9 · Chọn CSR, SSR, SSG khi nào? · 5:45–6:25

**Nói:** “Vậy trong dự án thực tế nên chọn thế nào? Nội dung chung, ít đổi thì ưu tiên SSG; trang cần HTML mới theo từng request hoặc theo quyền người dùng thì chọn SSR; còn phần dữ liệu tải sau hoặc giao diện nhiều tương tác thì dùng CSR. Một ứng dụng hoàn toàn có thể phối hợp cả ba.”

### Slide 10 · Server và Client Components · 6:25–7:00

**Nói:** “Chuyển sang phần hai về kiến trúc React. Server Component chạy trên máy chủ, giúp đọc dữ liệu trực tiếp mà không gửi phần mã đó xuống trình duyệt. Client Component có mã chạy ở trình duyệt để xử lý state, sự kiện bấm/nhập và Web API. Nhớ giúp mình: đây là ranh giới mã chạy ở đâu, còn SSR nói về thời điểm tạo HTML.”

### Slide 11 · Khi nào dùng Server/Client? · 7:00–8:25

**Nói:** “Nguyên tắc gọn nhất là giữ việc đọc dữ liệu, giữ bí mật và phần hiển thị tĩnh ở Server Component. Chỉ gắn `'use client'` cho phần thật sự cần state hoặc tương tác người dùng. Ranh giới client càng nhỏ thì lượng JavaScript gửi xuống trình duyệt càng nhẹ. Mình xem ví dụ ở route `/components`.”

**Demo (khoảng 1 phút):** Mở `/components` cùng `app/components/page.tsx` và `components/pokedex-filter.tsx`. Chỉ phần `getPokemon()` chạy trên server và chỉ thị `'use client'` đặt ở component lọc. Thử gõ tên vào ô tìm kiếm để minh họa phần tương tác chạy ngay tại trình duyệt.

### Slide 12 · Hydration · 8:25–8:50

**Nói:** “Một nhầm lẫn hay gặp là thấy Client Component thì nghĩ là chỉ có CSR. Thực tế ở bước Hydration, HTML được tạo sẵn từ server (qua SSR hoặc SSG) sẽ hiện lên trước để người dùng nhìn thấy, sau đó React mới tải JS và gắn xử lý sự kiện vào. Nghĩa là Client Component vẫn có thể có HTML ban đầu.”

### Slide 13 · Core Web Vitals · 8:50–9:30

**Nói:** “Phần ba đi vào đo lường và tối ưu hiệu năng qua ba chỉ số Core Web Vitals. LCP đo lúc nội dung lớn nhất xuất hiện, mốc tốt dưới 2,5 giây. INP đo độ trễ phản hồi khi người dùng thao tác, mốc tốt dưới 200 mili giây. CLS đo độ giật, xô lệch bố cục ngoài ý muốn, cần dưới 0,1 ở phân vị 75.”

### Slide 14 · Core Web Vitals: cách cải thiện · 9:30–10:15

**Nói:** “Muốn cải thiện ba chỉ số này, cần đánh đúng nguyên nhân của từng chỉ số. Với LCP: tối ưu phản hồi server, font và ưu tiên tải ảnh chính. Với INP: giảm hoặc chia nhỏ các tác vụ JS chạy lâu trên luồng chính. Với CLS: luôn khai báo kích thước ảnh và giữ chỗ trước cho nội dung sắp tải.”

### Slide 15 · Lab Data và Field Data: đo khi nào? · 10:15–10:50

**Nói:** “Trước khi xem bảng đo, mình phân biệt rõ hai nguồn dữ liệu. Lab data là đo trong môi trường mô phỏng có kiểm soát như Lighthouse hay DevTools — giúp lặp lại công bằng để so sánh CSR, SSR, SSG, và đây là phạm vi demo hôm nay. Còn Field data (như CrUX hay RUM qua `web-vitals`) thu từ thiết bị và mạng thật của người dùng; khi chạy production thật cần kết hợp thêm Field data để đo chính xác INP ở p75.”

### Slide 16 · Điều kiện benchmark · 10:50–11:30

**Nói:** “Khi chạy benchmark trong lab, nguyên tắc quan trọng nhất là cùng một hệ quy chiếu: phải đo trên bản build production, giữ cùng dữ liệu, thiết bị và điều kiện mạng, đo lặp lại nhiều lượt rồi lấy trung vị. Lưu ý là phép đo tải trang như Lighthouse thu được LCP, CLS và TBT; còn INP đòi hỏi phiên có tương tác thật.”

### Slide 17 · Đọc kết quả · 11:30–12:55

**Nói:** “Bảng này giúp mình đọc nhanh bốn cột đo được: LCP cao nghĩa là nội dung chính hiện chậm; CLS cao là bố cục bị nhảy; TBT cao nghĩa là luồng chính bị JS chặn lâu lúc tải trang; còn JS KB phản ánh chi phí tải mã xuống trình duyệt. Bây giờ mình mở màn hình `/benchmark` để xem số liệu đo thực tế.”

**Demo:** Mở `/benchmark`, chỉ mốc thời gian đo và số lượt chạy. Cuộn tới bảng chỉ số đầy đủ để đọc LCP, TBT, CLS và JavaScript transfer size. Nêu ví dụ từ báo cáo ngày 25/11: LCP của `/csr`, `/ssr`, `/ssg` lần lượt khoảng 760, 608, 759 ms; JS transfer lần lượt khoảng 187, 142, 142 kB. Nhấn mạnh đây là số đo lab ở điều kiện bản build đó; muốn biết danh sách Pokédex sẵn sàng khi nào cần xem thêm waterfall.

### Slide 18 · Lazy load: chỉ tải khi cần · 12:55–13:40

**Nói:** “Sau bước đo, mình đi qua ba kỹ thuật tối ưu phổ biến. Đầu tiên là Lazy load: hoãn tải những tài nguyên chưa cần ở màn đầu như ảnh phía dưới hoặc biểu đồ nặng chỉ mở khi bấm. Cách này giảm chi phí tải lúc đầu, nhưng tránh lazy load phần tử chính ở ngay đầu trang kẻo làm chậm LCP.”

### Slide 19 · Memo: giảm công việc lặp lại · 13:40–14:25

**Nói:** “Thứ hai là Memo hóa: `React.memo` giúp bỏ qua lượt render lại khi props không đổi, còn `useMemo` ghi nhớ kết quả phép tính tốn kém giữa các lần render. Tuy nhiên phép so sánh props cũng có chi phí và nếu state hoặc context đổi thì component vẫn render lại. Vì vậy hãy đo trước rồi mới áp dụng ở nơi thực sự tốn thời gian.”

### Slide 20 · Server state: cache và đồng bộ · 14:25–15:10

**Nói:** “Thứ ba là quản lý Server state: dữ liệu nằm ở server và có thể đổi độc lập với màn hình hiện tại. Phía client chỉ giữ một bản sao nên phải xử lý đủ trạng thái đang tải, khi lỗi và làm mới khi cache cũ. Các công cụ như TanStack Query dùng `queryKey` để nhận diện, `staleTime` để kiểm soát độ mới và refetch khi cần đồng bộ.”

### Slide 21 · Lazy load, memo, server state · 15:10–18:20

**Nói:** “Mình vừa tổng hợp ba hướng tối ưu: hoãn tải với Lazy load, tránh tính lặp với `React.memo`, và quản lý cache cho Server state. Bây giờ mình mở trực tiếp `/lazy-load` và `/performance` để quan sát từng cơ chế trên tab Network và bộ đếm render.”

**Demo A (khoảng 50 giây):** Mở `/lazy-load`, trong Network lọc **Img**, bật **Disable cache** và tải lại. Cuộn **bên trong khung thư viện ảnh**: `rendering-lab.webp` và `benchmark-lab.webp` chỉ mới bắt đầu tải khi ảnh lọt vào khung nhìn.

**Demo B (khoảng 45 giây):** Mở `/performance`, bấm **Tăng bộ đếm cha** hai lần — chỉ số commit của component thường tăng, ô `React.memo` giữ nguyên. Sau đó bấm **Đổi khu khảo sát**: props đổi nên cả hai ô cùng cập nhật.

**Demo C (khoảng 60 giây):** Vẫn trên `/performance`, kéo xuống mục **Server state với TanStack Query**. Khi danh sách tải xong, bấm **Ẩn danh sách** rồi **Mở lại danh sách** trong vòng 60 giây: Network không phát sinh request mới vì lấy từ cache. Bấm **Gọi lại API** để chủ động fetch lại, và nếu còn thời gian có thể bấm **Mô phỏng lỗi API** (HTTP 503) rồi **Khôi phục API**.

### Slide 22 · Vấn đề khi không viết test · 18:20–19:00

**Nói:** “Phần cuối cùng là kiểm thử component. Nếu dự án không có test tự động, mỗi lần sửa code mình lại phải tự bấm tay kiểm tra từng chức năng cũ. Việc này vừa tốn công, vừa dễ sót regression bug, khiến cả team thiếu tự tin mỗi khi cần refactor.”

### Slide 23 · Component Testing là gì? · 19:00–19:40

**Nói:** “Component Testing là viết test tự động cho một phần giao diện dựa trên hành vi người dùng quan sát và thao tác được — từ nội dung render, tác động của props, gõ chữ, bấm nút, đến thông báo lỗi validation hay trạng thái đang tải. Mục tiêu là xác nhận đúng điều người dùng thấy.”

### Slide 24 · Công cụ Component Testing · 19:40–20:20

**Nói:** “Trong demo này mình kết hợp ba công cụ gọn nhẹ: Vitest để chạy test và báo kết quả; React Testing Library để render và tìm phần tử trên giao diện như cách người dùng nhìn; và User Event để mô phỏng thao tác gõ, bấm sát thực tế. Mình tập trung vào giá trị kiểm thử, không đi sâu cấu hình.”

### Slide 25 · Nguyên tắc viết test: AAA · 20:20–21:00

**Nói:** “Để bài test dễ đọc và dễ truy lỗi, mình viết theo cấu trúc ba bước AAA. Arrange: chuẩn bị dữ liệu và render component. Act: thực hiện thao tác như người dùng. Assert: kiểm tra kết quả hiển thị. Khi một test thất bại, nhìn vào bước Assert sẽ thấy ngay giao diện đang sai ở đâu.”

### Slide 26 · Kết quả demo: test phát hiện lỗi · 21:00–22:45

**Nói:** “Bây giờ mình xem kết quả chạy hai test case cho sổ nhiệm vụ: tìm kiếm và tạo mới. Luồng tìm kiếm đang đạt, còn luồng tạo mới đang thất bại có chủ đích vì form cho phép lưu tên rỗng trong khi test yêu cầu báo lỗi bắt buộc. Đây là giá trị thực tế của test: phát hiện ngay lỗi validation mà kiểm tra tay dễ bỏ sót.”

**Demo:** Mở `/tests`, bấm **Chạy tất cả test** để thấy kết quả **1 đạt, 1 thất bại**. Mở chi tiết case tạo nhiệm vụ đọc thông báo lỗi, rồi đối chiếu với ba bước Arrange, Act, Assert trong `tests/tasks.test.tsx` (hoặc chạy `pnpm test` ở terminal; giữ nguyên lỗi cố ý trong lúc trình bày).

### Slide 27 · Q&A · Hỏi đáp & Thảo luận · 22:45–24:00

**Nói:** “Phần trình bày của tụi mình xin phép dừng ở đây. Cảm ơn mọi người đã theo dõi — trên màn hình có ba câu hỏi gợi mở về ranh giới SSR/Client, theo dõi Field data ngoài production và ưu tiên viết test; mời cả nhóm cùng trao đổi và đặt thêm câu hỏi ạ.”

## Khi demo không ra đúng dấu vết

- Nếu Network không hiện request ảnh lazy load, tải lại `/lazy-load` khi DevTools đã mở, bật **Disable cache**, rồi cuộn *trong khung ảnh*, không cuộn toàn trang. Ảnh đầu tiên có thể tải ngay vì đã ở vùng nhìn thấy.
- Nếu CSR hết skeleton quá nhanh, dùng throttling trong Network và tải trực tiếp URL.
- Nếu `/tests` trả lỗi khi chạy, kiểm tra đang mở qua `localhost` hoặc `127.0.0.1`, dependency đã cài và server chạy trên máy local. Trạng thái kỳ vọng của demo hiện tại vẫn là một case thất bại có chủ đích.
- Nếu báo cáo benchmark không đọc được, dùng `reports/benchmark.md` đã lưu. Không dùng số của môi trường khác để thay cho kết quả đang demo.

## Tài liệu đối chiếu

- [Next.js: Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Next.js: Client-side Rendering](https://nextjs.org/docs/pages/building-your-application/rendering/client-side-rendering)
- [Next.js: Static and Dynamic Rendering](https://nextjs.org/learn/dashboard-app/static-and-dynamic-rendering)
- [Next.js: Lazy Loading](https://nextjs.org/docs/app/guides/lazy-loading)
- [Next.js: Route Segment Config](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config)
- [web.dev: Core Web Vitals](https://web.dev/articles/vitals)
- [React: memo](https://react.dev/reference/react/memo)
- [React: useMemo](https://react.dev/reference/react/useMemo)
- [TanStack Query: Important Defaults](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
