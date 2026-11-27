# Kịch bản thuyết trình · Rendering, hiệu năng và test component

**Thời lượng gợi ý:** 22–24 phút trình bày, sau đó hỏi đáp. Dùng deck `Seminar_05_Frontend_Roadmap_Tieng_Viet_Da_Chinh_Sua.pptx` ở thư mục gốc, cạnh `README.md`. Nội dung bên dưới đi theo đúng số slide. Phần **Nói** bám theo lý thuyết trên slide; chi tiết project nằm ở slide kết quả và phần **Demo**. Các slide có nhãn **DEMO** là 7, 10, 15, 19 và 24. Chuyển sang Chrome hoặc IDE sau khi nói xong phần lý thuyết của slide đó.

## Chuẩn bị trước buổi nói

1. Từ thư mục project, chạy `pnpm build`, rồi `pnpm exec next start --hostname 127.0.0.1 -p 4173`. Dùng `http://127.0.0.1:4173` làm địa chỉ gốc. Production quan trọng khi đối chiếu HTML ban đầu và Network; `next dev` có thêm hành vi phát triển.
2. Mở sẵn các tab `/csr`, `/ssr`, `/ssg`, `/components`, `/lazy-load`, `/performance`, `/tests`, `/benchmark`. Hai route `/components` và `/performance` vẫn hoạt động khi nhập URL trực tiếp, dù không nằm trong menu.
3. Mở Chrome DevTools, giữ tab Network; bật **Disable cache** khi demo lần tải mới. Trong IDE, mở `app/ssr/page.tsx`, `app/ssg/page.tsx`, `app/components/page.tsx`, `components/pokedex-filter.tsx`, `tests/tasks.test.tsx`.
4. **Test tạo nhiệm vụ đang thất bại có chủ đích.** Form hiện cho lưu tên rỗng, còn test vẫn đòi thông báo “Tên nhiệm vụ là bắt buộc.” Khi chạy `pnpm test` hoặc trang `/tests`, kết quả dự kiến là 1 đạt, 1 thất bại. Đừng trình bày đây là một bộ test đã xanh.
5. Bảng benchmark là báo cáo đã lưu từ **19/11/2026**, không phải đo trong buổi này. Nếu thay build hoặc máy đo, chạy lại `pnpm benchmark` trước khi khẳng định số mới. Trong buổi nói, dùng bảng để giải thích cách đọc số và giới hạn của phép đo.

## Lời dẫn theo slide

### Slide 1 · Mở đầu · 0:00–0:35

**Nói:** “Hôm nay mình chia sẻ hai phần. Phần đầu là cách Next.js tạo nội dung: CSR, SSR, SSG và ranh giới Server/Client Components. Phần sau là cách giảm công việc cho browser, đo trải nghiệm và viết test cho component. Sau mỗi nhóm khái niệm, mình sẽ kiểm chứng bằng một ví dụ chạy thật.”

### Slide 2 · Vì sao trang có thể chậm? · 0:35–1:15

**Nói:** “Một trang chậm có thể vì HTML đến muộn, JavaScript phải làm quá nhiều việc, hoặc dữ liệu từ API về trễ. Người dùng chỉ thấy kết quả cuối cùng: nội dung xuất hiện lúc nào và bấm có phản hồi không. Vì vậy mình cần nhìn đúng luồng tải trước khi tối ưu.”

### Slide 3 · Hai quyết định khác nhau · 1:15–1:55

**Nói:** “CSR, SSR và SSG nói về thời điểm nội dung được tạo. Server Component và Client Component nói mã nào chạy ở server, mã nào cần browser. Hai trục này có thể kết hợp trên cùng một route.”

### Slide 4 · CSR · 1:55–2:20

**Nói:** “CSR là cách trình duyệt chạy JavaScript để lấy dữ liệu và dựng phần nội dung chính. HTML đầu có thể chỉ là khung trang. Người dùng phải đợi cả mã lẫn dữ liệu trước khi thấy phần đó.”

### Slide 5 · SSR · 2:20–2:45

**Nói:** “SSR nghĩa là máy chủ tạo HTML theo từng request rồi gửi về trình duyệt. Nội dung chính có trong phản hồi HTML, nên mình có thể kiểm tra bằng View Page Source.”

### Slide 6 · SSG · 2:45–3:10

**Nói:** “SSG nghĩa là HTML được tạo sẵn lúc build và dùng lại cho nhiều request. Nó hợp nội dung chung, ít thay đổi; khi dữ liệu đổi cần có cơ chế tạo hoặc cập nhật lại trang.”

### Slide 7 · So sánh ba thời điểm · 3:10–5:25

**Nói:** “Với cùng một nội dung, CSR chờ JavaScript và dữ liệu; SSR tạo nội dung theo request; SSG tạo trước ở giai đoạn build. Mình đang so sánh thời điểm tạo nội dung chính, vì khung trang vẫn có thể được tạo trước.”

**Demo (khoảng 2 phút):** Mở `/csr`, bật Network và lọc **Fetch/XHR** để chỉ request `/api/pokemon`. Sau đó mở View Page Source của `/ssr` và `/ssg`, tìm `data-pokemon-id="25"` để thấy nội dung đã có trong HTML. Trong IDE, chỉ `force-dynamic` ở `app/ssr/page.tsx` và `force-static` ở `app/ssg/page.tsx`. So sánh request document với request dữ liệu; không suy từ DOM sau hydration.

### Slide 8 · Chọn CSR, SSR, SSG khi nào? · 5:25–6:05

**Nói:** “SSG hợp nội dung chung, ít đổi và có thể tạo sẵn. SSR hợp trang cần HTML mới theo từng request. CSR hợp phần nội dung lấy sau khi tải hoặc giao diện nhiều tương tác. Một ứng dụng có thể kết hợp cả ba.”

### Slide 9 · Server và Client Components · 6:05–6:40

**Nói:** “Server Component chạy mã trên máy chủ, thường dùng để đọc dữ liệu mà không gửi mã đó xuống browser. Client Component có mã chạy ở browser để dùng state, sự kiện và Web API. Đây là ranh giới mã; SSR lại nói HTML được tạo theo request.”

### Slide 10 · Khi nào dùng Server/Client? · 6:40–8:05

**Nói:** “Dùng Server Component cho phần tải dữ liệu và logic cần ở máy chủ. Dùng Client Component cho ô nhập, nút bấm và những phần cần state hoặc API của browser. Đặt ranh giới client càng gọn thì lượng JavaScript gửi đi càng dễ kiểm soát.”

**Demo (khoảng 1 phút):** Mở `/components`, `app/components/page.tsx` và `components/pokedex-filter.tsx`. Chỉ `getPokemon()` ở server và `'use client'` ở component lọc. Nhập một tên vào ô tìm kiếm để cho thấy phần tương tác chạy trên browser.

### Slide 11 · Hydration · 8:05–8:30

**Nói:** “Hydration là bước React gắn xử lý sự kiện vào HTML đã có. Người dùng có thể nhìn thấy nội dung trước khi bấm hoặc nhập được. Vì vậy Client Component không đồng nghĩa với chỉ có CSR.”

### Slide 12 · Core Web Vitals · 8:30–9:10

**Nói:** “Core Web Vitals gồm ba chỉ số. LCP là thời điểm phần tử nội dung lớn nhất xuất hiện. INP là độ trễ từ thao tác của người dùng đến lần vẽ tiếp theo. CLS đo mức dịch chuyển bố cục ngoài ý muốn. Mốc tốt thường dùng là 2,5 giây, 200 mili giây và 0,1 ở phân vị 75.”

### Slide 13 · Core Web Vitals: cách cải thiện · 9:10–9:55

**Nói:** “LCP thường chậm khi máy chủ phản hồi lâu, ảnh chính tải muộn hoặc font chặn hiển thị. Muốn cải thiện INP, mình giảm tác vụ JavaScript dài để browser phản hồi thao tác sớm hơn. Với CLS, cần khai báo kích thước ảnh và giữ chỗ cho nội dung sẽ xuất hiện. Ba chỉ số chỉ có ý nghĩa khi đo lại trong điều kiện thực tế.”

### Slide 14 · Điều kiện benchmark · 9:55–10:40

**Nói:** “Muốn so sánh hiệu năng, cần giữ cùng dữ liệu, thiết bị và điều kiện mạng. Đo trên bản production, lặp lại nhiều lượt rồi lấy giá trị đại diện. LCP, CLS, TBT là chỉ số của phép đo tải trang; INP cần một phiên có tương tác.”

### Slide 15 · Đọc kết quả · 10:40–12:05

**Nói:** “Bảng này là cách đọc các chỉ số. LCP cho biết nội dung lớn xuất hiện lúc nào; CLS cho biết bố cục có dịch chuyển; TBT cho biết luồng chính bị chặn bao lâu trong phép đo lab. Dung lượng JavaScript cho thấy chi phí tải. Chỉ so sánh các số được đo trong cùng điều kiện.”

**Demo:** Mở `/benchmark`, chỉ thời gian đo và số lượt. Cuộn tới bảng chỉ số đầy đủ để xem LCP, TBT, CLS, JavaScript transfer size. Có thể nêu ví dụ trong báo cáo ngày 19/11: LCP của `/csr`, `/ssr`, `/ssg` lần lượt khoảng 758, 649, 757 ms; JS transfer lần lượt khoảng 188, 142, 142 kB. Đây là số của bản build và môi trường đo đó. LCP có thể đo tiêu đề trang; muốn biết Pokédex sẵn sàng khi nào cần xem thêm waterfall và thời điểm danh sách xuất hiện.

### Slide 16 · Lazy load: chỉ tải khi cần · 12:05–12:50

**Nói:** “Lazy load là hoãn tải tài nguyên chưa cần ở màn đầu: ảnh phía dưới, một thư viện nặng hoặc component chỉ mở khi người dùng bấm. Nó giúp giảm lượng dữ liệu và mã của lần tải đầu. Nhưng phần tử chính ở ngay đầu trang cần được tải sớm, nếu không LCP lại xấu đi. Dấu vết dễ thấy nhất là thời điểm request xuất hiện trong Network.”

### Slide 17 · Memo: giảm công việc lặp lại · 12:50–13:35

**Nói:** “`React.memo` có thể bỏ một lượt render lại nếu props không đổi. `useMemo` ghi nhớ kết quả một phép tính tốn kém giữa các lượt render. Khi state hoặc context thay đổi, component vẫn có thể render; memo cũng có chi phí kiểm tra. Vì vậy mình đo trước, rồi chỉ dùng ở nơi render hoặc tính toán thực sự tốn thời gian.”

### Slide 18 · Server state: cache và đồng bộ · 13:35–14:20

**Nói:** “Server state là dữ liệu có nguồn gốc ở server và có thể đổi ngoài màn hình hiện tại. Client chỉ giữ một bản sao nên phải xử lý lúc đang tải, khi lỗi và khi cache đã cũ. Query key giúp nhận diện dữ liệu; stale time cho biết bao lâu thì coi là cũ; làm mới hoặc invalidation giúp đồng bộ sau thay đổi.”

### Slide 19 · Lazy load, memo, server state · 14:20–17:35

**Nói:** “Lazy load hoãn tải ảnh hoặc mã chưa cần đến. React.memo có thể bỏ một lần render khi props không đổi; đây là tối ưu, không phải bảo đảm tuyệt đối. Server state là dữ liệu gốc nằm ở server, còn client cần lấy, cache và làm mới bản đang hiển thị.”

**Demo A, khoảng 50 giây:** Mở `/lazy-load`, Network lọc **Img**, bật Disable cache và tải lại. Cuộn **trong khung thư viện**: `rendering-lab.webp` và `benchmark-lab.webp` xuất hiện trong Network khi ảnh đi vào khung. Giải thích lần đầu cần tải, lần sau có cache.

**Demo B, khoảng 45 giây:** Mở `/performance`, bấm **Tăng bộ đếm cha** hai lần. Số commit của component thường tăng, ô `React.memo` giữ nguyên. Bấm **Đổi khu khảo sát**: props đổi, cả hai cập nhật. Counter trong development có thể bị ảnh hưởng bởi Strict Mode, nên ưu tiên production.

**Demo C, khoảng 60 giây:** Trên `/performance`, kéo xuống **Server state với TanStack Query**. Sau khi Pokédex tải xong, bấm **Ẩn danh sách**, rồi **Mở lại danh sách** trong 60 giây và nhìn Network: dữ liệu lấy từ cache. Bấm **Gọi lại API** để thấy request mới. Nếu còn thời gian, bấm **Mô phỏng lỗi API** để thấy HTTP 503 rồi **Khôi phục API**.

### Slide 20 · Vấn đề khi không viết test · 17:35–18:15

**Nói:** “Mỗi lần sửa component mà không có test, mình phải tự mở giao diện và thử lại các chức năng cũ. Việc này tốn thời gian và vẫn có thể bỏ sót regression bug. Khi muốn refactor, mình cũng khó biết thay đổi có làm hỏng hành vi đang chạy hay không.”

### Slide 21 · Component Testing là gì? · 18:15–18:55

**Nói:** “Component Testing là kiểm thử tự động hành vi của một phần giao diện. Mình có thể kiểm tra nội dung được render, tác động của props, thao tác nhập hoặc bấm, validation và trạng thái đang tải hay lỗi. Điểm chính là xác nhận điều người dùng nhìn thấy.”

### Slide 22 · Công cụ Component Testing · 18:55–19:35

**Nói:** “Ở demo này, Vitest chạy các test và báo đạt hay thất bại. React Testing Library render component rồi tìm phần tử trên UI. User Event mô phỏng người dùng nhập và bấm. Mình sẽ tập trung vào giá trị của test, không đi sâu cấu hình thư viện.”

### Slide 23 · Nguyên tắc viết test: AAA · 19:35–20:15

**Nói:** “AAA là ba bước giúp một test dễ đọc. Arrange: chuẩn bị dữ liệu và render component. Act: thực hiện thao tác của người dùng. Assert: kiểm tra kết quả hiển thị. Khi một test thất bại, cấu trúc này giúp mình thấy rõ đang sai ở hành vi nào.”

### Slide 24 · Kết quả demo: test phát hiện lỗi · 20:15–22:00

**Nói:** “Bây giờ mình xem hai luồng tạo và tìm kiếm nhiệm vụ. Luồng tìm kiếm đang đạt. Luồng tạo nhiệm vụ thất bại vì form cho lưu tên rỗng, trong khi test yêu cầu báo lỗi. Đây là giá trị thực tế của test: nó chỉ ra một hành vi sai có thể bị bỏ sót khi kiểm tra thủ công.”

**Demo:** Mở `/tests`, bấm **Chạy tất cả test** và chỉ kết quả **1 đạt, 1 thất bại**. Mở case tạo nhiệm vụ để đọc thông báo lỗi, sau đó mở `tests/tasks.test.tsx` và chỉ ba bước Arrange, Act, Assert ở case này. Nếu cần, chạy `pnpm test` trong terminal để thấy cùng kết quả từ code. Không sửa lỗi trong lúc thuyết trình; đây là lỗi được giữ có chủ đích.

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
