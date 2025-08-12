import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google'
import './globals.css'

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: '700',
})

export const metadata: Metadata = {
  title: 'WashMates - No More Laundry Fuss | Coming Soon to GTA',
  description: 'Professional laundry pickup and delivery service coming soon to the Greater Toronto Area. Join our waitlist for early access.',
  keywords: 'laundry service, GTA, Toronto, pickup, delivery, WashMates, laundry app',
  openGraph: {
    title: 'WashMates - No More Laundry Fuss',
    description: 'Professional laundry service coming soon to GTA',
    url: 'https://www.washmates.ca',
    siteName: 'WashMates',
    locale: 'en_CA',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-CA">
      <body className={`${plusJakarta.variable} ${playfair.variable} font-plus-jakarta`}>
        {children}
      </body>
    </html>
  )
}