import { ChevronLeft, ChevronRight, Play } from 'lucide-react'
import Image from 'next/image'
import styles from './test-cases.module.css'

export function TestPlayback({ id, steps, file, step, screenshot, captureError, capturing, blocked, onStep, onRun }: {
  id: string
  steps: readonly string[]
  file: string
  step: number
  screenshot?: string
  captureError?: string
  capturing: boolean
  blocked: boolean
  onStep: (index: number) => void
  onRun: () => void
}) {
  const last = step === steps.length - 1

  return <div className={styles.playback} id={`steps-${id}`}>
    <div className={styles.playbackHeader}>
      <div>
        <span className={styles.stepLabel}>Mô phỏng · Bước {step + 1}/{steps.length}</span>
        <p className={styles.currentStep} aria-live="polite">{steps[step]}</p>
      </div>
      <div className="actions">
        <button className="button" type="button" disabled={blocked || step === 0} onClick={() => onStep(step - 1)}>
          <ChevronLeft size={16} aria-hidden /> Bước trước
        </button>
        {last
          ? <button className="button primary" type="button" disabled={blocked} onClick={onRun}><Play size={15} aria-hidden /> Chạy Vitest</button>
          : <button className="button primary" type="button" disabled={blocked} onClick={() => onStep(step + 1)}>Bước tiếp <ChevronRight size={16} aria-hidden /></button>}
      </div>
    </div>
    <div className={styles.playbackGrid}>
      <ol className={styles.timeline} aria-label="Trình tự các bước">
        {steps.map((text, index) => <li key={text}>
          <button type="button" aria-current={index === step ? 'step' : undefined} disabled={blocked} onClick={() => onStep(index)}>
            <span aria-hidden="true">{index + 1}</span><span>{text}</span>
          </button>
        </li>)}
      </ol>
      {screenshot ? <figure className={styles.screenshot}>
        <a href={screenshot} download={`${id}-buoc-${step + 1}.webp`} aria-label="Tải ảnh kích thước đầy đủ">
          <Image src={screenshot} alt={`Ảnh Chrome bước ${step + 1}. ${steps[step]}`} fill unoptimized loading="eager" sizes="(max-width: 800px) 100vw, 700px" />
        </a>
        <figcaption>Ảnh Chrome từ lượt chạy gần nhất</figcaption>
      </figure> : <div className={`state ${styles.screenshotPlaceholder}`}>
        {capturing ? 'Chrome đang chụp bước này…' : 'Bấm Chạy để chụp ảnh cho lượt kiểm thử mới.'}
      </div>}
    </div>
    {captureError && <p className={styles.captureError} role="status">{captureError}</p>}
    <p className="caption">Chrome chụp các thao tác trên giao diện. Vitest kiểm tra <code>{file}</code>.</p>
  </div>
}
