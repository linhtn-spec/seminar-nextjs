# Benchmark Pokédex

Đo lúc 2026-11-25T06:34:30.304Z (UTC), 3 lần mỗi route. Bảng dùng median.
Chrome/154.0.8037.57, Lighthouse 13.6.0, Node v22.19.0.
linux 6.8.0-149-generic x64 · Intel(R) Core(TM) i3-10105 CPU @ 3.70GHz · 8 luồng CPU khả dụng.
Mobile preset, throttling mô phỏng của Lighthouse. Mỗi lượt dùng Chrome headless mới và cache trình duyệt lạnh. Server production dùng chung trên loopback và được khởi động trước khi đo.
Throttling: RTT 150 ms, thông lượng 1638.4 Kbit/s, CPU chậm hơn 4 lần.
HTML và JavaScript dùng transferSize của Lighthouse. Số request là số dòng trong audit network-requests. INP cần đo từ phiên tương tác.

| Chỉ số | CSR | SSR | SSG |
| --- | ---: | ---: | ---: |
| Lighthouse Performance (/100) | 99 | 99 | 100 |
| FCP (ms) | 757.872 | 606.799 | 756.849 |
| LCP (ms) | 757.872 | 1508.561 | 758.084 |
| CLS | 0 | 0 | 0 |
| Total Blocking Time (ms) | 93 | 137 | 74 |
| JavaScript truyền qua mạng (byte) | 187265 | 141954 | 141954 |
| HTML truyền qua mạng (byte) | 4326 | 7211 | 6164 |
| Số request | 15 | 10 | 10 |

Số đo phản ánh bản build và điều kiện ghi ở trên. Các route có đường tải dữ liệu và phạm vi JavaScript khác nhau.
