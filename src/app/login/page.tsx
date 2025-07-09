import { Button } from '@/components/ui/button'

import { login } from '../actions/login'

const Login = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <form action={login}>
        <Button type="submit">ログイン</Button>
      </form>
    </div>
  )
}

export default Login
