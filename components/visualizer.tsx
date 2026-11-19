'use client'

import { useEffect, useState, type CSSProperties } from 'react'
import { AppWindow, Hammer, Pause, Play, RotateCcw, Server, SkipForward } from 'lucide-react'
import { strategies, strategyNames, type Strategy } from '../lib/rendering'

const actors = [
  { id: 'browser', label: 'Browser', detail: 'Hiển thị cho người dùng', icon: AppWindow },
  { id: 'server', label: 'Server', detail: 'API và HTML', icon: Server },
  { id: 'build', label: 'Build', detail: 'Tạo HTML trước', icon: Hammer },
] as const
const positions = { browser: '16.666%', server: '50%', build: '83.333%' }

export function Visualizer() {
  const [strategy, setStrategy] = useState<Strategy>('CSR')
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const info = strategies[strategy]
  const step = index === 0 ? undefined : info.steps[index - 1]
  const last = info.steps.length

  useEffect(() => {
    if (!playing) return
    const timer = window.setTimeout(() => {
      const next = Math.min(index + 1, last)
      setIndex(next)
      if (next === last) setPlaying(false)
    }, 1400)
    return () => window.clearTimeout(timer)
  }, [playing, index, last])

  return <>
    <div className="segmented" role="group" aria-label="Chọn chiến lược rendering">
      {strategyNames.map((name) => <button key={name} aria-pressed={strategy === name} onClick={() => {
        setStrategy(name)
        setIndex(0)
        setPlaying(false)
      }}>{name}</button>)}
    </div>
    <div className="visualizer-layout">
      <section className="panel simulation" aria-labelledby="simulation-heading">
        <div className="section-heading"><div><h2 id="simulation-heading">{info.title}</h2><p>{info.flow}</p></div></div>
        <div className="actors">
          {actors.map(({ id, label, detail, icon: Icon }) => {
            const active = step?.from === id || step?.to === id
            return <div className={`actor ${active ? 'actor-active' : ''}`} key={id}>
              <Icon size={25} aria-hidden /><strong>{label}</strong><span>{detail}</span>
            </div>
          })}
        </div>
        <div className="signal-track" aria-hidden>
          {step && <i key={`${strategy}-${index}`} style={{ '--signal-from': positions[step.from], '--signal-to': positions[step.to] } as CSSProperties} />}
        </div>
        <div className="step-message" aria-live="polite">
          <span className="caption">{index === 0 ? 'Sẵn sàng' : `Bước ${index}/${last}`}</span>
          <h3>{step?.title ?? 'Bắt đầu mô phỏng'}</h3>
          <p>{step?.detail ?? 'Chọn Phát để chạy tự động hoặc chọn Bước tiếp để xem từng bước.'}</p>
        </div>
        <div className="actions">
          <button className="button primary" disabled={playing} onClick={() => {
            if (index === last) setIndex(0)
            setPlaying(true)
          }}><Play size={16} /> Phát</button>
          <button className="button" disabled={!playing} onClick={() => setPlaying(false)}><Pause size={16} /> Tạm dừng</button>
          <button className="button" disabled={index === last} onClick={() => {
            setPlaying(false)
            setIndex(index + 1)
          }}><SkipForward size={16} /> Bước tiếp</button>
          <button className="button" onClick={() => {
            setPlaying(false)
            setIndex(0)
          }}><RotateCcw size={16} /> Đặt lại</button>
        </div>
      </section>
      <aside className="panel sequence">
        <h2>Trình tự xử lý</h2>
        <ol>
          {info.steps.map((item, stepIndex) => <li key={item.title} aria-current={index === stepIndex + 1 ? 'step' : undefined}>
            <span className="step-number">{stepIndex + 1}</span><span>{item.title}</span>
          </li>)}
        </ol>
      </aside>
    </div>
    <p className="caption simulation-caption">Thứ tự và thời gian trong mô phỏng dùng để minh họa. Xem Benchmark để đọc số đo thực tế.</p>
  </>
}
