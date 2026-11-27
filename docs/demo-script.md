# Kịch bản thuyết trình · Rendering, tối ưu hiệu năng và kiểm thử component

**Thời lượng gợi ý:** 23–25 phút trình bày, sau đó hỏi đáp. Dùng deck `Seminar_05_Frontend_Roadmap_Tieng_Viet_Da_Chinh_Sua.pptx` ở thư mục gốc, cạnh `README.md`. Nội dung bám sát cấu trúc **Mở đầu → Phần 1: Rendering → Phần 2: Chỉ số & Tối ưu (gồm đo Lighthouse Before/After & Component Test) → Q&A**. Phần **Nói** được viết theo văn phong nói miệng tự nhiên, có câu nối chuyển ý mượt giữa các slide; phần **Demo** gắn link trực tiếp tới ứng dụng chạy tại [http://127.0.0.1:4173](http://127.0.0.1:4173) ở các slide có nhãn **DEMO** (`8, 11, 16, 17, 18, 20, 21, 26`).

## Chuẩn bị trước buổi nói

1. Từ thư mục project, chạy `pnpm build`, rồi `pnpm exec next start --hostname 127.0.0.1 -p 4173`. Dùng [http://127.0.0.1:4173](http://127.0.0.1:4173) làm địa chỉ gốc. Bắt buộc dùng production build khi đối chiếu HTML ban đầu, thẻ `<link rel="preload">` và tab Network.
2. Mở sẵn các trang demo (hoặc bấm trực tiếp từ [Trang chủ](http://127.0.0.1:4173/) / thanh link dưới các slide **DEMO**):
   - Rendering & Components: [/csr](http://127.0.0.1:4173/csr) · [/ssr](http://127.0.0.1:4173/ssr) · [/ssg](http://127.0.0.1:4173/ssg) · [/visualizer](http://127.0.0.1:4173/visualizer) · [/components](http://127.0.0.1:4173/components)
   - Benchmark & Tối ưu: [/benchmark](http://127.0.0.1:4173/benchmark) · [/benchmark#before-after](http://127.0.0.1:4173/benchmark#before-after) · [/labs/js-before](http://127.0.0.1:4173/labs/js-before) · [/labs/js-after](http://127.0.0.1:4173/labs/js-after) · [/labs/banner-before](http://127.0.0.1:4173/labs/banner-before) · [/labs/banner-after](http://127.0.0.1:4173/labs/banner-after) · [/lazy-load](http://127.0.0.1:4173/lazy-load) · [/performance](http://127.0.0.1:4173/performance)
   - Kiểm thử: [/tests](http://127.0.0.1:4173/tests)
3. Mở Chrome DevTools, giữ tab Network; bật **Disable cache** khi demo lần tải mới. Trong IDE, mở sẵn `app/ssr/page.tsx`, `app/ssg/page.tsx`, `app/components/page.tsx`, `components/pokedex-filter.tsx`, `app/labs/js-after/page.tsx`, `app/labs/banner-after/page.tsx`, `tests/tasks.test.tsx`.
4. **Test tạo nhiệm vụ đang thất bại có chủ đích.** Form hiện cho lưu tên rỗng, còn test vẫn đòi thông báo “Tên nhiệm vụ là bắt buộc.” Khi chạy `pnpm test` hoặc mở [/tests](http://127.0.0.1:4173/tests), kết quả dự kiến là 1 đạt, 1 thất bại. Đừng trình bày đây là một bộ test đã xanh.
5. Bảng số liệu trên [/benchmark](http://127.0.0.1:4173/benchmark) và trong slide được đo thực tế từ bản production ngày **27/11/2026** bằng `pnpm benchmark` (Chrome headless, Lighthouse 13.6.0, mobile preset). Nếu sửa code hoặc đổi máy đo, chạy lại `pnpm benchmark` trước khi đọc số mới.

## Lời dẫn theo slide

### Slide 1 · Mở đầu · 0:00–0:30

**Nói:** “Chào mọi người. Hôm nay mình đại diện cho nhóm trình bày chuyên đề Lộ trình Frontend do mình và Vương An Khang thực hiện. Chủ đề của tụi mình xoay quanh bài toán rất quen thuộc khi làm web: làm sao chọn đúng cách render, tối ưu cho trang chạy nhanh, giữ chất lượng code bền vững và kiểm chứng được bằng con số đo từ Lighthouse.”

### Slide 2 · Nội dung trình bày (Menu) · 0:30–1:00

**Nói:** “Để mọi người dễ theo dõi, bài trình bày đi qua phần Mở đầu nêu tổng quan bài toán và hai phần chính. Phần 1 tập trung vào Rendering: phân tích cơ chế, ưu nhược điểm và khi nào nên chọn từng kiểu. Phần 2 đi vào đo lường và tối ưu thực tế — từ Core Web Vitals, giảm JavaScript, tối ưu ảnh, cache, memo, xem số liệu Lighthouse trước và sau khi sửa code, rồi khép lại bằng Component Testing để giữ an toàn cho code.”

### Slide 3 · Tổng quan bài toán: Hiệu năng & Chất lượng code · 1:00–1:40

**Nói:** “Nhóm tụi mình cố gắng không biến buổi này thành một bài nói thuần lý thuyết. Ngoài thực tế, một trang web chậm thường vướng vào ba chỗ: server trả HTML trễ, trình duyệt phải gánh quá nhiều JavaScript, hoặc ảnh và dữ liệu tải chưa khéo. Nhưng nếu chỉ lao vào tối ưu mà không có test bảo vệ, sửa chỗ này rất dễ làm gãy chỗ khác. Vì vậy tụi mình dựng ứng dụng mẫu Pokédex Lab để giải trọn vẹn bài toán cả hiệu năng lẫn chất lượng code, và lấy Lighthouse làm thước đo kiểm chứng cho mọi thay đổi.”

### Slide 4 · Hai trục quyết định trên cùng một trang · 1:40–2:10

**Nói:** “Bắt đầu vào Phần 1, trước khi nhắc tới tên các kỹ thuật, mình cần tách rõ hai câu hỏi thường hay bị trộn lẫn với nhau. Câu hỏi thứ nhất là thời điểm nội dung chính được tạo ra — tạo ở trình duyệt, tạo theo từng request hay tạo sẵn lúc build. Câu hỏi thứ hai là mã giao diện đó sẽ chạy ở máy chủ hay gửi xuống trình duyệt. Hai quyết định này độc lập và hoàn toàn kết hợp được với nhau trên cùng một trang.”

### Slide 5 · CSR: Cơ chế, ưu nhược điểm & khi dùng · 2:10–2:50

**Nói:** “Mình đi vào kiểu tạo nội dung đầu tiên là CSR — render ngay trên trình duyệt. Khi người dùng mở trang, server chỉ trả về một khung HTML trống; sau đó trình duyệt phải tải JavaScript, chạy mã rồi gọi API mới dựng được danh sách lên màn hình. Điểm mạnh của CSR là giảm gánh nặng tạo HTML cho server và xử lý các màn hình tương tác phức tạp rất mượt. Đổi lại, lần mở trang đầu người dùng phải đợi cả tải JS lẫn chờ API, nên dễ ảnh hưởng tốc độ hiển thị. Vì thế CSR hợp nhất cho trang quản trị nội bộ, vùng dữ liệu sau đăng nhập hoặc các widget nhiều trạng thái.”

### Slide 6 · SSR: Cơ chế, ưu nhược điểm & khi dùng · 2:50–3:30

**Nói:** “Vậy nếu mình không muốn người dùng nhìn khung trống chờ API thì sao? Lúc đó mình chuyển phần việc này lên máy chủ với SSR. Ở mỗi request gửi lên, server chủ động đọc dữ liệu, dựng sẵn HTML hoàn chỉnh rồi mới trả về cho trình duyệt. Nhờ vậy nội dung xuất hiện ngay trong gói HTML đầu tiên, rất tốt cho SEO và dữ liệu luôn mới theo từng người dùng. Tuy nhiên đánh đổi là server phải tốn tài nguyên tính toán ở mỗi lượt truy cập; nếu API hoặc database phía sau chậm thì trang cũng bị chậm theo. SSR sẽ phù hợp cho trang cần dữ liệu cá nhân hóa hoặc thay đổi liên tục theo từng request.”

### Slide 7 · SSG: Cơ chế, ưu nhược điểm & khi dùng · 3:30–4:10

**Nói:** “Thế còn những trang mà nội dung giống nhau cho mọi người thì có cần render lại mỗi request không? Câu trả lời là không, và đó là lúc SSG phát huy tác dụng. Với SSG, HTML được dựng sẵn một lần duy nhất lúc build và dùng lại cho toàn bộ lượt truy cập qua CDN. Ưu điểm lớn nhất là phản hồi cực nhanh, server gần như nhàn rỗi và luồng chính trình duyệt rất nhẹ. Nhược điểm là nội dung sẽ giữ nguyên cho tới lần build tiếp theo, hoặc mình phải cấu hình cơ chế làm mới định kỳ. Do đó SSG rất lý tưởng cho trang giới thiệu, blog, tài liệu hay danh mục công khai ít thay đổi.”

### Slide 8 · So sánh 3 kiểu render & Demo 1 · 4:10–6:10

**Nói:** “Nhìn chung, cùng một dữ liệu nhưng ba cách làm chỉ khác nhau ở thời điểm nội dung hình thành: CSR đợi trình duyệt chạy JS, SSR tạo theo từng request, còn SSG tạo sẵn lúc build. Để không dừng ở lý thuyết, bây giờ mình mở ngay ứng dụng Pokédex Lab để kiểm chứng tận mắt xem HTML ban đầu và tab Network của ba trang này khác nhau thế nào.”

**Demo (khoảng 2 phút):** Mở [/csr](http://127.0.0.1:4173/csr), bật Network lọc **Fetch/XHR** và tải lại để chỉ rõ request `/api/pokemon` chỉ chạy sau khi có JS. Sang [/ssr](http://127.0.0.1:4173/ssr) và [/ssg](http://127.0.0.1:4173/ssg), mở **View Page Source** tìm `data-pokemon-id="25"` để chứng minh dữ liệu đã nằm sẵn trong HTML gốc ngay trước khi JS chạy. Sau đó mở [/visualizer](http://127.0.0.1:4173/visualizer) hoặc IDE đối chiếu nhanh `force-dynamic` ở `app/ssr/page.tsx` và `force-static` ở `app/ssg/page.tsx`.

### Slide 9 · Chọn CSR, SSR, SSG khi nào? · 6:10–6:45

**Nói:** “Qua phần demo vừa rồi, mọi người đã thấy rõ sự khác biệt ngay từ file HTML đầu tiên. Tổng hợp lại thành nguyên tắc chọn nhanh cho dự án: nội dung chung ít đổi thì cứ mạnh dạn chọn SSG; trang bắt buộc dữ liệu mới theo từng người dùng hoặc từng lượt tải thì chọn SSR; còn các vùng tương tác nhiều sau khi khung trang đã lên rồi thì để CSR đảm nhận.”

### Slide 10 · Server & Client Components: Cơ chế, ưu nhược điểm · 6:45–7:25

**Nói:** “Giải quyết xong câu chuyện thời điểm tạo HTML, mình sang trục quyết định thứ hai: đặt mã component chạy ở đâu — Server Component hay Client Component. Server Component chạy hoàn toàn trên máy chủ, đọc trực tiếp dữ liệu, giữ an toàn bí mật và đặc biệt là không gửi một kilobyte JavaScript nào xuống trình duyệt. Ngược lại, Client Component cần chỉ thị `'use client'` để chạy được state, nút bấm và Web API trên trình duyệt, nhưng nếu bọc quá rộng thì gói JS tải xuống sẽ phình to. Vì vậy nguyên tắc vàng là chỉ đặt `'use client'` đúng ở phần thật sự cần tương tác.”

### Slide 11 · Cây thành phần & Demo Server/Client · 7:25–8:45

**Nói:** “Để dễ hình dung ranh giới này trong code thật, mọi người nhìn lên cây thành phần trên slide: phần trang cha lấy dữ liệu vẫn giữ ở Server, còn nhánh bộ lọc và tìm kiếm mới gắn `'use client'`. Ranh giới client càng gọn thì ứng dụng càng nhẹ. Mình mở route [/components](http://127.0.0.1:4173/components) để xem cách tách trực tiếp trong code.”

**Demo (khoảng 1 phút):** Mở [/components](http://127.0.0.1:4173/components) song song với `app/components/page.tsx` và `components/pokedex-filter.tsx`. Chỉ rõ `getPokemon()` chạy trên server và `'use client'` chỉ bao quanh `PokedexFilter`. Gõ tìm kiếm trực tiếp trên màn hình để minh họa phần tương tác chạy mượt tại trình duyệt.

### Slide 12 · Hydration: gắn tương tác vào HTML · 8:45–9:15

**Nói:** “Xem xong demo vừa rồi, có một câu hỏi rất hay gặp: nếu phần bộ lọc là Client Component, vậy khi vừa tải trang nó có bị trống trơn như CSR không? Câu trả lời là không, nhờ cơ chế Hydration. Server vẫn tạo sẵn phần HTML hiển thị trước qua SSR hoặc SSG để người dùng thấy ngay giao diện; sau đó React mới tải JavaScript xuống, đối chiếu và gắn sự kiện bấm vào các nút đó. Vậy là mình vừa khép lại trọn vẹn Phần 1 về cách render.”

### Slide 13 · Core Web Vitals: LCP, INP/TBT và CLS · 9:15–10:00

**Nói:** “Bây giờ mình bước sang Phần 2: làm sao đo lường trải nghiệm và tối ưu trang web cho thực sự nhanh. Để đo không cảm tính, mình dựa vào bộ ba chỉ số Core Web Vitals. Thứ nhất là LCP — đo mất bao lâu để nội dung chính lớn nhất hiện lên, ngưỡng tốt dưới 2,5 giây. Thứ hai là INP — đo độ trễ phản hồi khi người dùng bấm hay gõ, cần dưới 200 mili giây; riêng khi đo tự động lúc tải trang bằng Lighthouse thì mình nhìn qua chỉ số thay thế là TBT để biết luồng chính có bị JS chặn hay không. Cuối cùng là CLS — đo giao diện có bị nhảy lệch bất ngờ không, cần giữ dưới 0,1.”

### Slide 14 · Lab Data và Field Data: đo khi nào? · 10:00–10:35

**Nói:** “Biết chỉ số rồi nhưng lấy số từ đâu để so sánh? Ở đây mình phân biệt rõ hai nguồn: Lab Data và Field Data. Lab Data là chạy Lighthouse hoặc DevTools trong điều kiện mạng, thiết bị mô phỏng cố định — rất lý tưởng để tụi mình đối chiếu công bằng trước và sau mỗi lần sửa code trong buổi demo hôm nay. Tuy nhiên khi đưa sản phẩm lên chạy thật, team nên kết hợp thêm Field Data qua CrUX hoặc thư viện `web-vitals` để nắm được trải nghiệm thực tế và chỉ số INP từ chính máy người dùng.”

### Slide 15 · Đo Lighthouse trên bản production · 10:35–11:10

**Nói:** “Khi chạy đo trong Lab bằng Lighthouse, có một quy tắc bắt buộc là phải đo trên bản build production, giữ cố định dữ liệu, thiết bị và chạy lặp nhiều lượt lấy trung vị để tránh sai số ngẫu nhiên. Xuyên suốt các phép đo sau đây, tụi mình sẽ bám sát đúng 6 chỉ số cốt lõi: điểm Performance, FCP, LCP, CLS, TBT và dung lượng JavaScript truyền qua mạng.”

### Slide 16 · Demo 1 · Kết quả Lighthouse: CSR vs SSR vs SSG · 11:10–12:30

**Nói:** “Áp dụng bộ tiêu chí đó lên cùng trang Pokédex 9 loài, đây là bảng số liệu Lighthouse tụi mình đo được. Có thể thấy ngay CSR tốn khoảng 183,6 kB JS với 15 request, kéo TBT lên 121 ms và LCP ở mức 758 ms. Trong khi đó SSR và SSG giảm xuống còn 139,3 kB JS với 10 request, TBT hạ xuống còn 101 ms và 80 ms, điểm Performance đạt 99–100. Mình mở nhanh trang [/benchmark](http://127.0.0.1:4173/benchmark) để đối chiếu số liệu gốc vừa đo.”

**Demo (khoảng 1 phút):** Mở [/benchmark](http://127.0.0.1:4173/benchmark), chỉ vào biểu đồ LCP và bảng tổng quan của CSR, SSR, SSG. Giải thích nhanh: CSR nặng JS và nhiều request hơn vì phải tải thêm TanStack Query và gọi `/api/pokemon`, còn SSR đọc fixture cục bộ tại chỗ nên có FCP/LCP rất thấp (607 ms).

### Slide 17 · Giảm JavaScript ban đầu & Lazy load · 12:30–14:00

**Nói:** “Nhìn vào bảng đo vừa rồi, dễ thấy hai nguyên nhân hay làm tụt điểm Lighthouse là gói JS tải ban đầu quá nặng và tải thừa những phần chưa dùng tới. Để giải quyết phần JS, mình giữ danh sách tĩnh ở Server Component, còn widget phân tích 151 loài Kanto chỉ tách ra bằng `next/dynamic()` để tải khi người dùng thật sự bấm mở. Tương tự với hình ảnh nằm sâu bên dưới màn hình, mình dùng lazy load để cuộn tới đâu mới tải tới đó — lưu ý không áp dụng cho ảnh banner đầu trang kẻo làm chậm LCP. Mình mở tab Network để quan sát trực tiếp hai cơ chế này.”

**Demo A · Giảm JS với `dynamic()` (khoảng 1 phút):** Mở DevTools → tab **Network**, bật **Disable cache** và chọn lọc **JS**. Mở [http://127.0.0.1:4173/labs/js-before](http://127.0.0.1:4173/labs/js-before), bấm **F5 (Tải lại)** rồi chỉ xuống **thanh tổng kết ở đáy Network**: tổng JS tải ngay lúc đầu lên tới khoảng **255 kB** vì gói phân tích 151 loài bị gộp sẵn. Chuyển sang [http://127.0.0.1:4173/labs/js-after](http://127.0.0.1:4173/labs/js-after) và bấm **F5 (Tải lại)**: tổng JS ban đầu giảm xuống chỉ còn khoảng **148 kB** (giảm ~42%). Tiếp theo bấm nút **Clear (`🚫`)** trên Network cho sạch danh sách, rồi cuộn xuống bấm **Tải và mở phân tích 151 Pokémon** — ngay lập tức chỉ có đúng một chunk `.js` mới được nạp thêm theo nhu cầu.

**Demo B · Lazy load ảnh khi cuộn (khoảng 35 giây):** Chuyển sang [http://127.0.0.1:4173/lazy-load](http://127.0.0.1:4173/lazy-load), trong DevTools đổi bộ lọc từ **JS** sang **Img**, bấm **Clear (`🚫`)** rồi **F5 (Tải lại)** — chỉ ảnh đầu tiên ở màn hình trên tải trước. Sau đó cuộn **bên trong khung thư viện ảnh** để thấy `rendering-lab.webp` và `benchmark-lab.webp` chỉ bắt đầu tải khi lọt vào vùng nhìn thấy.

### Slide 18 · Tối ưu ảnh & Tải sớm banner (`priority`) · 14:00–15:05

**Nói:** “Nếu với JS thừa mình phải hoãn lại cho nhẹ trang, thì với bức ảnh banner ngay đầu trang lại cần làm điều ngược lại: ưu tiên tải càng sớm càng tốt. Thay vì để ảnh PNG nặng và tải muộn sau khi JS chạy xong, mình nén ảnh sang WebP gọn hơn tới hơn 95%, khai báo sẵn kích thước khung để giữ CLS bằng 0, và gắn thuộc tính `priority` trên thẻ `<Image>`. Khi đó Next.js tự động chèn preload ngay đầu file HTML để trình duyệt kéo ảnh banner về song song từ những mili giây đầu tiên. Mình mở waterfall Network để kiểm chứng ngay.”

**Demo (khoảng 1 phút):** Trong DevTools tab **Network**, chuyển bộ lọc về **All** (giữ **Disable cache**) để nhìn trọn thứ tự tải HTML, script và ảnh. Mở [http://127.0.0.1:4173/labs/banner-before](http://127.0.0.1:4173/labs/banner-before) và bấm **F5**: trong cột Waterfall, ảnh PNG nặng (`banner-kanto-raw.png`, ~989 KB) mãi tới sau các file JS mới bắt đầu tải. Chuyển sang [http://127.0.0.1:4173/labs/banner-after](http://127.0.0.1:4173/labs/banner-after) rồi bấm **F5**: ảnh WebP gọn nhẹ (`banner-kanto.webp`, ~30,6 KB) được ưu tiên `High` và tải ngay đầu danh sách ngay sau document HTML.

### Slide 19 · Cache đa tầng & Quản lý Server State · 15:05–15:50

**Nói:** “Bên cạnh giảm JS và tải sớm ảnh, một vũ khí khác giúp web phản hồi tức thì là tận dụng Cache ở nhiều tầng. Ở tầng build và mạng, trang tĩnh SSG và các HTTP header giúp CDN hay trình duyệt dùng lại ngay kết quả cũ mà không hỏi lại server. Còn ở phía trình duyệt khi gọi API lấy dữ liệu động — tức là phần Server State — dữ liệu nằm ở server nên có thể cũ hoặc lỗi bất cứ lúc nào. Tụi mình dùng TanStack Query lưu tạm trong bộ nhớ theo khóa định danh, cài đặt thời gian dữ liệu còn tươi (`staleTime`) để tránh gọi API trùng lặp và xử lý gọn các trạng thái đang tải hay báo lỗi.”

### Slide 20 · Memo hóa & Demo Cache / Memo · 15:50–17:10

**Nói:** “Và kỹ thuật tối ưu cuối cùng trong bộ giải pháp là Memo hóa với `React.memo` và `useMemo`. Cơ chế của nó là ghi nhớ kết quả render hoặc phép tính nặng khi đầu vào props không đổi — tất nhiên chỉ nên dùng đúng chỗ thật sự tốn CPU vì phép so sánh cũng có chi phí riêng. Bây giờ mình mở màn hình [/performance](http://127.0.0.1:4173/performance) để kiểm chứng hai phần: bên trên là bộ đếm render của `React.memo`, còn bên dưới là cơ chế cache và xử lý lỗi API của TanStack Query.”

**Demo A · Đối chiếu `React.memo` (khoảng 35 giây):** Trên [/performance](http://127.0.0.1:4173/performance), nhìn vào khung **Memoization** bên phải (hai ô ban đầu đều ở `1 lần commit`). Bấm **Tăng bộ đếm cha** 2 lần: chỉ state của component cha đổi nên ô **Component thường** tăng lên `2` rồi `3 lần commit`, còn ô **Có React.memo** nhận cùng props cũ nên đứng yên ở `1 lần commit`. Sau đó bấm **Đổi khu khảo sát**: lần này prop khu vực đổi (`1 → 2`) nên cả hai ô cùng tăng thêm `1` (`4` và `2 lần commit`) và cập nhật chỉ số giả lập mới.

**Demo B · Cache & xử lý lỗi với TanStack Query (khoảng 45 giây):** Mở DevTools tab **Network**, đổi bộ lọc sang **Fetch/XHR** rồi bấm **Clear (`🚫`)** để xóa request `/api/pokemon` lúc mới vào trang. Kéo xuống mục **Server state với TanStack Query**: (1) bấm **Ẩn danh sách** rồi bấm **Mở lại danh sách** trong vòng 60 giây (`staleTime`) — danh sách hiện lại tức thì, dòng trạng thái ghi **Có dữ liệu trong cache** và tab Network **không có request mới nào**; (2) bấm **Gọi lại API** — ép gửi ngay một request `GET /api/pokemon` (`200`) xuất hiện trên Network; (3) bấm **Mô phỏng lỗi API** — Network báo request `/api/pokemon?loi=1` lỗi **`503`** và UI hiện thông báo lỗi kèm nút **Thử lại**, cuối cùng bấm **Khôi phục API** để danh sách hoạt động lại bình thường.

### Slide 21 · Demo 2 · Số liệu Lighthouse Trước / Sau sửa code · 17:10–18:20

**Nói:** “Vậy sau khi áp dụng toàn bộ các thay đổi code vừa rồi, con số Lighthouse phản hồi thế nào? Mọi người nhìn vào hai bảng đối chiếu trên màn hình. Ở thí nghiệm tối ưu tải JS, dung lượng JavaScript truyền qua mạng giảm 42% từ 255,4 kB xuống 148,4 kB; thời gian chặn luồng chính TBT giảm mạnh 75% từ 370 ms còn 91 ms, kéo điểm Performance vọt từ 91 lên tròn 100. Còn ở thí nghiệm tối ưu ảnh banner `priority`, cùng dung lượng JS khoảng 146 kB nhưng thời gian LCP rút ngắn từ 2.166 ms xuống còn 1.808 ms — tức nhanh hơn 17% và giữ CLS bằng 0. Mình mở lại trang [/benchmark#before-after](http://127.0.0.1:4173/benchmark#before-after) để xem bảng số liệu trực tiếp.”

**Demo (khoảng 1 phút):** Mở [/benchmark#before-after](http://127.0.0.1:4173/benchmark#before-after), rà nhanh qua đủ 6 chỉ số `Performance`, `LCP`, `CLS`, `TBT`, `FCP`, `Dung lượng JS` ở hai bảng Trước/Sau và bấm trực tiếp sang [/labs/js-before](http://127.0.0.1:4173/labs/js-before), [/labs/js-after](http://127.0.0.1:4173/labs/js-after), [/labs/banner-before](http://127.0.0.1:4173/labs/banner-before), [/labs/banner-after](http://127.0.0.1:4173/labs/banner-after) nếu cần đối chiếu sâu.

### Slide 22 · Chất lượng code: Vấn đề khi không viết test · 18:20–18:55

**Nói:** “Đến đây bài toán hiệu năng coi như đã giải quyết gọn và có số liệu kiểm chứng. Nhưng như mình đặt vấn đề ngay từ đầu: tốc độ cao mà code mong manh thì cũng khó giữ lâu dài. Mỗi lần tách Server/Client Component hay bọc `dynamic()` để tối ưu, nếu không có test tự động, cả team lại phải bấm tay kiểm tra lại từ đầu rất tốn thời gian, dễ bỏ sót lỗi hồi quy và rất ngại refactor code.”

### Slide 23 · Component Testing là gì? · 18:55–19:30

**Nói:** “Đó là lý do mình đưa Component Testing vào quy trình. Hiểu đơn giản, đây là cách viết test tự động để kiểm chứng từng mảnh giao diện đúng như cách người dùng thật sử dụng: từ việc render đúng nội dung, nhận props, gõ chữ, bấm nút cho tới hiện thông báo lỗi hợp lệ khi nhập sai.”

### Slide 24 · Công cụ Component Testing · 19:30–20:05

**Nói:** “Trong project mẫu này, tụi mình kết hợp ba công cụ rất phổ biến và nhẹ: Vitest làm bộ chạy test, React Testing Library để render và tìm nút bấm hay ô nhập đúng theo cách người dùng nhìn thấy, và User Event để mô phỏng thao tác gõ, bấm y như thật.”

### Slide 25 · Nguyên tắc viết test: AAA · 20:05–20:40

**Nói:** “Để người khác đọc bài test phát hiểu ngay, tụi mình viết thống nhất theo 3 bước AAA. Đầu tiên là Arrange để chuẩn bị dữ liệu và dựng component; tiếp theo là Act thực hiện thao tác như người dùng; và cuối cùng Assert kiểm tra kết quả hiển thị trên màn hình. Nhờ tách rạch ròi như vậy, hễ test báo đỏ ở bước Assert là biết ngay giao diện đang lệch ở điểm nào.”

### Slide 26 · Kết quả demo: Test phát hiện lỗi · 20:40–22:00

**Nói:** “Mình kiểm chứng ngay bằng demo chạy test cho phần Sổ nhiệm vụ ở trang chủ, gồm hai luồng tìm kiếm và tạo mới. Trong đó tụi mình cố tình giữ lại một lỗi validation ở form tạo mới: cho phép lưu tên rỗng trong khi test yêu cầu phải báo lỗi bắt buộc. Hãy xem test tự động bắt lỗi này thế nào.”

**Demo (khoảng 1 phút 15 giây):** Mở [/tests](http://127.0.0.1:4173/tests), bấm **Chạy tất cả test** để thấy kết quả **1 đạt, 1 thất bại**. Mở chi tiết case tạo nhiệm vụ để đọc rõ thông báo lỗi chỉ ra vị trí sai, rồi đối chiếu nhanh với cấu trúc Arrange – Act – Assert trong `tests/tasks.test.tsx`.

### Slide 27 · Tổng kết bài toán: Hiệu năng & Chất lượng code · 22:00–22:50

**Nói:** “Nhìn lại toàn bộ hành trình từ đầu buổi đến giờ, tụi mình đã ghép đủ 4 mảnh ghép để giải bài toán phát triển frontend hiện đại: bước một chọn cách render đúng và thu gọn ranh giới Client; bước hai tối ưu có trọng tâm từ JS, ảnh banner đến cache và memo; bước ba không đoán mò mà đo Lighthouse Trước/Sau kết hợp dữ liệu Field ở production; và bước bốn dùng Component Test bảo vệ chất lượng code để tự tin nâng cấp dài hạn.”

### Slide 28 · Q&A · Hỏi đáp & Thảo luận · 22:50–24:00

**Nói:** “Phần trình bày của tụi mình xin phép dừng ở đây. Cảm ơn mọi người đã kiên nhẫn lắng nghe từ phần kiến trúc đến phần thực hành đo đạc. Trên màn hình là ba câu hỏi gợi mở liên quan đến cách phân ranh giới SSR/Client, theo dõi Field data bên cạnh Lighthouse và ưu tiên viết test khi tối ưu code. Mời cả nhóm cùng đặt câu hỏi và trao đổi thêm ạ.”

## Khi demo không ra đúng dấu vết

- Nếu DevTools không hiện lại chunk `dynamic` hoặc ảnh ở [/lazy-load](http://127.0.0.1:4173/lazy-load), nhớ bật **Disable cache** và tải lại trang khi DevTools đã mở; riêng [/lazy-load](http://127.0.0.1:4173/lazy-load) cần cuộn *bên trong khung ảnh*.
- Nếu CSR hết skeleton quá nhanh trên local, dùng throttling trong Network (ví dụ *Slow 3G*) để thấy rõ chuỗi request và waterfall banner `before` vs `after`.
- Nếu [/tests](http://127.0.0.1:4173/tests) trả lỗi khi chạy, kiểm tra server đang chạy qua `127.0.0.1` hoặc `localhost` và dependency đã cài đầy đủ. Trạng thái kỳ vọng vẫn là 1 đạt, 1 thất bại có chủ đích.
- Nếu cần đối chiếu lại số liệu sau khi sửa code, chạy `pnpm benchmark` (cần Chrome/Chromium trên máy local).

## Tài liệu đối chiếu

- [Next.js: Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Next.js: Image Optimization & `priority`](https://nextjs.org/docs/app/api-reference/components/image)
- [Next.js: Lazy Loading](https://nextjs.org/docs/app/guides/lazy-loading)
- [Web Vitals](https://web.dev/articles/vitals)
- [Lighthouse Performance Scoring](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring)
