'use client'

import { CheckCircle2, ListChecks, LoaderCircle, Play, XCircle } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { testCaseResultSchema, type TestCaseResult } from '../../lib/test-report'
import { testGroups } from '../../lib/test-scenarios'
import styles from './test-cases.module.css'

const allCases = testGroups.flatMap(({ cases }) => cases)
type Scenario = (typeof allCases)[number]
type Run = { result: TestCaseResult } | { error: string }

export function TestCases() {
  const active = useRef<AbortController | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [batch, setBatch] = useState(false)
  const [runningId, setRunningId] = useState<string | null>(null)
  const [runs, setRuns] = useState<Partial<Record<string, Run>>>({})

  useEffect(() => () => active.current?.abort(), [])

  async function run(scenarios: readonly Scenario[]) {
    if (active.current) return
    const controller = new AbortController()
    active.current = controller
    const multiple = scenarios.length > 1
    if (multiple) {
      setBatch(true)
      setRuns({})
    }

    try {
      for (const scenario of scenarios) {
        setExpanded(scenario.id)
        setRunningId(scenario.id)
        try {
          const response = await fetch(`/api/tests?case=${encodeURIComponent(scenario.id)}`, {
            method: 'POST', signal: controller.signal,
          })
          const body = await response.json()
          if (!response.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'Không chạy được test.')
          const result = testCaseResultSchema.parse(body)
          setRuns((current) => ({ ...current, [scenario.id]: { result } }))
        } catch (cause) {
          if (controller.signal.aborted) return
          const error = cause instanceof Error ? cause.message : 'Không chạy được test.'
          setRuns((current) => ({ ...current, [scenario.id]: { error } }))
        }
      }
    } finally {
      active.current = null
      if (!controller.signal.aborted) {
        setBatch(false)
        setRunningId(null)
      }
    }
  }

  const outcomes = Object.values(runs)
  const passed = outcomes.filter((outcome) => outcome && 'result' in outcome && outcome.result.status === 'passed').length
  const failed = outcomes.filter((outcome) => outcome && 'result' in outcome && outcome.result.status === 'failed').length
  const errors = outcomes.length - passed - failed
  const busy = batch || runningId !== null

  return <>
    <div className={styles.toolbar}>
      <button className="button primary" type="button" disabled={busy} onClick={() => run(allCases)}>
        {batch ? <LoaderCircle size={16} className="motion-safe:animate-spin" aria-hidden /> : <ListChecks size={16} aria-hidden />}
        {batch ? 'Đang chạy tất cả test…' : 'Chạy tất cả test'}
      </button>
      <p className="caption" role="status">
        {batch || outcomes.length > 0
          ? `${outcomes.length}/${allCases.length} case đã chạy · ${passed} đạt · ${failed} thất bại${errors ? ` · ${errors} lỗi khi chạy` : ''}`
          : `${allCases.length} test case`}
      </p>
    </div>
    {testGroups.map(({ name, cases }) => <section className={`panel ${styles.group}`} key={name}>
      <h2>{name}</h2>
      <ul className={styles.list}>
        {cases.map((scenario) => {
          const outcome = runs[scenario.id]
          const result = outcome && 'result' in outcome ? outcome.result : undefined
          const error = outcome && 'error' in outcome ? outcome.error : undefined
          const caseRunning = runningId === scenario.id
          const open = expanded === scenario.id
          return <li key={scenario.id} className={styles.case}>
            <div className={styles.row}>
              <strong>{scenario.title}</strong>
              <span className={styles.status} role="status">
                {caseRunning ? 'Đang chạy Vitest…' : result?.status === 'passed' ? <span className="type-tag tone-leaf"><CheckCircle2 size={14} /> Đạt</span>
                  : result?.status === 'failed' ? <span className="type-tag tone-fire"><XCircle size={14} /> Thất bại</span>
                  : error ? <span className="type-tag tone-fire">Lỗi khi chạy</span> : batch ? 'Đang chờ' : 'Chưa chạy'}
                {!caseRunning && result?.duration !== undefined && <small>{Math.round(result.duration)} ms</small>}
              </span>
              <button className="button" type="button" disabled={busy} onClick={() => run([scenario])} aria-label={`Chạy test ${scenario.title}`}>
                {caseRunning ? <LoaderCircle className="motion-safe:animate-spin" size={15} aria-hidden /> : <Play size={15} aria-hidden />} Chạy
              </button>
            </div>
            <button className={styles.stepsToggle} type="button" aria-expanded={open}
              aria-controls={`steps-${scenario.id}`} onClick={() => setExpanded(open ? null : scenario.id)}>
              {open ? 'Thu gọn các bước chạy' : `Các bước chạy (${scenario.steps.length})`}
            </button>
            {open && <div className={styles.steps} id={`steps-${scenario.id}`}>
              <ol>
                {scenario.steps.map((step) => <li key={step}>{step}</li>)}
              </ol>
              <p className="caption">Test trong code: <code>{scenario.file}</code></p>
            </div>}
            {!caseRunning && error && <p className={styles.failure} role="alert">{error}</p>}
            {!caseRunning && result?.status === 'failed' && <div className={styles.failure}>
              <h3>Chi tiết thất bại</h3>
              <dl>
                <dt>Vị trí kiểm tra</dt><dd><code>{result.location ?? result.file}</code></dd>
                <dt>Lỗi Vitest</dt><dd><pre>{result.failureMessages.join('\n') || 'Vitest không ghi thông báo cho lỗi này.'}</pre></dd>
              </dl>
            </div>}
          </li>
        })}
      </ul>
    </section>)}
  </>
}
