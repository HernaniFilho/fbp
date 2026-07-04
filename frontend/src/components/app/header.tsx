'use client'
import { Link, useLocation } from '@tanstack/react-router'
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/staff', label: 'Staff' },
  { to: '/board', label: 'Board' },
]

type HeaderProps = {
  className?: string
}

export default function Header({ className }: HeaderProps) {
  const location = useLocation()
  const currentPath = location.pathname
  const currentTab = '/' + currentPath.split('/')[1]

  className = className + ' flex flex-col mx-6 mt-6 mb-2 gap-4'

  return (
    <header className={className}>
      <h1 className="text-5xl font-bold uppercase">
        <span>
          Federal Bureau
          <span className="lowercase"> of</span>
          <br />
          <span> Paranormal Activities</span>
        </span>
      </h1>
      <Tabs value={currentTab}>
        <TabsList
          className="rounded-none bg-transparent p-0 "
          variant="default"
        >
          {navItems.map(({ to, label }) => (
            <TabsTrigger
              key={to}
              value={to}
              className="rounded-none m-0 font-bold"
              asChild
            >
              <Link to={to}>{label}</Link>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </header>
  )
}
