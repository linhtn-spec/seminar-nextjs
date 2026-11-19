import type { ReactNode } from 'react'
import { Workflow } from 'lucide-react'
import { strategies, type Strategy } from '../lib/rendering'
import { PageHeading } from './page-heading'

export function RenderingPage({ strategy, children }: { strategy: Strategy; children: ReactNode }) {
  const info = strategies[strategy]
  return <>
    <PageHeading category="Chiến lược rendering" title={`${strategy} · ${info.title}`}>{info.summary}</PageHeading>
    <div className="flow-note"><Workflow size={20} aria-hidden /><span>{info.flow}</span></div>
    <section className="section" aria-labelledby="pokedex-heading">
      <div className="section-heading">
        <div><h2 id="pokedex-heading">Pokédex vùng Kanto</h2><p>Bộ dữ liệu cục bộ dùng chung trong benchmark.</p></div>
      </div>
      {children}
    </section>
  </>
}
