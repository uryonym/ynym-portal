import '../styles/globals.css'
import { MsalProvider } from '@azure/msal-react'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import { Component } from 'react'
import { msalInstance } from '@/lib/authConfig'

function MyApp({ Component, pageProps }: AppProps) {
  const SafeHydrate = dynamic(() => import('@/components/SafeHydrate'), { ssr: false })

  return (
    <MsalProvider instance={msalInstance}>
      <SafeHydrate>
        <Component {...pageProps} />
      </SafeHydrate>
    </MsalProvider>
  )
}

export default MyApp
