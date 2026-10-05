import React from 'react'
import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from '@vercel/analytics/next'

export const metadata: Metadata = {
  title: 'Chan Dinh — AI, Software & Cybersecurity',
  description: 'AI and software developer building RAG systems, cybersecurity automation, and real-time applications. Explore projects and experience from Chan Dinh.',
  keywords: ['AI Developer', 'Cybersecurity', 'Machine Learning', 'Software Engineer', 'Full Stack Developer', 'Portfolio', 'Chan Dinh'],
  authors: [{ name: 'Chan Dinh' }],
  creator: 'Chan Dinh',
  metadataBase: new URL('https://chandinh.dev'),
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Chan Dinh — AI, Software & Cybersecurity',
    description: 'The story behind my work in AI, software, and cybersecurity—from mathematics to useful systems, with a little Formula 1 along the way.',
    url: 'https://chandinh.dev',
    siteName: 'Chan Dinh Portfolio',
    images: [
      {
        url: '/images/portfolio-share.png',
        width: 1200,
        height: 630,
        alt: 'Chan Dinh / AI, Software & Cybersecurity',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chan Dinh — AI, Software & Cybersecurity',
    description: 'The story behind my work in AI, software, and cybersecurity—from mathematics to useful systems, with a little Formula 1 along the way.',
    images: ['/images/portfolio-share.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico?v=cd1', sizes: '16x16 32x32 48x48' },
      { url: '/favicon.svg?v=cd1', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png?v=cd1', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico?v=cd1',
    apple: [
      { url: '/apple-touch-icon.png?v=cd1', sizes: '180x180', type: 'image/png' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="msapplication-TileImage" content="/favicon-128x128.png?v=cd1" />
        <meta name="msapplication-TileColor" content="#101214" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
