import '../styles/globals.css'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'

function MyApp({ Component, pageProps }: AppProps) {
  const SafeHydrate = dynamic(() => import('@/components/SafeHydrate'), { ssr: false })

  return (
    <SafeHydrate>
      <Component {...pageProps} />
    </SafeHydrate>
  )
}

export default MyApp
