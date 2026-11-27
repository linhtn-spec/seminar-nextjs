import Image from 'next/image'
import { LabSwitch } from '../../../components/labs/lab-switch'
import { PageHeading } from '../../../components/page-heading'
import { PokemonList } from '../../../components/pokemon-list'
import { getPokemon } from '../../../lib/pokemon-server'

export const dynamic = 'force-static'

export default async function BannerAfterPage() {
  const pokemon = await getPokemon()

  return (
    <>
      <figure className="lab-banner-card">
        <div className="lab-banner-frame">
          <Image
            src="/banner-kanto.webp"
            alt="Banner phòng nghiên cứu Pokédex vùng Kanto (tải sớm với priority và định dạng WebP)"
            width={1440}
            height={540}
            priority
            fetchPriority="high"
            unoptimized
            className="lab-banner-img"
          />
        </div>
        <figcaption className="lab-banner-caption">
          <strong>Đã tối ưu:</strong> Banner render từ Server Component, dùng WebP (<code>/banner-kanto.webp</code>), khai báo đủ <code>width/height</code> giữ chỗ tránh CLS,
          gắn <code>priority</code> để Next.js chèn <code>&lt;link rel=&quot;preload&quot;&gt;</code> ngay trong HTML đầu tiên.
        </figcaption>
      </figure>
      <PageHeading category="Ảnh banner · Sau (After)" title="Ảnh banner tải sớm với priority">
        Cùng bố cục và nội dung trang — chỉ chuyển banner từ tải thường sang Server Component với định dạng WebP và <code>priority</code> tải sớm.
      </PageHeading>
      <LabSwitch
        beforeHref="/labs/banner-before"
        afterHref="/labs/banner-after"
        beforeLabel="Trước (Tải thường)"
        afterLabel="Sau (Priority + WebP)"
        current="after"
      />
      <section className="section">
        <div className="section-heading">
          <div>
            <h2>Danh sách Pokédex bên dưới banner</h2>
            <p>Cùng 9 Pokémon và cùng vị trí banner — đối chiếu LCP và điểm Performance so với bản Trước.</p>
          </div>
        </div>
        <PokemonList pokemon={pokemon} />
      </section>
    </>
  )
}
