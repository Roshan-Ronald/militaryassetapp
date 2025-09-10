
import { NavLink, useNavigate } from 'react-router-dom'
import {  HomeIcon,  CubeIcon,  ArrowRightOnRectangleIcon,  ShoppingBagIcon,ClipboardDocumentListIcon,  CreditCardIcon,  UsersIcon,  Cog6ToothIcon,} from '@heroicons/react/24/outline'

const navItems = [
  { name: 'Dashboard', to: '/home', icon: HomeIcon },
  { name: 'Assets', to: '/assets', icon: CubeIcon },
  { name: 'Transfers', to: '/transfers', icon: ArrowRightOnRectangleIcon },
  { name: 'Purchases', to: '/purchases', icon: ShoppingBagIcon },
  { name: 'Assignments', to: '/assignments', icon: ClipboardDocumentListIcon },
  { name: 'Expenditures', to: '/expenditures', icon: CreditCardIcon },
  { name: 'Users', to: '/users', icon: UsersIcon },
  { name: 'Settings', to: '/settings', icon: Cog6ToothIcon },
]

export default function Sidebar({ onNavLinkClick }) {
  const navigate = useNavigate()
  return (
    <nav className="flex flex-col pt-6 text-white h-full">
      <div
        className="text-2xl font-bold mb-8 pt-10 leading-tight cursor-pointer select-none px-4"
        onClick={() => navigate('/home')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') navigate('/home') }}
      >
        Military Asset<br />Management
      </div>
      <div className="flex flex-col gap-1 flex-1 overflow-y-auto px-1">
        {navItems.map(({ name, to, icon: Icon }) => (
          <NavLink
            to={to}
            key={name}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg font-medium hover:bg-[#222d3b] ${
                isActive ? 'bg-[#22324b] text-white' : 'text-gray-200'
              }`
            }
            end
            onClick={onNavLinkClick}
          >
            <Icon className="text-gray-400 group-hover:text-white mr-3 flex-shrink-0 h-6 w-6" />
            {name}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
