import { supabase } from '~/lib/supabase'
import { Welcome } from '../welcome/welcome'
import { redirect } from 'react-router'

export async function clientLoader() {
  const userData = (await supabase.auth.getUser()).data.user
  console.log(userData)
  if (!userData) {
    return redirect('/login')
  }
}

export default function Home() {
  return <Welcome />
}
