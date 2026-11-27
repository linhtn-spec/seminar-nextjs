'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AppWindow, BookOpen, ChartNoAxesColumnIncreasing, CircleDot, Database, FlaskConical, Images, Route, Server } from 'lucide-react'

const groups = [
  { title: '', links: [{ href: '/', label: 'Sổ nghiên cứu', icon: BookOpen }] },
  { title: 'Chiến lược rendering', links: [
    { href: '/visualizer', label: 'Mô phỏng rendering', icon: Route },
    { href: '/csr', label: 'CSR', icon: AppWindow },
    { href: '/ssr', label: 'SSR', icon: Server },
    { href: '/ssg', label: 'SSG', icon: Database },
  ] },
  { title: 'Kiến trúc và hiệu năng', links: [
    { href: '/benchmark', label: 'Benchmark', icon: ChartNoAxesColumnIncreasing },
    { href: '/lazy-load', label: 'Demo lazy load', icon: Images },
    { href: '/tests', label: 'Danh sách test', icon: FlaskConical },
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
        {group.links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} prefetch={false} aria-current={current === href ? 'page' : undefined}>
          <Icon size={17} aria-hidden /> <span>{label}</span>
        </Link>)}
      </div>)}
    </nav>
  </aside>
}
