import Link from 'next/link'
import { ArrowLeftRight, BarChart2 } from 'lucide-react'

export function LabSwitch({
  beforeHref,
  afterHref,
  beforeLabel,
  afterLabel,
  current,
}: {
  beforeHref: string
  afterHref: string
  beforeLabel: string
  afterLabel: string
  current: 'before' | 'after'
}) {
  return (
    <div className="lab-switch-bar" role="region" aria-label="Chuyển đổi bản Trước và Sau">
      <div className="segmented" role="group" aria-label="Chọn phiên bản so sánh">
        <Link
          href={beforeHref}
          prefetch={false}
          aria-current={current === 'before' ? 'page' : undefined}
          className={current === 'before' ? 'lab-seg-active' : undefined}
        >
          {beforeLabel}
        </Link>
        <Link
          href={afterHref}
          prefetch={false}
          aria-current={current === 'after' ? 'page' : undefined}
          className={current === 'after' ? 'lab-seg-active' : undefined}
        >
          {afterLabel}
        </Link>
      </div>
      <Link href="/benchmark#before-after" prefetch={false} className="button">
        <BarChart2 size={16} aria-hidden /> Xem số đo Lighthouse Trước / Sau
      </Link>
      <span className="caption lab-switch-hint">
        <ArrowLeftRight size={14} aria-hidden /> Đổi tab hoặc mở DevTools Network để đối chiếu
      </span>
    </div>
  )
}
