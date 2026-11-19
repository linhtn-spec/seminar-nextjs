import { PageHeading } from '../../components/page-heading'
import { TestCases } from './test-cases'

export default function Page() {
  return <>
    <PageHeading category="Kiểm thử" title="Danh sách test">
      Bấm Chạy để Chrome chụp giao diện theo từng bước rồi xem kết quả Vitest.
    </PageHeading>
    <TestCases />
  </>
}
