import { CsrPokedex } from '../../components/csr-pokedex'
import { PageHeading } from '../../components/page-heading'
import { PerformanceExperiments } from '../../components/performance-experiments'

export default function Page() {
  return <>
    <PageHeading category="Hiệu năng" title="Thử nghiệm hiệu năng">
      Bấm để tải biểu đồ, đối chiếu hai bộ đếm render và thử gọi lại API Pokédex.
    </PageHeading>
    <PerformanceExperiments />
    <section className="section" aria-labelledby="query-heading">
      <div className="section-heading"><div><h2 id="query-heading">Server state với TanStack Query</h2><p>Thử xem lúc nào Pokédex dùng cache và lúc nào browser gọi lại API.</p></div></div>
      <ol className="strategy-grid lab-flow">
        <li className="panel"><h3>Ẩn rồi mở lại</h3><p>Trong 60 giây, dữ liệu được lấy từ cache.</p></li>
        <li className="panel"><h3>Gọi lại API</h3><p>Browser gửi request mới. Xem Network để kiểm chứng.</p></li>
        <li className="panel"><h3>Mô phỏng lỗi</h3><p>API trả HTTP 503. Bấm khôi phục để quay lại danh sách.</p></li>
      </ol>
      <CsrPokedex controls />
    </section>
    <section className="section" aria-labelledby="vitals-heading">
      <div className="section-heading"><div><h2 id="vitals-heading">Core Web Vitals</h2><p>Dùng Lighthouse cho lần tải trang và Performance trong Chrome DevTools cho phiên tương tác.</p></div></div>
      <dl className="strategy-grid vitals">
        <div className="panel"><dt>LCP</dt><dd>Thời điểm phần tử nội dung lớn nhất trong viewport được hiển thị.</dd></div>
        <div className="panel"><dt>INP</dt><dd>Độ trễ phản hồi của tương tác. Ghi một phiên Performance và thử nhấp, gõ, đổi bộ lọc để quan sát.</dd></div>
        <div className="panel"><dt>CLS</dt><dd>Mức xê dịch bố cục ngoài dự kiến. Xem các cụm dịch chuyển trong Performance.</dd></div>
      </dl>
    </section>
  </>
}
