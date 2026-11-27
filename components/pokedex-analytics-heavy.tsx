'use client'

import { useMemo, useState } from 'react'
import { BarChart3, Search } from 'lucide-react'
import rawTelemetry from '../lib/kanto-telemetry.json'
import type { KantoEntry } from '../lib/kanto-types'

const catalog = rawTelemetry as KantoEntry[]

function computeEcologicalReport(entries: KantoEntry[]) {
  const typeCounts = new Map<string, number>()
  let totalPower = 0
  let synergyIndex = 0

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i]
    for (const type of entry.types) {
      typeCounts.set(type, (typeCounts.get(type) ?? 0) + 1)
    }
    const base = entry.hp + entry.attack + entry.defense + entry.speed
    totalPower += base

    // Tổng hợp chuỗi quan trắc sinh thái theo 280 mốc và nhiều chu kỳ mùa
    for (let pass = 0; pass < 36; pass++) {
      for (let s = 0; s < entry.series.length; s++) {
        const sample = entry.series[s]
        synergyIndex += Math.sin(sample * 0.05 + entry.id + pass) * Math.cos((base + s) * 0.01)
      }
    }
    // So sánh tương quan giữa các loài cùng vùng hoặc trùng hệ
    for (let j = 0; j < entries.length; j++) {
      const peer = entries[j]
      if (peer.habitat === entry.habitat || peer.types[0] === entry.types[0]) {
        synergyIndex += ((entry.speed * peer.attack) % 97) * 0.001
      }
    }
  }

  const distribution = [...typeCounts.entries()]
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count)

  return {
    totalSpecies: entries.length,
    averagePower: Math.round(totalPower / entries.length),
    topType: distribution[0]?.type ?? '—',
    synergyScore: Math.round(Math.abs(synergyIndex) * 10) / 10,
    distribution,
  }
}

export function PokedexAnalyticsHeavy() {
  const [query, setQuery] = useState('')
  const [selectedType, setSelectedType] = useState('Tất cả')

  const report = useMemo(() => computeEcologicalReport(catalog), [])

  const filtered = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase('vi')
    return catalog.filter((entry) => {
      const matchType = selectedType === 'Tất cả' || entry.types.includes(selectedType)
      const matchText =
        !keyword ||
        entry.name.toLocaleLowerCase('vi').includes(keyword) ||
        entry.habitat.toLocaleLowerCase('vi').includes(keyword)
      return matchType && matchText
    })
  }, [query, selectedType])

  const maxCount = Math.max(1, ...report.distribution.map((d) => d.count))

  return (
    <section className="panel section" aria-labelledby="heavy-analytics-heading">
      <div className="lab-heading">
        <span className="strategy-icon tone-water"><BarChart3 size={20} aria-hidden /></span>
        <div>
          <h2 id="heavy-analytics-heading">Phân tích dữ liệu 151 loài Pokémon Kanto</h2>
          <p>
            Tổng hợp {report.totalSpecies} loài × 280 mốc quan trắc · Sức mạnh trung bình{' '}
            <strong>{report.averagePower}</strong> · Chỉ số tương quan sinh thái{' '}
            <strong>{report.synergyScore}</strong>
          </p>
        </div>
      </div>

      <div className="lab-chart-box">
        <figure className="chart">
          <figcaption>Phân bố hệ nguyên tố toàn vùng Kanto (Hệ phổ biến nhất: {report.topType})</figcaption>
          <div className="lab-type-bars" role="img" aria-label="Biểu đồ phân bố 9 hệ Pokémon Kanto">
            {report.distribution.map(({ type, count }) => (
              <div key={type} className="lab-type-row">
                <span className="lab-type-label">{type}</span>
                <span className="lab-type-track">
                  <span className="lab-type-fill" style={{ width: `${(count / maxCount) * 100}%` }} />
                </span>
                <span className="lab-type-count">{count}</span>
              </div>
            ))}
          </div>
        </figure>
      </div>

      <div className="filter-row">
        <label className="search">
          <Search size={16} aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm trong 151 loài Kanto theo tên hoặc môi trường…"
            aria-label="Tìm trong 151 loài Kanto"
          />
        </label>
        <div className="filter-select">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            aria-label="Lọc theo hệ Pokémon"
          >
            <option value="Tất cả">Tất cả hệ</option>
            {report.distribution.map(({ type }) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <p className="caption lab-filter-count">
        Đang hiển thị {Math.min(12, filtered.length)} / {filtered.length} loài phù hợp
      </p>

      <ul className="pokemon-grid" aria-label="Kết quả phân tích 151 loài">
        {filtered.slice(0, 12).map((entry) => (
          <li key={entry.id} className="pokemon-card">
            <div>
              <span className="dex-id">#{String(entry.id).padStart(3, '0')} · {entry.habitat}</span>
              <h3>{entry.name}</h3>
              <p className="caption">HP {entry.hp} · ATK {entry.attack} · SPD {entry.speed}</p>
            </div>
            <div className="type-row">
              {entry.types.map((t) => (
                <span key={t} className="type-tag tone-neutral">{t}</span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
