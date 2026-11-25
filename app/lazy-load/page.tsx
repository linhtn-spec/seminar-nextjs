import { PageHeading } from '../../components/page-heading'
import { LazyLoadLab } from './lazy-load-lab'

export default function Page() {
  return <>
    <PageHeading category="Hiệu năng" title="Demo lazy load">
      Cuộn trong thư viện để xem ảnh chỉ được tải khi đi vào vùng nhìn thấy.
    </PageHeading>
    <LazyLoadLab />
  </>
}
