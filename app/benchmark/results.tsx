import Link from 'next/link'
import { Activity, AppWindow, ArrowRight, ChevronDown, Cpu, Database, Image as ImageIcon, Server, Timer } from 'lucide-react'
import metrics from '../../lib/benchmark-metrics.json'
import styles from './results.module.css'

const routes = [
  { key: 'csr', name: 'CSR', icon: AppWindow, color: styles.csr },
  { key: 'ssr', name: 'SSR', icon: Server, color: styles.ssr },
  { key: 'ssg', name: 'SSG', icon: Database, color: styles.ssg },
] as const

const comparisonKeys = ['score', 'lcp', 'cls', 'tbt', 'fcp', 'jsBytes'] as const

export type BenchmarkMedians = {
  csr: Record<string, number>
  ssr: Record<string, number>
  ssg: Record<string, number>
  'js-before'?: Record<string, number>
  'js-after'?: Record<string, number>
  'banner-before'?: Record<string, number>
  'banner-after'?: Record<string, number>
}

const integer = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 })
const decimal = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 3 })

function format(value: number | undefined, formatter = decimal) {
  return value === undefined ? '—' : formatter.format(value)
}

function formatMetricValue(key: string, value: number | undefined) {
  if (value === undefined) return '—'
  if (key === 'jsBytes') return `${integer.format(value)} B (${decimal.format(Math.round(value / 102.4) / 10)} kB)`
  if (key === 'score' || key === 'requests') return integer.format(value)
  if (key === 'cls') return decimal.format(value)
  return `${integer.format(Math.round(value))} ms`
}

function formatDelta(key: string, before: number | undefined, after: number | undefined) {
  if (before === undefined || after === undefined) return { text: '—', improved: false }
  const diff = after - before
  if (Math.abs(diff) < 0.0005) return { text: 'Không đổi', improved: false }
  const higherIsBetter = key === 'score'
  const improved = higherIsBetter ? diff > 0 : diff < 0
  const sign = diff > 0 ? '+' : ''
  const pct = before > 0 ? Math.round((diff / before) * 100) : 0

  if (key === 'score') {
    return { text: `${sign}${decimal.format(diff)} điểm`, improved }
  }
  if (key === 'cls') {
    return { text: `${sign}${decimal.format(diff)}`, improved }
  }
  if (key === 'jsBytes') {
    const kbDiff = Math.round((diff / 1024) * 10) / 10
    return { text: `${sign}${decimal.format(kbDiff)} kB (${pct > 0 ? '+' : ''}${pct}%)`, improved }
  }
  return { text: `${sign}${integer.format(Math.round(diff))} ms (${pct > 0 ? '+' : ''}${pct}%)`, improved }
}

function OptimizationPanel({
  title,
  subtitle,
  icon: Icon,
  before,
  after,
  beforeHref,
  afterHref,
}: {
  title: string
  subtitle: string
  icon: typeof Cpu
  before: Record<string, number>
  after: Record<string, number>
  beforeHref: string
  afterHref: string
}) {
  const compareMetrics = comparisonKeys
    .map((key) => metrics.find((m) => m.key === key))
    .filter((item): item is (typeof metrics)[number] => item !== undefined)

  return (
    <section className={`panel ${styles.compareCard}`}>
      <div className={styles.metricHeading}>
        <span className={styles.metricIcon}><Icon size={20} aria-hidden /></span>
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.compareTable}>
          <thead>
            <tr>
              <th scope="col">Chỉ số</th>
              <th scope="col">Trước (Before)</th>
              <th scope="col">Sau (After)</th>
              <th scope="col">Thay đổi</th>
            </tr>
          </thead>
          <tbody>
            {compareMetrics.map(({ key, label }) => {
              const delta = formatDelta(key, before[key], after[key])
              return (
                <tr key={key}>
                  <th scope="row">{label}</th>
                  <td>{formatMetricValue(key, before[key])}</td>
                  <td>{formatMetricValue(key, after[key])}</td>
                  <td>
                    <span className={delta.improved ? styles.deltaGood : styles.deltaNeutral}>
                      {delta.text}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className={styles.pairLinks}>
        <Link href={beforeHref} prefetch={false} className="button">Mở bản Trước</Link>
        <ArrowRight size={15} aria-hidden />
        <Link href={afterHref} prefetch={false} className="button primary">Mở bản Sau tối ưu</Link>
      </div>
    </section>
  )
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
  const hasJsPair = medians['js-before'] && medians['js-after']
  const hasBannerPair = medians['banner-before'] && medians['banner-after']

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

    {(hasJsPair || hasBannerPair) && (
      <section className="section" id="before-after" aria-labelledby="before-after-heading">
        <div className="section-heading">
          <div>
            <h2 id="before-after-heading">Trước và Sau khi tối ưu code (Lighthouse)</h2>
            <p>So sánh 6 chỉ số Performance, LCP, CLS, TBT, FCP và dung lượng JS trên cùng điều kiện đo.</p>
          </div>
        </div>
        <div className={styles.compareGrid}>
          {hasJsPair && (
            <OptimizationPanel
              title="1. Tối ưu tải JS (dynamic() & Server Component)"
              subtitle="Trước: import đồng bộ 151 loài trên Client · Sau: tách Server Component + next/dynamic()"
              icon={Cpu}
              before={medians['js-before']!}
              after={medians['js-after']!}
              beforeHref="/labs/js-before"
              afterHref="/labs/js-after"
            />
          )}
          {hasBannerPair && (
            <OptimizationPanel
              title="2. Ảnh banner tải sớm (priority + WebP)"
              subtitle="Trước: tải bình thường PNG chưa priority · Sau: WebP + priority (<link rel='preload'>)"
              icon={ImageIcon}
              before={medians['banner-before']!}
              after={medians['banner-after']!}
              beforeHref="/labs/banner-before"
              afterHref="/labs/banner-after"
            />
          )}
        </div>
      </section>
    )}

    <details className={styles.details}>
      <summary>Xem đầy đủ {metrics.length} chỉ số CSR / SSR / SSG <ChevronDown size={17} aria-hidden /></summary>
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
