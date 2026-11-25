import { execFile } from 'node:child_process'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'
import { localTestOrigin } from '../../../lib/local-test-origin'
import { testCaseResultSchema, testReportSchema } from '../../../lib/test-report'
import { testGroups } from '../../../lib/test-scenarios'

export const runtime = 'nodejs'

const run = promisify(execFile)
const cases = testGroups.flatMap((group) => group.cases)
let running = false

export async function POST(request: Request) {
  if (!localTestOrigin(request)) {
    return Response.json({ error: 'Mở Pokédex Lab qua localhost hoặc 127.0.0.1 để chạy test.' }, { status: 403 })
  }

  const id = new URL(request.url).searchParams.get('case')
  const scenario = cases.find((item) => item.id === id)
  if (!scenario) return Response.json({ error: 'Không tìm thấy test case.' }, { status: 400 })
  if (running) return Response.json({ error: 'Một test đang chạy. Hãy đợi test đó kết thúc.' }, { status: 409 })

  running = true
  let directory: string | undefined
  try {
    directory = await mkdtemp(join(tmpdir(), 'pokedex-test-'))
    const reportFile = join(directory, 'result.json')
    const cli = join(process.cwd(), 'node_modules', 'vitest', 'vitest.mjs')
    const pattern = scenario.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    try {
      await run(process.execPath, [
        cli, 'run', scenario.file, '--testNamePattern', `${pattern}$`, '--reporter=json', `--outputFile=${reportFile}`,
      ], {
        cwd: process.cwd(),
        env: { ...process.env, NODE_ENV: 'test' },
        timeout: 30_000,
        maxBuffer: 256 * 1024,
      })
    } catch {
      // Vitest dùng mã thoát khác 0 cho assertion thất bại. Kết quả được đọc từ báo cáo.
    }
    const report = testReportSchema.parse(JSON.parse(await readFile(reportFile, 'utf8')))
    const result = report.testResults.flatMap((suite) => suite.assertionResults).find((test) => test.title === scenario.title)
    if (!result) throw new Error('Vitest không thực thi case đã chọn.')
    const failureMessages = result.failureMessages.map((message) => message.replaceAll(process.cwd() + '/', ''))
    const location = failureMessages.map((message) => message.match(/tests\/[\w.-]+\.tsx?:\d+:\d+/)?.[0]).find(Boolean)
    return Response.json(testCaseResultSchema.parse({ ...result, file: scenario.file, location, failureMessages }))
  } catch {
    return Response.json({ error: 'Không đọc được kết quả Vitest cho case này. Hãy kiểm tra dependency rồi thử lại.' }, { status: 500 })
  } finally {
    running = false
    if (directory) await rm(directory, { recursive: true, force: true }).catch(() => undefined)
  }
}
