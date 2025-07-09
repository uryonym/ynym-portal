import { auth } from '@/auth'
import { Button } from '@/components/ui/button'

import { login, logout } from '../actions/login'

const Login = async () => {
  const session = await auth()

  return (
    <>
      {session !== null ? (
        <div className="flex h-screen flex-col items-center justify-center gap-4">
          <p>{session.user?.name}がログインしています</p>
          <img src={session.user?.image} alt="user image" />
          <form action={logout}>
            <Button type="submit">ログアウト</Button>
          </form>
        </div>
      ) : (
        <div className="flex h-screen flex-col items-center justify-center gap-4">
          <form action={login}>
            <Button type="submit">ログイン</Button>
          </form>
        </div>
      )}
    </>
  )
}

export default Login
