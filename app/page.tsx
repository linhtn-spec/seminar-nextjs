import Link from 'next/link'
import { AppWindow, Database, Play, Server } from 'lucide-react'
import { TaskManager } from '../components/task-manager'
import { strategies, strategyNames } from '../lib/rendering'

const icons = { CSR: AppWindow, SSR: Server, SSG: Database }
const tones = { CSR: 'water', SSR: 'fire', SSG: 'leaf' }

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
    <TaskManager />
  </>
}
