'use client'

import { useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'

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

const AppSidebar = () => {
  const { setOpenMobile } = useSidebar()
  const router = useRouter()
  const { data: session } = useSession()

  const handleClickLink = (to: string) => () => {
    router.push(to)
    setOpenMobile(false)
  }

  const handleClickLogout = async () => {
    setOpenMobile(false)
    await signOut()
  }

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleClickLink('/')}>ホーム</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarSeparator />
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleClickLink('/task')}>タスク</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleClickLink('/car')}>車</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleClickLink('/refueling')}>
                  燃費記録
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleClickLink('/section')}>ノート</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleClickLink('/')}>家計簿</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarSeparator />
              {session ? (
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={handleClickLogout}>ログアウト</SidebarMenuButton>
                </SidebarMenuItem>
              ) : (
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={handleClickLink('/login')}>
                    ログイン
                  </SidebarMenuButton>
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

export default AppSidebar
