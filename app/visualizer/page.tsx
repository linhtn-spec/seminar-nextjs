import { PageHeading } from '../../components/page-heading'
import { Visualizer } from '../../components/visualizer'

export default function Page() {
  return <>
    <PageHeading category="Chiến lược rendering" title="Mô phỏng rendering" image="/rendering-lab.webp">
      Theo dõi Browser, Server và Build qua từng bước tạo trang Pokédex.
    </PageHeading>
    <Visualizer />
  </>
}
