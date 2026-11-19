# Benchmark Pokédex

Đo lúc 2026-11-19T04:32:57.974Z (UTC), 3 lần mỗi route. Bảng dùng median.
Chrome/158.0.8127.36, Lighthouse 13.6.0, Node v22.23.1.
linux 5.15.0-139-generic x64 · Intel(R) Core(TM) i3-10105 CPU @ 3.70GHz · 8 luồng CPU khả dụng.
Mobile preset, throttling mô phỏng của Lighthouse. Mỗi lượt dùng Chrome headless mới và cache trình duyệt lạnh. Server production dùng chung trên loopback và được khởi động trước khi đo.
Throttling: RTT 150 ms, thông lượng 1638.4 Kbit/s, CPU chậm hơn 4 lần.
HTML và JavaScript dùng transferSize của Lighthouse. Số request là số dòng trong audit network-requests. INP cần đo từ phiên tương tác.

| Chỉ số | CSR | SSR | SSG |
| --- | ---: | ---: | ---: |
| Lighthouse Performance (/100) | 100 | 100 | 100 |
| FCP (ms) | 757.899 | 648.868 | 756.539 |
| LCP (ms) | 757.899 | 648.868 | 756.539 |
| CLS | 0 | 0 | 0 |
| Total Blocking Time (ms) | 84 | 88 | 77 |
| JavaScript truyền qua mạng (byte) | 187529 | 142219 | 142219 |
| HTML truyền qua mạng (byte) | 4549 | 7429 | 6380 |
| Số request | 15 | 10 | 10 |

Số đo phản ánh bản build và điều kiện ghi ở trên. Các route có đường tải dữ liệu và phạm vi JavaScript khác nhau.
