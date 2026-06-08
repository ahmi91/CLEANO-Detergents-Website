import type { Metadata } from 'next'
import { Montserrat, Nunito } from 'next/font/google'

const display = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-display',
  display: 'swap',
})

const body = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'CLEANO Admin',
    template: '%s | CLEANO Admin',
  },
  robots: { index: false, follow: false },
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${display.variable} ${body.variable} font-body bg-gray-950 text-gray-100 antialiased`}>
        {children}
      </body>
    </html>
  )
}
