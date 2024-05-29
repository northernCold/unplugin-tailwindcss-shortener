import { Outlet } from 'react-router-dom'
import Sidebar from './sidebar'
import useIsCollapsed from '@/hooks/use-is-collapsed'
import { cn } from '@/lib/utils'

export default function AppShell() {
  const [isCollapsed, setIsCollapsed] = useIsCollapsed()
  return (
    <div className='relative h-full overflow-hidden bg-background'>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main
        id='content'
        className={cn('overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0 h-full', isCollapsed ? 'md:ml-14' : 'md:ml-64')}
      >
        <Outlet />
      </main>
    </div>
  )
}
