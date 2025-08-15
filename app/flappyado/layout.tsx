import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Flappy Ado',
  description: 'Play Flappy Ado, an interactive Flappy Bird-style game with dynamic background music, high score tracking, and mobile-optimized gameplay.',
  keywords: ['Flappy Ado', 'Flappy Bird', 'HTML5 Game', 'Canvas Game', 'Interactive Game', 'Mobile Game'],
  authors: [{ name: 'Chan Dinh' }],
  creator: 'Chan Dinh',
  publisher: 'Chan Dinh',
  robots: 'index, follow',
  openGraph: {
    title: 'Flappy Ado - Interactive Game',
    description: 'Play Flappy Ado, an interactive Flappy Bird-style game with dynamic background music, high score tracking, and mobile-optimized gameplay.',
    type: 'website',
    images: ['/images/ado.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flappy Ado - Interactive Game',
    description: 'Play Flappy Ado, an interactive Flappy Bird-style game with dynamic background music, high score tracking, and mobile-optimized gameplay.',
    images: ['/images/ado.png'],
  },
  icons: {
    icon: '/favicon-ado.ico',
    shortcut: '/favicon-ado.ico',
    apple: '/favicon-ado.ico',
  },
}

export default function FlappyAdoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
