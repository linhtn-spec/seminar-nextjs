'use client'

import { useState } from 'react'
import { EmptyTitleRegressionForm } from '../../../../components/empty-title-regression-form'

export function ReproductionForm() {
  const [version, setVersion] = useState(0)
  const [saved, setSaved] = useState<{ title: string; calls: number }>()

  return <div className="detail-grid">
    <EmptyTitleRegressionForm key={version} onSave={({ title }) => setSaved((previous) => ({
      title,
      calls: (previous?.calls ?? 0) + 1,
    }))} onCancel={() => {
      setVersion((current) => current + 1)
      setSaved(undefined)
    }} />
    <section className="panel">
      <h2>Đối chiếu với assertion</h2>
      <p><strong>Kỳ vọng khi tên trống</strong> · Gọi hàm lưu 0 lần.</p>
      <div role="status">
        {saved ? <>
          <p><strong>Thực tế</strong> · Đã gọi hàm lưu {saved.calls} lần. Tên được gửi lên là <code>{JSON.stringify(saved.title)}</code>.</p>
          {saved.title === '' && <p className="type-tag tone-fire">Đã tái hiện lỗi · Form chấp nhận tên trống</p>}
        </> : <p className="caption">Chưa gửi form.</p>}
      </div>
    </section>
  </div>
}
