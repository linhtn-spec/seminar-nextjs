'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { Images } from 'lucide-react'
import styles from './lazy-load.module.css'

const photos = [
  { id: 'kanto', src: '/kanto.webp', title: 'Kanto', alt: 'Phong cảnh vùng Kanto' },
  { id: 'rendering', src: '/rendering-lab.webp', title: 'Phòng rendering', alt: 'Minh họa phòng nghiên cứu rendering' },
  { id: 'benchmark', src: '/benchmark-lab.webp', title: 'Phòng benchmark', alt: 'Minh họa phòng đo hiệu năng' },
]

export function LazyLoadLab() {
  const [visiblePhotos, setVisiblePhotos] = useState<string[]>([])
  const [loadedPhotos, setLoadedPhotos] = useState<string[]>([])
  const galleryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const gallery = galleryRef.current
    if (!gallery) return
    if (typeof IntersectionObserver === 'undefined') {
      const timer = window.setTimeout(() => setVisiblePhotos(photos.map((photo) => photo.id)), 0)
      return () => window.clearTimeout(timer)
    }

    const observer = new IntersectionObserver((entries) => {
      const arrived = entries.filter((entry) => entry.isIntersecting)
      if (!arrived.length) return
      setVisiblePhotos((current) => [...new Set([...current, ...arrived.map((entry) => (entry.target as HTMLElement).dataset.lazyId!)])])
      arrived.forEach((entry) => observer.unobserve(entry.target))
    }, { root: gallery, threshold: 0.2 })

    gallery.querySelectorAll<HTMLElement>('[data-lazy-id]').forEach((card) => observer.observe(card))
    return () => observer.disconnect()
  }, [])

  return <>
    <section className={`panel ${styles.demo}`} aria-labelledby="image-heading">
      <div className="lab-heading">
        <span className="strategy-icon tone-leaf"><Images size={20} aria-hidden /></span>
        <div><h2 id="image-heading">Tải ảnh khi cuộn đến</h2><p>{loadedPhotos.length}/{photos.length} ảnh đã tải.</p></div>
      </div>
      <div className={styles.gallery} ref={galleryRef} role="region" aria-label="Thư viện ảnh lazy load" tabIndex={0}>
        {photos.map((photo) => {
          const visible = visiblePhotos.includes(photo.id)
          const loaded = loadedPhotos.includes(photo.id)
          return <figure className={styles.photoCard} data-lazy-id={photo.id} key={photo.id}>
            <div className={styles.photoFrame}>
              {visible && <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 690px) 100vw, 900px" loading="eager" unoptimized onLoad={() => setLoadedPhotos((current) => current.includes(photo.id) ? current : [...current, photo.id])} />}
              {!loaded && <span className={styles.photoPlaceholder} aria-hidden>Ảnh sẽ xuất hiện khi cuộn đến</span>}
            </div>
            <figcaption><strong>{photo.title}</strong><span>{loaded ? 'Đã tải' : visible ? 'Đang tải' : 'Chưa tải'}</span></figcaption>
          </figure>
        })}
      </div>
      <p className="caption">Mở DevTools → Network, lọc Img, rồi cuộn trong khung. Các request .webp xuất hiện khi từng ảnh đi vào vùng nhìn thấy.</p>
    </section>
    <section className="section" aria-labelledby="lazy-steps-heading">
      <div className="section-heading"><div><h2 id="lazy-steps-heading">Cách quan sát</h2><p>Mở Network trước khi tải lại trang để thấy cả request đầu tiên.</p></div></div>
      <ol className="strategy-grid lab-flow">
        <li className="panel"><h3>1. Mở Network</h3><p>Bật Disable cache, lọc Img rồi tải lại trang. Ban đầu chỉ có kanto.webp.</p></li>
        <li className="panel"><h3>2. Cuộn thư viện</h3><p>Cuộn xuống từng ảnh. Network sẽ thêm rendering-lab.webp và benchmark-lab.webp.</p></li>
        <li className="panel"><h3>3. Cuộn lại</h3><p>Ảnh đã tải vẫn hiển thị, không cần gửi request mới.</p></li>
      </ol>
    </section>
  </>
}
