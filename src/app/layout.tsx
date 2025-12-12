import type { Metadata } from 'next'
import '~/index.css'

export const metadata: Metadata = {
  title: 'CRM Toolbox',
  description: 'A modern CRM toolbox for professionals.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}