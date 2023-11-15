import 'src/styles/globals.css'
import { Inter } from 'next/font/google'

import { languages } from '@/src/i18n'

import { Providers } from '../providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'EBS Integrator Storefront',
}

export async function generateStaticParams() {
  return languages.map((language) => ({
    params: { lang: language },
  }))
}

interface RootLayoutProps {
  children: React.ReactNode
  params: { lang: string }
}

export default async function RootLayout({ children, params: { lang } }: RootLayoutProps) {
  return (
    <html lang={lang}>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
