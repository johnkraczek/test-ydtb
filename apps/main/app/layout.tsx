import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from "@ydtb/core/context/providers";
import { Toaster } from 'sonner'
import '@ydtb/core/index.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'YDTB',
  description: 'Your Development Toolkit Bundle',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}