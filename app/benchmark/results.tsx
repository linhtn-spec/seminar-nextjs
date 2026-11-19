import { Activity, AppWindow, ChevronDown, Database, Server, Timer } from 'lucide-react'
import metrics from '../../lib/benchmark-metrics.json'
import styles from './results.module.css'

const routes = [
  { key: 'csr', name: 'CSR', icon: AppWindow, color: styles.csr },
  { key: 'ssr', name: 'SSR', icon: Server, color: styles.ssr },
  { key: 'ssg', name: 'SSG', icon: Database, color: styles.ssg },
] as const

export type BenchmarkMedians = Record<(typeof routes)[number]['key'], Record<string, number>>

const integer = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 })
const decimal = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 3 })

function format(value: number | undefined, formatter = decimal) {
  return value === undefined ? '—' : formatter.format(value)
}

export function BenchmarkResults({ medians, date, runs }: {
  medians: BenchmarkMedians
  date: string
  runs: number
}) {
  const rows = routes.map((route) => {
    const value = medians[route.key].lcp
    return { ...route, lcp: value >= 0 ? Math.round(value) : undefined }
  })
  const measured = rows.flatMap(({ lcp }) => lcp === undefined ? [] : [lcp])
  const max = Math.max(1, ...measured)
  const scale = Math.ceil(max / 100) * 100
  const min = Math.min(...measured)
  const fastest = rows.filter(({ lcp }) => lcp === min)
  const winner = measured.length === rows.length && fastest.length === 1 ? fastest[0] : undefined

  return <>
    <div className={styles.meta}>
      <span>Trung vị của {runs} lượt mỗi route</span>
      <span>{date} · Giờ Việt Nam</span>
    </div>
    <div className={styles.grid}>
      <section className={`panel ${styles.chart}`} aria-labelledby="lcp-heading">
        <div className={styles.metricHeading}>
          <span className={styles.metricIcon}><Timer size={21} aria-hidden /></span>
          <div>
            <h3 id="lcp-heading">Nội dung lớn nhất xuất hiện sau bao lâu?</h3>
            <p>LCP · Thanh càng ngắn càng nhanh</p>
          </div>
        </div>
        <ul className={styles.bars} aria-label="So sánh LCP theo route">
          {rows.map(({ name, icon: Icon, color, lcp }) => <li key={name} className={`${styles.barRow} ${color}`}>
            <span className={styles.route}><Icon size={16} aria-hidden />{name}</span>
            <span className={styles.track} aria-hidden="true">
              {lcp !== undefined && <span className={styles.bar} style={{ width: `${lcp / scale * 100}%` }} />}
            </span>
            <span className={styles.barValue}>{lcp === undefined ? '—' : <>{integer.format(lcp)} <small>ms</small></>}</span>
          </li>)}
        </ul>
        {winner && <div className={`${styles.insight} ${winner.color}`}>
          <strong>{winner.name} có LCP thấp nhất trong lần đo này</strong>
          <span>Sớm hơn {integer.format(max - min)} ms so với route có LCP cao nhất.</span>
        </div>}
        <p className={styles.note}>LCP có thể đo tiêu đề trang. Muốn biết lúc Pokédex xuất hiện, hãy xem thêm Network và thời điểm các thẻ hiện lên.</p>
      </section>
      <section className={`panel ${styles.overview}`} aria-labelledby="score-heading">
        <div className={styles.metricHeading}>
          <span className={styles.metricIcon}><Activity size={21} aria-hidden /></span>
          <div><h3 id="score-heading">Tổng quan tải trang</h3><p>Điểm Lighthouse và số request</p></div>
        </div>
        <table className={styles.summary}>
          <thead><tr><th scope="col">Route</th><th scope="col">Điểm / 100</th><th scope="col">Request</th></tr></thead>
          <tbody>{rows.map(({ key, name, color }) => <tr key={key} className={color}>
            <th scope="row"><span className={styles.routeName}>{name}</span></th>
            <td className={styles.score}>{format(medians[key].score)}</td>
            <td>{format(medians[key].requests, integer)}</td>
          </tr>)}</tbody>
        </table>
        <p className={styles.note}>Điểm càng cao càng tốt. Số request cho biết trình duyệt đã gửi bao nhiêu yêu cầu khi tải trang.</p>
      </section>
    </div>
    <details className={styles.details}>
      <summary>Xem đầy đủ {metrics.length} chỉ số <ChevronDown size={17} aria-hidden /></summary>
      <div className={styles.tableWrap} tabIndex={0} role="region" aria-label="Bảng chỉ số chi tiết">
        <table className={styles.fullTable}>
          <thead><tr><th scope="col">Chỉ số</th>{routes.map(({ name }) => <th key={name} scope="col">{name}</th>)}</tr></thead>
          <tbody>{metrics.map(({ key, label, unit }) => <tr key={key}>
            <th scope="row">{label}{unit ? ` (${unit})` : ''}</th>
            {routes.map((route) => <td key={route.key}>{format(medians[route.key][key])}</td>)}
          </tr>)}</tbody>
        </table>
      </div>
      <p className={styles.note}>TBT là thời gian main thread bị chặn lúc tải trang. Dùng Chrome DevTools Performance để quan sát INP trong phiên tương tác.</p>
    </details>
  </>
}
