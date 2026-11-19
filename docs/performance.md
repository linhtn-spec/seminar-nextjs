# Thử nghiệm hiệu năng

## Lazy loading

Mở `/performance` ở production, vào Network, lọc JS và tải lại. Nhấn **Tải biểu đồ** và xem chunk mới trong cột **Initiator**. Chart dùng `next/dynamic` với `ssr: false` và chỉ được mount khi có thao tác. Tải theo nhu cầu làm nhỏ công việc ban đầu, nhưng người dùng sẽ chờ tải và tính toán biểu đồ khi mở lần đầu.

## Memoization

Nhấn **Tăng bộ đếm cha** vài lần. Số commit của component thường tăng, ô React.memo giữ nguyên. Bấm **Đổi khu khảo sát** để thay đổi props và thấy cả hai ô cùng tăng. Counter đo commit của component, có thể thấy thêm lần chạy effect trong Strict Mode ở development. Khi cân nhắc áp dụng thực tế, đo thời gian cần thiết để render và tần suất props đổi.

## Server state

Pokédex do API sở hữu, query cache giữ phản hồi trong bộ nhớ. Trạng thái đóng/mở danh sách hay bật lỗi mô phỏng do component sở hữu. Sau lần fetch thành công, **Ẩn danh sách** rồi **Mở lại danh sách** trong 60 giây để kiểm chứng cache qua Network. **Gọi lại API** chủ động fetch. **Mô phỏng lỗi API** gọi query key riêng và nhận HTTP 503. Khôi phục API quay lại key thành công.

## Core Web Vitals

- **LCP** đo thời điểm nội dung lớn nhất đủ điều kiện trong vùng nhìn được hiển thị.
- **INP** phản ánh độ trễ tương tác, kể cả chờ xử lý và chờ frame tiếp theo. Mở Performance, ghi phiên, gõ tìm kiếm, chọn bộ lọc và đọc track Interactions. Một phiên local giúp chẩn đoán, còn dữ liệu người dùng thật dùng để đánh giá trải nghiệm thực tế.
- **CLS** đo dịch chuyển bố cục bất ngờ từ các cụm dịch chuyển. Performance hiển thị track Layout Shifts để truy nguồn.

Mở tab Lighthouse, chọn Performance và chế độ Navigation trên một route production để lấy FCP, LCP, CLS và TBT. TBT đo mức chặn main thread trong lần tải trang. Dùng Performance để quan sát tương tác và INP. [Web Vitals](https://web.dev/articles/vitals), [TBT trong Lighthouse](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-total-blocking-time)
