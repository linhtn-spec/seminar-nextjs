# Benchmark Pokédex

Đo lúc 2026-11-25T06:52:29.405Z (UTC), 3 lần mỗi route. Bảng dùng median.
Chrome/158.0.8127.36, Lighthouse 13.6.0, Node v22.23.1.
linux 6.8.0-149-generic x64 · Intel(R) Core(TM) i3-10105 CPU @ 3.70GHz · 8 luồng CPU khả dụng.
Mobile preset, throttling mô phỏng của Lighthouse. Mỗi lượt dùng Chrome headless mới và cache trình duyệt lạnh. Server production dùng chung trên loopback và được khởi động trước khi đo.
Throttling: RTT 150 ms, thông lượng 1638.4 Kbit/s, CPU chậm hơn 4 lần.
HTML và JavaScript dùng transferSize của Lighthouse. Số request là số dòng trong audit network-requests. INP cần đo từ phiên tương tác.

| Chỉ số | CSR | SSR | SSG |
| --- | ---: | ---: | ---: |
| Lighthouse Performance (/100) | 99 | 100 | 100 |
| FCP (ms) | 759.675 | 608.495 | 758.896 |
| LCP (ms) | 759.675 | 608.495 | 758.896 |
| CLS | 0 | 0 | 0 |
| Total Blocking Time (ms) | 110 | 76 | 87 |
| JavaScript truyền qua mạng (byte) | 187264 | 141954 | 141954 |
| HTML truyền qua mạng (byte) | 4326 | 7211 | 6166 |
| Số request | 15 | 10 | 10 |

Số đo phản ánh bản build và điều kiện ghi ở trên. Các route có đường tải dữ liệu và phạm vi JavaScript khác nhau.
