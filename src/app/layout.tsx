import type { Metadata, Viewport } from 'next'
import { Montserrat, Nunito } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { BottomNav } from '@/components/layout/BottomNav'
import { Footer } from '@/components/layout/Footer'
import { StoreInitializer } from '@/components/ui/StoreInitializer'

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
    default: 'CLEANO Detergents – Ethiopia\'s Premium Cleaning Brand',
    template: '%s | CLEANO Detergents',
  },
  description:
    'CLEANO Detergents – Premium cleaning products crafted for Ethiopian homes. Available across Addis Ababa. Shop laundry detergent, floor cleaner, dish soap & more.',
  keywords: [
    'detergent in Addis Ababa',
    'cleaning products Ethiopia',
    'laundry detergent Ethiopia',
    'CLEANO detergents',
    'best detergent Addis Ababa',
    'floor cleaner Ethiopia',
    'dish soap Ethiopia',
    'የጽዳት ምርቶች',
    'ዲተርጀንት አዲስ አበባ',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_ET',
    url: 'https://cleanoet.com',
    siteName: 'CLEANO Detergents',
    title: 'CLEANO Detergents – Ethiopia\'s Premium Cleaning Brand',
    description:
      'Premium detergents for Ethiopian homes. Powerful formulas, unbeatable prices. Shop online or visit our Addis Ababa branches.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'CLEANO Detergents – Ethiopia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CLEANO Detergents Ethiopia',
    description: 'Ethiopia\'s most trusted cleaning brand. Shop online today!',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#1B4FD8',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Ethiopic:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          crossOrigin=""
        />
      </head>
      <body
        className={`${display.variable} ${body.variable} font-body bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased`}
        suppressHydrationWarning
      >
        <StoreInitializer />
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 pb-20 md:pb-0">{children}</main>
          <Footer />
        </div>
        <BottomNav />
      </body>
    </html>
  )
}
