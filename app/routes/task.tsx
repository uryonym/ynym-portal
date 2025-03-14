import { supabase } from '~/lib/supabase'
import { redirect } from 'react-router'

export async function clientLoader() {
  const userData = (await supabase.auth.getUser()).data.user
  console.log(userData)
  if (!userData) {
    return redirect('/login')
  }
}

export default function Task() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-4xl font-bold">task screen</h2>
    </div>
  )
}
