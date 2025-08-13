import React from 'react'
import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from '@vercel/analytics/next'

export const metadata: Metadata = {
  title: 'Chan Dinh - AI/ML Developer Portfolio',
  description: 'AI/ML Developer and Software Engineer specializing in machine learning, artificial intelligence, and full-stack development. View projects, skills, and experience.',
  keywords: ['AI Developer', 'Machine Learning', 'Software Engineer', 'Full Stack Developer', 'Portfolio', 'Chan Dinh'],
  authors: [{ name: 'Chan Dinh' }],
  creator: 'Chan Dinh',
  metadataBase: new URL('https://chandinh.org'),
  openGraph: {
    title: 'Chan Dinh - AI/ML Developer Portfolio',
    description: 'AI/ML Developer and Software Engineer specializing in machine learning, artificial intelligence, and full-stack development.',
    url: 'https://chandinh.org',
    siteName: 'Chan Dinh Portfolio',
    images: [
      {
        url: '/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'Chan Dinh - AI/ML Developer Portfolio',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chan Dinh - AI/ML Developer Portfolio',
    description: 'AI/ML Developer and Software Engineer specializing in machine learning, artificial intelligence, and full-stack development.',
    images: ['/images/logo.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/images/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/logo.png', sizes: '64x64', type: 'image/png' },
      { url: '/images/logo.png', sizes: '128x128', type: 'image/png' },
      { url: '/images/logo.png', sizes: '256x256', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/images/logo.png', sizes: '180x180', type: 'image/png' },
      { url: '/images/logo.png', sizes: '256x256', type: 'image/png' },
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/images/logo.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/images/logo.png" type="image/png" sizes="64x64" />
        <link rel="icon" href="/images/logo.png" type="image/png" sizes="128x128" />
        <link rel="icon" href="/images/logo.png" type="image/png" sizes="256x256" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/images/logo.png" sizes="180x180" />
        <link rel="apple-touch-icon" href="/images/logo.png" sizes="256x256" />
        <meta name="msapplication-TileImage" content="/images/logo.png" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
