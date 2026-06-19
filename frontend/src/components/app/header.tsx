'use client'
import { Link, useLocation } from '@tanstack/react-router'
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/staff', label: 'Staff' },
]

type HeaderProps = {
  className?: string
}

export default function Header({ className }: HeaderProps) {
  const location = useLocation()
  const currentPath = location.pathname
  const currentTab = '/' + currentPath.split('/')[1]

  return (
    <header className={className}>
      <Tabs value={currentTab}>
        <TabsList>
          {navItems.map(({ to, label }) => (
            <TabsTrigger key={to} value={to}>
              <Link to={to}>{label}</Link>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </header>
  )
}
