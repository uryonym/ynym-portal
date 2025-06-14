import { SidebarTrigger } from './ui/sidebar'

const Header = () => {
  return (
    <header className="flex items-center bg-gray-800 p-4 text-white">
      <SidebarTrigger />
      <h1 className="ps-2 text-xl font-bold">ynym portal</h1>
    </header>
  )
}

export default Header
