import { useNavigate, type To } from 'react-router'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from './ui/sidebar'
import { supabase } from '~/lib/supabase'
import { useState } from 'react'

export function AppSidebar() {
  const { setOpenMobile } = useSidebar()
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(!!supabase.auth.getUser())

  supabase.auth.onAuthStateChange((_, session) => {
    setIsLoggedIn(!!session?.user)
  })

  const handleLinkClick = (to: To) => {
    navigate(to)
    setOpenMobile(false)
  }

  const handleClickSignOut = async () => {
    await supabase.auth.signOut()
    setOpenMobile(false)
    navigate('/login')
  }

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => handleLinkClick('/')}>ホーム</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarSeparator />
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => handleLinkClick('/')}>タスク</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => handleLinkClick('/')}>ノート</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => handleLinkClick('/')}>家計簿</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => handleLinkClick('/')}>燃費記録</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarSeparator />
              {isLoggedIn ? (
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={handleClickSignOut}>ログアウト</SidebarMenuButton>
                </SidebarMenuItem>
              ) : (
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => handleLinkClick('/login')}>ログイン</SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
