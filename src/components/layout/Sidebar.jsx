import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Calendar,
  UtensilsCrossed,
  Scale,
  UserCircle,
  Zap,
} from 'lucide-react'

const nav = [
  { to: '/',         label: 'Dashboard',      icon: LayoutDashboard },
  { to: '/training', label: 'Training',        icon: Calendar },
  { to: '/meals',    label: 'Meal Plan',       icon: UtensilsCrossed },
  { to: '/weight',   label: 'Weight',          icon: Scale },
  { to: '/profile',  label: 'Profile',         icon: UserCircle },
]

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-60 min-h-screen bg-gray-900 text-white shrink-0">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-700">
        <Zap className="text-green-400" size={22} />
        <span className="text-lg font-bold tracking-tight">FuelPad</span>
      </div>

      <nav className="flex flex-col gap-1 px-3 pt-4 flex-1">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
              ${isActive
                ? 'bg-green-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-6 py-5 text-xs text-gray-500 border-t border-gray-700">
        Eat smart. Perform better.
      </div>
    </aside>
  )
}
