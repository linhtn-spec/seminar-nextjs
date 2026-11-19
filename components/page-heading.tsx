import Image from 'next/image'
import type { ReactNode } from 'react'

export function PageHeading({ category, title, children, image }: {
  category: string
  title: string
  children: ReactNode
  image?: string
}) {
  return <header className={image ? 'page-heading page-heading-media' : 'page-heading'}>
    <div className="page-heading-copy">
      <p className="eyebrow">{category}</p>
      <h1>{title}</h1>
      <p>{children}</p>
    </div>
    {image && <div className="page-heading-image">
      <Image src={image} alt="" fill unoptimized />
    </div>}
  </header>
}
