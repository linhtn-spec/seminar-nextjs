'use client'

import { CheckCircle2, ListVideo, LoaderCircle, Play, XCircle } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { testCaseResultSchema, type TestCaseResult } from '../../lib/test-report'
import { readScreenshots } from './screenshot-stream'
import { TestPlayback } from './test-playback'
import { testGroups } from '../../lib/test-scenarios'
import styles from './test-cases.module.css'

const allCases = testGroups.flatMap(({ cases }) => cases)
type Scenario = (typeof allCases)[number]
type RunningCase = { id: string; phase: 'capture' | 'vitest' }

type Run = { result: TestCaseResult } | { error: string }

export function TestCases() {
  const active = useRef<AbortController | null>(null)
  const playbackRow = useRef<HTMLLIElement>(null)
  const [preview, setPreview] = useState<{ id: string; step: number } | null>(null)
  const [batch, setBatch] = useState(false)
  const [running, setRunning] = useState<RunningCase | null>(null)
  const [screenshots, setScreenshots] = useState<Partial<Record<string, readonly string[]>>>({})
  const [captureErrors, setCaptureErrors] = useState<Partial<Record<string, string>>>({})
  const [runs, setRuns] = useState<Partial<Record<string, Run>>>({})

  const runningId = running?.id

  useEffect(() => () => active.current?.abort(), [])
  useEffect(() => {
    if (runningId) playbackRow.current?.scrollIntoView({ block: 'nearest' })
  }, [runningId])

  async function run(scenarios: readonly Scenario[], animate = true) {
    if (active.current) return
    const controller = new AbortController()
    active.current = controller
    const multiple = scenarios.length > 1
    if (multiple) {
      setBatch(true)
      setRuns({})
      setScreenshots({})
      setCaptureErrors({})
    }

    try {
      for (const { id, steps } of scenarios) {
        setPreview({ id, step: animate ? 0 : steps.length - 1 })
        setRunning({ id, phase: 'capture' })
        setScreenshots((current) => ({ ...current, [id]: [] }))
        setCaptureErrors((current) => ({ ...current, [id]: undefined }))

        let captured = 0
        try {
          const response = await fetch(`/api/tests/screenshots?case=${encodeURIComponent(id)}`, {
            method: 'POST', signal: controller.signal,
          })
          for await (const event of readScreenshots(response)) {
            if (controller.signal.aborted) return
            if (event.type === 'error') throw new Error(event.message)
            if (event.step !== captured || captured >= steps.length) throw new Error('Thứ tự ảnh từ Chrome không hợp lệ.')
            captured++
            setScreenshots((current) => ({ ...current, [id]: [...(current[id] ?? []), event.image] }))
            if (animate) {
              setPreview({ id, step: event.step })
              await new Promise<void>((resolve) => window.setTimeout(resolve, multiple ? 320 : 700))
            }
          }
          if (captured !== steps.length) throw new Error(`Chrome chụp được ${captured}/${steps.length} bước.`)
        } catch (cause) {
          if (controller.signal.aborted) return
          setCaptureErrors((current) => ({
            ...current, [id]: cause instanceof Error ? cause.message : 'Không chụp được ảnh.',
          }))
        }
        if (controller.signal.aborted) return

        setRunning({ id, phase: 'vitest' })
        try {
          const response = await fetch(`/api/tests?case=${encodeURIComponent(id)}`, {
            method: 'POST', signal: controller.signal,
          })
          const body = await response.json()
          if (!response.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'Không chạy được test.')
          const result = testCaseResultSchema.parse(body)
          setRuns((current) => ({ ...current, [id]: { result } }))
        } catch (cause) {
          if (controller.signal.aborted) return
          const error = cause instanceof Error ? cause.message : 'Không chạy được test.'
          setRuns((current) => ({ ...current, [id]: { error } }))
        }
      }
    } finally {
      active.current = null
      if (!controller.signal.aborted) {
        setBatch(false)
        setRunning(null)
      }
    }
  }

  const outcomes = Object.values(runs)
  const passed = outcomes.filter((outcome) => outcome && 'result' in outcome && outcome.result.status === 'passed').length
  const failed = outcomes.filter((outcome) => outcome && 'result' in outcome && outcome.result.status === 'failed').length
  const errors = outcomes.length - passed - failed
  const busy = batch || running !== null

  return <>
    <div className={styles.toolbar}>
      <button className="button primary" type="button" disabled={busy} onClick={() => run(allCases)}>
        {batch ? <LoaderCircle size={16} className="motion-safe:animate-spin" aria-hidden /> : <ListVideo size={16} aria-hidden />}
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
          const caseRunning = running?.id === scenario.id
          const shownStep = preview?.id === scenario.id ? preview.step : undefined
          return <li key={scenario.id} className={styles.case} ref={caseRunning ? playbackRow : undefined}>
            <div className={styles.row}>
              <strong>{scenario.title}</strong>
              <span className={styles.status} role="status">
                {caseRunning ? running.phase === 'capture' ? 'Chrome đang chụp…' : 'Đang chạy Vitest…' : result?.status === 'passed' ? <span className="type-tag tone-leaf"><CheckCircle2 size={14} /> Đạt</span>
                  : result?.status === 'failed' ? <span className="type-tag tone-fire"><XCircle size={14} /> Thất bại</span>
                  : error ? <span className="type-tag tone-fire">Lỗi khi chạy</span> : batch ? 'Đang chờ' : 'Chưa chạy'}
                {!caseRunning && result?.duration !== undefined && <small>{Math.round(result.duration)} ms</small>}
              </span>
              <button className="button" type="button" disabled={busy} onClick={() => run([scenario])} aria-label={`Chạy test ${scenario.title}`}>
                {caseRunning ? <LoaderCircle className="motion-safe:animate-spin" size={15} /> : <Play size={15} />} Chạy
              </button>
            </div>
            <button className={styles.stepsToggle} type="button" disabled={busy} aria-expanded={shownStep !== undefined}
              aria-controls={shownStep !== undefined ? `steps-${scenario.id}` : undefined}
              onClick={() => setPreview(shownStep === undefined ? { id: scenario.id, step: 0 } : null)}>
              {shownStep === undefined ? `Các bước chạy (${scenario.steps.length})` : 'Thu gọn mô phỏng'}
            </button>
            {shownStep !== undefined && <TestPlayback id={scenario.id} file={scenario.file} steps={scenario.steps}
              step={shownStep} screenshot={screenshots[scenario.id]?.[shownStep]} captureError={captureErrors[scenario.id]}
              capturing={caseRunning && running.phase === 'capture'} blocked={busy} onStep={(step) => setPreview({ id: scenario.id, step })}
              onRun={() => run([scenario], false)} />}
            {!caseRunning && error && <p className={styles.failure} role="alert">{error}</p>}
            {!caseRunning && result?.status === 'failed' && <div className={styles.failure}>
              <h3>Chi tiết thất bại</h3>
              <dl>
                <dt>Vị trí kiểm tra</dt><dd><code>{result.location ?? result.file}</code></dd>
                {'expected' in scenario && <><dt>Kỳ vọng</dt><dd>{scenario.expected}</dd></>}
                {'reproduction' in scenario && <>
                  <dt>Nguyên nhân</dt><dd>{scenario.reproduction.cause} <code>{scenario.reproduction.source}</code></dd>
                </>}
                <dt>Lỗi Vitest</dt><dd><pre>{result.failureMessages.join('\n') || 'Vitest không ghi thông báo cho lỗi này.'}</pre></dd>
              </dl>
            </div>}
          </li>
        })}
      </ul>
    </section>)}
  </>
}
