import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Calendar, UtensilsCrossed, Scale, UserCircle, Zap,
} from 'lucide-react'

const nav = [
  { to: '/',         label: 'Dashboard', icon: LayoutDashboard },
  { to: '/training', label: 'Training',  icon: Calendar },
  { to: '/meals',    label: 'Meal Plan', icon: UtensilsCrossed },
  { to: '/weight',   label: 'Weight',    icon: Scale },
  { to: '/profile',  label: 'Profile',   icon: UserCircle },
]

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-56 min-h-screen bg-white border-r border-gray-100 shrink-0">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-sm">
          <Zap size={15} className="text-white" />
        </div>
        <span className="text-base font-bold tracking-tight text-gray-900">FuelPad</span>
      </div>

      <nav className="flex flex-col gap-0.5 px-3 pt-2 flex-1">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
              ${isActive
                ? 'bg-gray-900 text-white'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mx-3 mb-5 p-4 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-500 text-white">
        <p className="text-xs font-bold mb-1">Nutrition tip</p>
        <p className="text-xs leading-relaxed opacity-90">
          Eat within 30 min post-workout to maximise recovery.
        </p>
      </div>
    </aside>
  )
}
