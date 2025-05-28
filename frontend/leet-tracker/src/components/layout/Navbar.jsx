import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { UserCircleIcon, HomeIcon, CodeBracketIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../../services/api';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const navLinks = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Problems', href: '/problems', icon: CodeBracketIcon },
  { name: 'Solutions', href: '/solutions', icon: DocumentTextIcon },
  { name: 'Profile', href: '/profile', icon: UserCircleIcon },
];

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      localStorage.removeItem('auth_token');
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-30 bg-[var(--ctp-mantle-80)] shadow-sm border-b border-[var(--ctp-surface0)] backdrop-blur-md">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold text-[var(--ctp-blue)] tracking-tight">LeetTracker</h1>
            <div className="hidden md:flex gap-2 ml-6">
              {navLinks.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      isActive
                        ? 'bg-[var(--ctp-surface0-50)] text-[var(--ctp-blue)] shadow'
                        : 'text-[var(--ctp-subtext0)] hover:bg-[var(--ctp-surface0-50)] hover:text-[var(--ctp-blue)]',
                      'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center">
            <Menu as="div" className="ml-3 relative">
              <div>
                <Menu.Button className="flex items-center max-w-xs bg-[var(--ctp-surface0)] rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--ctp-blue)]">
                  <span className="sr-only">Open user menu</span>
                  <UserCircleIcon className="h-8 w-8 text-[var(--ctp-overlay1)]" />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-[var(--ctp-mantle-90)] ring-1 ring-[var(--ctp-surface0)] focus:outline-none z-50">
                  <Menu.Item>
                    {({ active }) => (
                      <div className="px-4 py-2 text-sm text-[var(--ctp-subtext0)]">
                        Signed in as <span className="font-medium text-[var(--ctp-blue)]">{user.name}</span>
                      </div>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/profile"
                        className={classNames(
                          active ? 'bg-[var(--ctp-surface0-50)]' : '',
                          'block px-4 py-2 text-sm text-[var(--ctp-text)] rounded-md transition-colors duration-200'
                        )}
                      >
                        Your Profile
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={classNames(
                          active ? 'bg-[var(--ctp-surface0-50)]' : '',
                          'block w-full text-left px-4 py-2 text-sm text-[var(--ctp-red)] rounded-md transition-colors duration-200'
                        )}
                      >
                        Sign out
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </nav>
  );
} 