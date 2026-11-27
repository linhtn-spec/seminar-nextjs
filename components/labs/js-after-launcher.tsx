'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Sparkles } from 'lucide-react'

const PokedexAnalyticsHeavy = dynamic(
  () => import('../pokedex-analytics-heavy').then((mod) => mod.PokedexAnalyticsHeavy),
  {
    ssr: false,
    loading: () => (
      <div role="status" className="state section">
        Đang tải chunk JavaScript phân tích 151 Pokémon Kanto…
      </div>
    ),
  },
)

export function JsAfterLauncher() {
  const [open, setOpen] = useState(false)

  return (
    <section className="panel section" aria-labelledby="dynamic-analytics-heading">
      <div className="lab-heading">
        <span className="strategy-icon tone-leaf"><Sparkles size={20} aria-hidden /></span>
        <div>
          <h2 id="dynamic-analytics-heading">Phân tích nâng cao 151 loài Kanto (Tải theo nhu cầu)</h2>
          <p>Dùng <code>next/dynamic(..., &#123; ssr: false &#125;)</code>: chỉ tải chunk dữ liệu lớn khi người dùng thật sự bấm mở.</p>
        </div>
      </div>
      <div className="actions">
        <button
          type="button"
          className={open ? 'button' : 'button primary'}
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
        >
          {open ? 'Thu gọn bảng phân tích' : 'Tải và mở phân tích 151 Pokémon'}
        </button>
        <span className="caption">
          {open ? 'Chunk JS nâng cao đã được tải về trình duyệt.' : 'Chưa tải chunk nặng ở lần mở trang đầu tiên.'}
        </span>
      </div>
      {open && <PokedexAnalyticsHeavy />}
    </section>
  )
}
