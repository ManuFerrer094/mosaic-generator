import type { Metadata } from 'next'
import '../styles.css'
import Providers from '@/components/Providers'

export const metadata: Metadata = {
  title: 'Mosaic Maker - LEGO Mosaic Generator',
  description: 'Convert your images into beautiful LEGO mosaics with piece calculations and export options',
  keywords: ['LEGO', 'mosaic', 'image converter', 'bricks', 'art'],
  authors: [{ name: 'Manu Ferrer' }],
  openGraph: {
    title: 'Mosaic Maker - LEGO Mosaic Generator',
    description: 'Convert your images into beautiful LEGO mosaics',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div>
            <header style={{ background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 8, background: 'var(--lego-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800 }}>L</div>
                  <div>
                    <div className="hero-title" style={{ margin: 0 }}>Mosaic Maker</div>
                    <div className="muted" style={{ fontSize: 12 }}>LEGO Mosaic Generator</div>
                  </div>
                </div>

                <div>
                  <button className="btn btn-lego">Get Started</button>
                </div>
              </div>
            </header>

            <main className="container" style={{ paddingTop: '2rem' }}>
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
}