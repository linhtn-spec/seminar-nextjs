'use client'

import { useMemo } from 'react'

function calculateSamples() {
  return Array.from({ length: 48 }, (_, index) => {
    let total = 0
    for (let sample = 0; sample < 30_000; sample++) {
      total += Math.abs(Math.sin(index / 6 + sample / 10_000) * Math.cos(sample / 15_000))
    }
    return Math.round(total / 300)
  })
}

export default function HabitatChart() {
  const samples = useMemo(() => calculateSamples(), [])
  return <figure className="chart">
    <figcaption>48 mốc hoạt động giả lập tại vùng Kanto</figcaption>
    <div className="chart-bars" role="img" aria-label={`Biểu đồ dữ liệu minh họa, giá trị từ ${Math.min(...samples)} đến ${Math.max(...samples)}`}>
      {samples.map((sample, index) => <span key={index} style={{ height: `${sample}%` }} title={`Mốc ${index + 1}: ${sample}`} />)}
    </div>
  </figure>
}
