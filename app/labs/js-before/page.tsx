import { PageHeading } from '../../../components/page-heading'
import { JsBeforeClient } from '../../../components/labs/js-before-client'
import { LabSwitch } from '../../../components/labs/lab-switch'
import { getPokemon } from '../../../lib/pokemon-server'

export const dynamic = 'force-static'

export default async function JsBeforePage() {
  const pokemon = await getPokemon()

  return (
    <>
      <PageHeading category="Tối ưu tải JS · Trước (Before)" title="Tải JS đồng bộ trên Client">
        Bản chưa tối ưu: import thẳng widget phân tích 151 loài Kanto ngay lúc mở trang, khiến bundle JavaScript và thời gian chặn luồng chính (TBT) tăng mạnh.
      </PageHeading>
      <LabSwitch
        beforeHref="/labs/js-before"
        afterHref="/labs/js-after"
        beforeLabel="Trước (Before)"
        afterLabel="Sau (After)"
        current="before"
      />
      <div className="flow-note" role="note">
        <span>Cấu trúc code Trước: <code>&apos;use client&apos;</code> + <code>import &#123; PokedexAnalyticsHeavy &#125;</code> đồng bộ ngay khi tải trang.</span>
      </div>
      <JsBeforeClient pokemon={pokemon} />
    </>
  )
}
