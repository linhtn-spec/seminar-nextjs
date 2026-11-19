import Link from 'next/link'
import { PageHeading } from '../../../../components/page-heading'
import { failureScenario } from '../../../../lib/test-scenarios'
import { ReproductionForm } from './reproduction-form'

export default function Page() {
  return <>
    <Link className="button" href="/tests">Về danh sách test</Link>
    <PageHeading category="Tái hiện lỗi" title="Form lưu được dù tên trống">
      Giữ ô Tên nhiệm vụ trống và bấm Lưu nhiệm vụ để tái hiện case thất bại.
    </PageHeading>
    <ReproductionForm />
    <section className="panel section">
      <h2>Quy tắc bị thiếu</h2>
      <p>{failureScenario.reproduction.cause} Tệp chứa cấu hình lỗi là <code>{failureScenario.reproduction.source}</code>.</p>
      <p>Trang này ghi nhận lần gọi hàm lưu để bạn quan sát. Dữ liệu chỉ tồn tại trong phiên tái hiện.</p>
    </section>
  </>
}
