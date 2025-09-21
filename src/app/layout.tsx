import type { Metadata } from 'next'
import '../styles.css'

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
        {children}
      </body>
    </html>
  )
}