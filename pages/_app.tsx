// pages/_app.tsx

import '../_styles/globals.css'
import type { AppProps } from 'next/app'
import { Poppins, Roboto } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-poppins',
})

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={`${poppins.variable} ${roboto.variable} font-roboto`}>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
