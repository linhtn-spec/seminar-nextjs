import { PageHeading } from '../../../components/page-heading'
import { JsAfterLauncher } from '../../../components/labs/js-after-launcher'
import { LabSwitch } from '../../../components/labs/lab-switch'
import { PokemonList } from '../../../components/pokemon-list'
import { getPokemon } from '../../../lib/pokemon-server'

export const dynamic = 'force-static'

export default async function JsAfterPage() {
  const pokemon = await getPokemon()

  return (
    <>
      <PageHeading category="Tối ưu tải JS · Sau (After)" title="Giảm JS với Server Component & dynamic()">
        Bản đã tối ưu: phần danh sách chính giữ ở Server Component (không tốn JS), còn widget 151 loài Kanto chỉ tải qua <code>next/dynamic()</code> khi người dùng bấm mở.
      </PageHeading>
      <LabSwitch
        beforeHref="/labs/js-before"
        afterHref="/labs/js-after"
        beforeLabel="Trước (Before)"
        afterLabel="Sau (After)"
        current="after"
      />
      <div className="flow-note" role="note">
        <span>Cấu trúc code Sau: Server Component dựng danh sách + <code>dynamic(() =&gt; import(...), &#123; ssr: false &#125;)</code> chỉ tải khi bấm.</span>
      </div>
      <section className="section">
        <div className="section-heading">
          <div>
            <h2>9 Pokémon nổi bật (Server Component · 0 KB JS)</h2>
            <p>Khung trang và 9 thẻ chính trả về ngay bằng HTML từ Server Component, không kéo theo chunk phân tích 151 loài.</p>
          </div>
        </div>
        <PokemonList pokemon={pokemon} />
      </section>
      <JsAfterLauncher />
    </>
  )
}
