import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Calendar, UtensilsCrossed, Scale, UserCircle } from 'lucide-react'

const nav = [
  { to: '/',         label: 'Today',    icon: LayoutDashboard },
  { to: '/training', label: 'Training', icon: Calendar },
  { to: '/meals',    label: 'Meals',    icon: UtensilsCrossed },
  { to: '/weight',   label: 'Weight',   icon: Scale },
  { to: '/profile',  label: 'Profile',  icon: UserCircle },
]

export default function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 flex z-50">
      {nav.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center py-3 text-xs font-medium transition-colors
            ${isActive ? 'text-green-400' : 'text-gray-500'}`
          }
        >
          <Icon size={20} />
          <span className="mt-0.5">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
