import type { Metadata } from 'next'
import { Navigation } from '../components/navigation'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pokédex Lab · Frontend Roadmap',
  description: 'Seminar Next.js App Router qua Pokédex và nhiệm vụ nghiên cứu Pokémon.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body>
    <a className="skip-link" href="#noi-dung">Đến nội dung chính</a>
    <div className="app-shell">
      <Navigation />
      <main className="workspace" id="noi-dung">{children}</main>
    </div>
  </body></html>
}
