import { Loader2Icon } from 'lucide-react'

import { Button } from './ui/button'

type LoadingButtonProps = {
  title: string
  isLoading: boolean
}

const LoadingButton = ({ title, isLoading }: LoadingButtonProps) => {
  return (
    <Button type="submit" disabled={isLoading}>
      {isLoading && <Loader2Icon className="animate-spin" />}
      {title}
    </Button>
  )
}

export default LoadingButton
