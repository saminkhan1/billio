import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Billio - Business Management',
  description: 'A comprehensive business management solution',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}