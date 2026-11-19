'use client'

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <div className="state" role="alert"><h1>Trang gặp lỗi khi tải.</h1><button className="button" onClick={reset}>Thử lại</button></div>
}
