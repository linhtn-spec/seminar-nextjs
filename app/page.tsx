import Link from 'next/link'
import { Activity, AppWindow, ChartNoAxesColumnIncreasing, Cpu, Database, FlaskConical, Image as ImageIcon, Layers, Play, Server } from 'lucide-react'
import { TaskManager } from '../components/task-manager'
import { strategies, strategyNames } from '../lib/rendering'

const icons = { CSR: AppWindow, SSR: Server, SSG: Database }
const tones = { CSR: 'water', SSR: 'fire', SSG: 'leaf' }
const labLinks = [
  { href: '/components', title: 'Server & Client', desc: 'Ranh giới component và Hydration', icon: Layers, tone: 'water' },
  { href: '/labs/js-before', title: 'Tối ưu tải JS', desc: 'So sánh Trước / Sau dùng dynamic()', icon: Cpu, tone: 'fire' },
  { href: '/labs/banner-before', title: 'Banner priority', desc: 'Tải sớm banner & WebP (LCP)', icon: ImageIcon, tone: 'electric' },
  { href: '/performance', title: 'Memo & Server State', desc: 'React.memo và cache TanStack Query', icon: Activity, tone: 'leaf' },
  { href: '/benchmark#before-after', title: 'Benchmark Lighthouse', desc: 'Bảng số đo CSR/SSR/SSG & Trước/Sau', icon: ChartNoAxesColumnIncreasing, tone: 'water' },
  { href: '/tests', title: 'Component Testing', desc: 'Chạy Vitest bắt lỗi form theo AAA', icon: FlaskConical, tone: 'fire' },
] as const

export default function Home() {
  return <>
    <div className="topline"><span>Phòng nghiên cứu</span><span>Seminar Next.js</span></div>
    <header className="hero">
      <div className="hero-content">
        <p className="eyebrow">FRONTEND ROADMAP</p>
        <h1>Pokédex Lab</h1>
        <p>Theo dấu Pokémon vùng Kanto và khám phá cách Next.js đưa dữ liệu từ server lên màn hình.</p>
        <Link className="button hero-button" href="/visualizer" prefetch={false}><Play size={16} /> Mở mô phỏng rendering</Link>
      </div>
    </header>
    <section className="section" aria-labelledby="strategies-heading">
      <div className="section-heading"><div><h2 id="strategies-heading">Chiến lược rendering</h2><p>Cùng một Pokédex, ba cách tạo nội dung.</p></div></div>
      <div className="strategy-grid">
        {strategyNames.map((name) => {
          const Icon = icons[name]
          return <Link prefetch={false} href={`/${name.toLowerCase()}`} className="strategy-card" key={name}>
            <div className={`strategy-icon tone-${tones[name]}`}><Icon size={21} aria-hidden /></div>
            <div><h3>{name}</h3><p>{strategies[name].title}</p></div>
          </Link>
        })}
      </div>
    </section>
    <section className="section" aria-labelledby="labs-heading">
      <div className="section-heading"><div><h2 id="labs-heading">Thực nghiệm tối ưu, đo Lighthouse &amp; kiểm thử</h2><p>Mở nhanh từng phần demo tương ứng với slide trình bày.</p></div></div>
      <div className="strategy-grid">
        {labLinks.map(({ href, title, desc, icon: Icon, tone }) => (
          <Link prefetch={false} href={href} className="strategy-card" key={href}>
            <div className={`strategy-icon tone-${tone}`}><Icon size={21} aria-hidden /></div>
            <div><h3>{title}</h3><p>{desc}</p></div>
          </Link>
        ))}
      </div>
    </section>
    <TaskManager />
  </>
}
