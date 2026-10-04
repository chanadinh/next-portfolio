import localFont from 'next/font/local';

export const displayFont = localFont({ src: '../public/fonts/unbounded-latin.woff2', variable: '--font-display', weight: '400 700', display: 'swap' });
export const labelFont = localFont({ src: '../public/fonts/space-mono-latin.woff2', variable: '--font-label', weight: '400', display: 'swap', preload: false });
