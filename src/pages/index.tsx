import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import type { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  const { instance } = useMsal()
  const isAuth = useIsAuthenticated()

  return (
    <div>
      <Head>
        <title>ynym-portal</title>
      </Head>
      <div>
        {isAuth ? (
          <button onClick={() => instance.logout()}>ログアウト</button>
        ) : (
          <button onClick={() => instance.loginRedirect()}>ログイン</button>
        )}
      </div>
    </div>
  )
}

export default Home
