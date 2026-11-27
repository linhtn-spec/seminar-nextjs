'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Activity, AppWindow, BookOpen, ChartNoAxesColumnIncreasing, CircleDot, Cpu, Database, FlaskConical, Image as ImageIcon, Images, Layers, Route, Server } from 'lucide-react'

const groups = [
  { title: '', links: [{ href: '/', label: 'Sổ nghiên cứu', icon: BookOpen }] },
  { title: 'Phần 1 · Rendering', links: [
    { href: '/visualizer', label: 'Mô phỏng rendering', icon: Route },
    { href: '/csr', label: 'CSR', icon: AppWindow },
    { href: '/ssr', label: 'SSR', icon: Server },
    { href: '/ssg', label: 'SSG', icon: Database },
    { href: '/components', label: 'Server & Client', icon: Layers },
  ] },
  { title: 'Phần 2 · Tối ưu & Đo', links: [
    { href: '/benchmark', label: 'Benchmark Lighthouse', icon: ChartNoAxesColumnIncreasing },
    { href: '/labs/js-before', label: 'Tối ưu JS (Trước/Sau)', icon: Cpu },
    { href: '/labs/banner-before', label: 'Banner priority', icon: ImageIcon },
    { href: '/lazy-load', label: 'Lazy load ảnh', icon: Images },
    { href: '/performance', label: 'Memo & Server state', icon: Activity },
    { href: '/tests', label: 'Kiểm thử component', icon: FlaskConical },
  ] },
]

export function Navigation() {
  const current = usePathname()
  return <aside className="sidebar">
    <Link className="brand" href="/" prefetch={false}>
      <span className="brand-icon"><CircleDot size={24} /></span>
      <span><strong>Pokédex Lab</strong><small>Frontend Roadmap</small></span>
    </Link>
    <nav aria-label="Điều hướng chính">
      {groups.map((group) => <div className="nav-group" key={group.title}>
        {group.title && <p>{group.title}</p>}
        {group.links.map(({ href, label, icon: Icon }) => {
          const isLabMatch =
            (href === '/labs/js-before' && current.startsWith('/labs/js-')) ||
            (href === '/labs/banner-before' && current.startsWith('/labs/banner-'))
          return <Link key={href} href={href} prefetch={false} aria-current={current === href || isLabMatch ? 'page' : undefined}>
            <Icon size={17} aria-hidden /> <span>{label}</span>
          </Link>
        })}
      </div>)}
    </nav>
  </aside>
}
