import { BannerBeforeClient } from '../../../components/labs/banner-before-client'
import { LabSwitch } from '../../../components/labs/lab-switch'
import { PageHeading } from '../../../components/page-heading'
import { PokemonList } from '../../../components/pokemon-list'
import { getPokemon } from '../../../lib/pokemon-server'

export const dynamic = 'force-static'

export default async function BannerBeforePage() {
  const pokemon = await getPokemon()

  return (
    <>
      <BannerBeforeClient />
      <PageHeading category="Ảnh banner · Trước (Before)" title="Ảnh banner tải bình thường">
        Bản chưa tối ưu ảnh chính (LCP): ảnh banner đặt trong Client Component, dùng PNG nặng và <code>loading=&quot;lazy&quot;</code> mặc định (không <code>priority</code> / <code>preload</code>).
      </PageHeading>
      <LabSwitch
        beforeHref="/labs/banner-before"
        afterHref="/labs/banner-after"
        beforeLabel="Trước (Tải thường)"
        afterLabel="Sau (Priority + WebP)"
        current="before"
      />
      <section className="section">
        <div className="section-heading">
          <div>
            <h2>Danh sách Pokédex bên dưới banner</h2>
            <p>Khi banner đầu trang tải bình thường không gắn <code>priority</code>, trình duyệt chờ CSS/JS rồi mới tải file ảnh nặng, đẩy LCP tăng cao.</p>
          </div>
        </div>
        <PokemonList pokemon={pokemon} />
      </section>
    </>
  )
}
