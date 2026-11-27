# Benchmark Pokédex

Đo lúc 2026-11-27T05:03:49.418Z (UTC), 3 lần mỗi route. Bảng dùng median.
Chrome/158.0.8127.36, Lighthouse 13.6.0, Node v22.23.1.
linux 6.8.0-149-generic x64 · Intel(R) Core(TM) i3-10105 CPU @ 3.70GHz · 8 luồng CPU khả dụng.
Mobile preset, throttling mô phỏng của Lighthouse. Mỗi lượt dùng Chrome headless mới và cache trình duyệt lạnh. Server production dùng chung trên loopback và được khởi động trước khi đo.
Throttling: RTT 150 ms, thông lượng 1638.4 Kbit/s, CPU chậm hơn 4 lần.
HTML và JavaScript dùng transferSize của Lighthouse. Số request là số dòng trong audit network-requests. INP cần đo từ phiên tương tác.

## 1. So sánh chiến lược Rendering (CSR / SSR / SSG)

| Chỉ số | CSR | SSR | SSG |
| --- | ---: | ---: | ---: |
| Lighthouse Performance (/100) | 99 | 99 | 100 |
| FCP (ms) | 757.908 | 606.505 | 755.909 |
| LCP (ms) | 757.908 | 606.505 | 755.909 |
| CLS | 0 | 0 | 0 |
| Total Blocking Time (ms) | 121 | 101 | 80 |
| JavaScript truyền qua mạng (byte) | 187969 | 142659 | 142659 |
| HTML truyền qua mạng (byte) | 4725 | 7608 | 6562 |
| Số request | 15 | 10 | 10 |

## 2. Trước & Sau tối ưu tải JS (/labs/js-before → /labs/js-after)

| Chỉ số | Trước (Before) | Sau (After) | Thay đổi |
| --- | ---: | ---: | ---: |
| Lighthouse Performance (/100) | 91 | 100 | +9 |
| LCP (ms) | 757.081 | 757.756 | +0.675 (0%) |
| CLS | 0 | 0 | 0 |
| Total Blocking Time (ms) | 370 | 91 | -279 (-75%) |
| FCP (ms) | 757.081 | 757.756 | +0.675 (0%) |
| JavaScript truyền qua mạng (byte) | 261525 | 151958 | -109567 (-42%) |
| Số request | 14 | 12 | -2 |

## 3. Trước & Sau tối ưu ảnh banner priority (/labs/banner-before → /labs/banner-after)

| Chỉ số | Trước (Before) | Sau (After) | Thay đổi |
| --- | ---: | ---: | ---: |
| Lighthouse Performance (/100) | 99 | 100 | +1 |
| LCP (ms) | 2165.867 | 1808.129 | -357.738 (-17%) |
| CLS | 0 | 0 | 0 |
| Total Blocking Time (ms) | 42.5 | 48 | +5.5 (+13%) |
| FCP (ms) | 756.372 | 758.129 | +1.758 (0%) |
| JavaScript truyền qua mạng (byte) | 150003 | 149286 | -717 (0%) |
| Số request | 13 | 13 | 0 |

Số đo phản ánh bản build và điều kiện ghi ở trên.
