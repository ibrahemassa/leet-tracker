import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  CodeBracketIcon,
  DocumentTextIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Problems', href: '/problems', icon: CodeBracketIcon },
  { name: 'Solutions', href: '/solutions', icon: DocumentTextIcon },
  { name: 'Profile', href: '/profile', icon: UserCircleIcon },
];

export default function Sidebar() {
  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1">
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 bg-[var(--ctp-mantle-90)] space-y-1 rounded-r-xl shadow-xl border-r border-[var(--ctp-surface0)]">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `group flex items-center px-3 py-2 text-base font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-[var(--ctp-surface0-50)] text-[var(--ctp-blue)] shadow'
                        : 'text-[var(--ctp-subtext0)] hover:bg-[var(--ctp-surface0-50)] hover:text-[var(--ctp-blue)]'
                    }`
                  }
                >
                  <item.icon
                    className="mr-3 flex-shrink-0 h-6 w-6 text-[var(--ctp-blue)] opacity-80"
                    aria-hidden="true"
                  />
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
} 