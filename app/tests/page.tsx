import { PageHeading } from '../../components/page-heading'
import { TestCases } from './test-cases'

export default function Page() {
  return <>
    <PageHeading category="Kiểm thử" title="Danh sách test">
      Hai test thêm và tìm kiếm nhiệm vụ. Xem các bước kiểm tra hoặc bấm Chạy để nhận kết quả Vitest.
    </PageHeading>
    <TestCases />
  </>
}
