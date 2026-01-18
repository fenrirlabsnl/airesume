import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { User, Briefcase, Zap, AlertTriangle, MessageSquare, LogOut, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/hooks/useAuth'

const navItems = [
  { to: '/admin', icon: User, label: 'Profile', end: true },
  { to: '/admin/experience', icon: Briefcase, label: 'Experience' },
  { to: '/admin/skills', icon: Zap, label: 'Skills' },
  { to: '/admin/gaps', icon: AlertTriangle, label: 'Gaps' },
  { to: '/admin/faq', icon: MessageSquare, label: 'FAQ' },
]

export default function AdminLayout() {
  const { signOut, user } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border flex flex-col">
        <div className="p-4">
          <h1 className="font-serif text-xl font-bold">Portfolio Admin</h1>
          <p className="text-xs text-muted-foreground mt-1 truncate">{user?.email}</p>
        </div>

        <Separator />

        <nav className="flex-1 p-2">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`
                  }
                >
                  <item.icon className="size-4" />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <Separator />

        <div className="p-2 space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Home className="size-4" />
            View Site
          </a>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
            onClick={handleSignOut}
          >
            <LogOut className="size-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
