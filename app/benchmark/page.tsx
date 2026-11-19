import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ChevronDown } from 'lucide-react'
import { z } from 'zod'
import { PageHeading } from '../../components/page-heading'
import { BenchmarkResults } from './results'
import styles from './results.module.css'

export const dynamic = 'force-dynamic'

const sample = z.record(z.string(), z.number())
const reportSchema = z.object({
  measuredAt: z.iso.datetime(),
  runs: z.number().int().positive(),
  medians: z.object({ csr: sample, ssr: sample, ssg: sample }),
  conditions: z.object({
    lighthouse: z.string(), chrome: z.string(), node: z.string(),
    cache: z.string(), throttlingMethod: z.string(), os: z.string(), cpu: z.string().optional(),
  }),
})

async function loadReport() {
  try {
    const raw = await readFile(join(process.cwd(), 'reports', 'benchmark.json'), 'utf8')
    return reportSchema.safeParse(JSON.parse(raw)).data
  } catch {
    return undefined
  }
}

export default async function Page() {
  const report = await loadReport()
  const date = new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Ho_Chi_Minh' })

  return <>
    <PageHeading category="Hiệu năng" title="Benchmark rendering" image="/benchmark-lab.webp">
      So sánh các lần tải trang CSR, SSR và SSG qua cùng bộ dữ liệu Pokédex ở production.
    </PageHeading>
    <section className="section" aria-labelledby="results-title">
      <div className="section-heading"><h2 id="results-title">Kết quả đo</h2></div>
      {report ? <BenchmarkResults
        medians={report.medians}
        date={date.format(new Date(report.measuredAt))}
        runs={report.runs}
      /> : <div className="state">Chưa đọc được kết quả. Chạy <code>pnpm benchmark</code> để tạo báo cáo.</div>}
    </section>
    <details className={styles.details}>
      <summary>Cách đo và điều kiện chạy <ChevronDown size={17} aria-hidden /></summary>
      <div>
        <p>Script build project, mở server local và đo mỗi route ít nhất ba lần. Mỗi lượt dùng Chrome mới với cấu hình mobile và throttling mô phỏng. Báo cáo lấy trung vị.</p>
        {report && <p className="caption">Lighthouse {report.conditions.lighthouse} · {report.conditions.chrome} · {report.conditions.cache} Throttling: {report.conditions.throttlingMethod}.</p>}
        <pre className="command">pnpm benchmark</pre>
        <p className="caption">Báo cáo được lưu tại <code>reports/benchmark.json</code> và <code>reports/benchmark.md</code>.</p>
      </div>
    </details>
  </>
}
