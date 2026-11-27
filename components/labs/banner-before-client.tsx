'use client'

import { useSyncExternalStore } from 'react'
import Image from 'next/image'

const subscribe = () => () => {}

export function BannerBeforeClient() {
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )

  return (
    <figure className="lab-banner-card">
      <div className="lab-banner-frame">
        {mounted ? (
          <Image
            src="/banner-kanto-raw.png"
            alt="Banner phòng nghiên cứu Pokédex vùng Kanto (chưa tối ưu priority)"
            width={1440}
            height={540}
            loading="lazy"
            unoptimized
            className="lab-banner-img"
          />
        ) : (
          <div className="lab-banner-placeholder" aria-hidden="true" />
        )}
      </div>
      <figcaption className="lab-banner-caption">
        <strong>Chưa tối ưu:</strong> Banner gắn sau khi client hydrate, dùng PNG dung lượng lớn (<code>/banner-kanto-raw.png</code>),
        <code>loading=&quot;lazy&quot;</code>, không có <code>priority</code> / <code>&lt;link rel=&quot;preload&quot;&gt;</code>.
      </figcaption>
    </figure>
  )
}
