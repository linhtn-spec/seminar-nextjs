'use client'

import dynamic from 'next/dynamic'
import { useCallback, useEffect, useRef, useState, memo } from 'react'
import { ChartNoAxesColumnIncreasing, Gauge, Package, Plus } from 'lucide-react'

const HabitatChart = dynamic(() => import('./habitat-chart'), {
  ssr: false,
  loading: () => <p role="status" className="state">Đang tải chunk JavaScript…</p>,
})

function Population({ region, onCommit }: { region: number; onCommit: () => void }) {
  useEffect(onCommit)
  let score = 0
  for (let index = 0; index < 170_000; index++) score += Math.abs(Math.sin(index / 600 + region))
  return <p className="caption">Chỉ số giả lập · {Math.round(score).toLocaleString('vi-VN')}</p>
}

const MemoPopulation = memo(Population)

export function PerformanceExperiments() {
  const [chart, setChart] = useState(false)
  const [region, setRegion] = useState(1)
  const [parent, setParent] = useState(0)
  const regularOutput = useRef<HTMLOutputElement>(null)
  const memoOutput = useRef<HTMLOutputElement>(null)
  const regularCount = useRef(0)
  const memoCount = useRef(0)
  const onRegular = useCallback(() => {
    regularCount.current++
    if (regularOutput.current) regularOutput.current.value = String(regularCount.current)
  }, [])
  const onMemo = useCallback(() => {
    memoCount.current++
    if (memoOutput.current) memoOutput.current.value = String(memoCount.current)
  }, [])

  return <div className="detail-grid lab-experiments">
    <section className="panel">
      <div className="lab-heading"><span className="strategy-icon tone-water"><Package size={20} aria-hidden /></span><div><h2>Lazy loading</h2><p>Biểu đồ được tải khi nào?</p></div></div>
      <div className="lab-chart-box">
        {chart ? <HabitatChart /> : <div className="state"><ChartNoAxesColumnIncreasing size={27} aria-hidden /><p>Biểu đồ đang ẩn</p></div>}
      </div>
      <button className="button primary" aria-expanded={chart} onClick={() => setChart(!chart)}>{chart ? 'Ẩn biểu đồ' : 'Tải biểu đồ'}</button>
      <p className="caption">Mở Network, lọc JS rồi bấm tải biểu đồ. Quan sát chunk xuất hiện ở lần mở đầu tiên.</p>
    </section>
    <section className="panel">
      <div className="lab-heading"><span className="strategy-icon tone-leaf"><Gauge size={20} aria-hidden /></span><div><h2>Memoization</h2><p>Cùng thao tác, hai bộ đếm để đối chiếu.</p></div></div>
      <div className="lab-memo-grid">
        <div className="tone-neutral">
          <strong>Component thường</strong>
          <output ref={regularOutput} aria-label="Số commit của component thường" />
          <span>lần commit</span>
          <Population region={region} onCommit={onRegular} />
        </div>
        <div className="tone-leaf">
          <strong>Có React.memo</strong>
          <output ref={memoOutput} aria-label="Số commit của component có memo" />
          <span>lần commit</span>
          <MemoPopulation region={region} onCommit={onMemo} />
        </div>
      </div>
      <div className="actions">
        <button className="button primary" onClick={() => setParent(parent + 1)}><Plus size={16} /> Tăng bộ đếm cha · {parent}</button>
        <button className="button" onClick={() => setRegion(region === 1 ? 2 : 1)}>Đổi khu khảo sát · {region}</button>
      </div>
      <p className="caption">Tăng bộ đếm cha: chỉ ô bên trái tăng. Đổi khu khảo sát: props thay đổi nên cả hai ô cùng tăng.</p>
    </section>
  </div>
}
