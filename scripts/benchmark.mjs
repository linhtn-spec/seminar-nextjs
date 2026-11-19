import { spawn } from 'node:child_process'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { availableParallelism, cpus, platform, release, arch } from 'node:os'
import { setTimeout as delay } from 'node:timers/promises'
import lighthouse from 'lighthouse'
import { launch } from 'chrome-launcher'

const routes = ['csr', 'ssr', 'ssg']
const runs = Number(process.env.BENCH_RUNS ?? 3)
const port = Number(process.env.BENCH_PORT ?? 4173)
if (!Number.isInteger(runs) || runs < 3) throw new Error('BENCH_RUNS phải là số nguyên từ 3 trở lên.')
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('BENCH_PORT phải là cổng TCP hợp lệ.')

const origin = `http://127.0.0.1:${port}`
const metrics = JSON.parse(await readFile(new URL('../lib/benchmark-metrics.json', import.meta.url), 'utf8'))
const cases = Object.fromEntries(routes.map((route) => [route, []]))
const chromeFlags = ['--headless', '--disable-dev-shm-usage']
if (process.env.BENCH_CHROME_NO_SANDBOX === '1') chromeFlags.push('--no-sandbox')
const nextCli = createRequire(import.meta.url).resolve('next/dist/bin/next')

function command(...args) {
  return spawn('pnpm', args, { stdio: 'inherit' })
}

function completion(process) {
  return new Promise((resolve, reject) => {
    process.once('error', reject)
    process.once('close', (code, signal) => code === 0 ? resolve() : reject(new Error(`Tiến trình kết thúc: ${code ?? signal}`)))
  })
}

async function waitForServer(server) {
  for (let index = 0; index < 120; index++) {
    if (server.exitCode !== null || server.signalCode !== null) throw new Error('Next.js đã dừng trước khi sẵn sàng.')
    try {
      const response = await fetch(origin + '/ssg', { signal: AbortSignal.timeout(1500) })
      await response.body?.cancel()
      if (response.ok) return
    } catch { /* Chờ server lắng nghe cổng. */ }
    await delay(250)
  }
  throw new Error('Không kết nối được Next.js để benchmark.')
}

async function verifyRendering() {
  const api = await fetch(origin + '/api/pokemon')
  if (!api.ok) throw new Error('API Pokédex không sẵn sàng.')
  const expected = (await api.json()).map(({ id }) => String(id))
  for (const route of routes) {
    const response = await fetch(origin + '/' + route)
    if (!response.ok) throw new Error(`Route /${route} trả HTTP ${response.status}.`)
    const html = await response.text()
    const actual = [...html.matchAll(/data-pokemon-id="(\d+)"/g)].map(([, id]) => id)
    if (route === 'csr' ? actual.length > 0 : actual.join(',') !== expected.join(',')) {
      throw new Error(`HTML ban đầu của /${route} khác với dữ liệu và chiến lược dự kiến.`)
    }
  }
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2
}

function extract(lhr) {
  if (lhr.runtimeError) throw new Error(lhr.runtimeError.message)
  const audits = lhr.audits
  const requests = audits['network-requests']?.details?.items
  const document = requests?.find((request) => request.resourceType === 'Document' && request.url === lhr.finalDisplayedUrl)
  if (!requests || !document) throw new Error('Lighthouse thiếu dữ liệu network của tài liệu chính.')
  const performance = lhr.categories.performance?.score
  const sample = {
    score: performance == null ? null : performance * 100,
    fcp: audits['first-contentful-paint']?.numericValue,
    lcp: audits['largest-contentful-paint']?.numericValue,
    cls: audits['cumulative-layout-shift']?.numericValue,
    tbt: audits['total-blocking-time']?.numericValue,
    jsBytes: requests.filter((request) => request.resourceType === 'Script')
      .reduce((sum, request) => sum + (request.transferSize ?? 0), 0),
    htmlBytes: document.transferSize,
    requests: requests.length,
  }
  if (!Object.values(sample).every(Number.isFinite)) throw new Error('Lighthouse thiếu một hoặc nhiều chỉ số.')
  return sample
}

function reportMarkdown(data) {
  return [
    '# Benchmark Pokédex',
    '',
    `Đo lúc ${data.measuredAt} (UTC), ${runs} lần mỗi route. Bảng dùng median.`,
    `${data.conditions.chrome}, Lighthouse ${data.conditions.lighthouse}, Node ${data.conditions.node}.`,
    `${data.conditions.os} · ${data.conditions.cpu} · ${data.conditions.cores} luồng CPU khả dụng.`,
    'Mobile preset, throttling mô phỏng của Lighthouse. Mỗi lượt dùng Chrome headless mới và cache trình duyệt lạnh. Server production dùng chung trên loopback và được khởi động trước khi đo.',
    `Throttling: RTT ${data.conditions.throttling.rttMs} ms, thông lượng ${data.conditions.throttling.throughputKbps} Kbit/s, CPU chậm hơn ${data.conditions.throttling.cpuSlowdownMultiplier} lần.`,
    'HTML và JavaScript dùng transferSize của Lighthouse. Số request là số dòng trong audit network-requests. INP cần đo từ phiên tương tác.',
    '',
    '| Chỉ số | CSR | SSR | SSG |',
    '| --- | ---: | ---: | ---: |',
    ...metrics.map(({ key, label, unit }) => `| ${label}${unit ? ` (${unit})` : ''} | ${routes.map((route) => Number(data.medians[route][key].toFixed(3))).join(' | ')} |`),
    '',
    'Số đo phản ánh bản build và điều kiện ghi ở trên. Các route có đường tải dữ liệu và phạm vi JavaScript khác nhau.',
    '',
  ].join('\n')
}

await completion(command('run', 'build'))
const server = spawn(process.execPath, [nextCli, 'start', '--hostname', '127.0.0.1', '--port', String(port)], { stdio: 'inherit' })
try {
  await waitForServer(server)
  await verifyRendering()
  let environment
  let chromeVersion
  for (let round = 0; round < runs; round++) {
    const order = [...routes.slice(round % routes.length), ...routes.slice(0, round % routes.length)]
    for (const route of order) {
      console.log(`Đo /${route} · lượt ${round + 1}/${runs}`)
      const chrome = await launch({ chromeFlags })
      try {
        if (!chromeVersion) {
          const version = await fetch(`http://127.0.0.1:${chrome.port}/json/version`)
          if (!version.ok) throw new Error('Không đọc được phiên bản Chrome.')
          chromeVersion = (await version.json()).Browser
        }
        const result = await lighthouse(origin + '/' + route, { port: chrome.port, logLevel: 'error', onlyCategories: ['performance'] })
        if (!result) throw new Error('Lighthouse không trả kết quả.')
        const { lhr } = result
        cases[route].push(extract(lhr))
        environment ??= lhr
      } finally {
        await chrome.kill()
      }
    }
  }

  const medians = Object.fromEntries(routes.map((route) => [route, Object.fromEntries(
    metrics.map(({ key }) => [key, median(cases[route].map((sample) => sample[key]))]),
  )]))
  const data = {
    measuredAt: new Date().toISOString(), origin, runs, medians, samples: cases,
    conditions: {
      mode: 'next build + next start',
      node: process.version,
      chrome: chromeVersion,
      lighthouse: environment.lighthouseVersion,
      os: `${platform()} ${release()} ${arch()}`,
      cpu: cpus()[0]?.model, cores: availableParallelism(),
      cache: 'Cache trình duyệt lạnh (Chrome mới mỗi lượt); server dùng chung đã khởi động.',
      throttlingMethod: environment.configSettings.throttlingMethod,
      throttling: environment.configSettings.throttling,
      screenEmulation: environment.configSettings.screenEmulation,
      chromeFlags,
    },
  }
  await mkdir('reports', { recursive: true })
  for (const [file, contents] of [
    ['benchmark.json', JSON.stringify(data, null, 2) + '\n'],
    ['benchmark.md', reportMarkdown(data)],
  ]) {
    await writeFile(`reports/${file}.tmp`, contents)
    await rename(`reports/${file}.tmp`, `reports/${file}`)
  }
  console.log('Đã ghi reports/benchmark.json và reports/benchmark.md')
} finally {
  server.kill()
}
