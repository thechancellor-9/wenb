import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Lora, Libre_Franklin } from 'next/font/google'
import './globals.css'

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
})

const libreFranklin = Libre_Franklin({
  subsets: ['latin'],
  variable: '--font-libre-franklin',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'The Chancellor — A Fortnightly Review',
    template: '%s | The Chancellor',
  },
  description:
    'The Chancellor is a fortnightly review of politics, geopolitics, history, culture and ideas from Bharat and the world.',
  generator: 'v0.app',
  icons: {
    icon: '/favicon.jpg',
    shortcut: '/favicon.jpg',
    apple: '/favicon.jpg',
  },
  openGraph: {
    title: 'The Chancellor — A Fortnightly Review',
    description:
      'A fortnightly review of politics, geopolitics, history, culture and ideas.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#fbfaf7',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${lora.variable} ${libreFranklin.variable} bg-background`}>
      <body className="antialiased font-sans">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
