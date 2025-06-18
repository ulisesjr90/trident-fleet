import { NavLink } from 'react-router-dom';
import { Home, Car, Users, Settings, Users2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/user';

const navItems = [
  { icon: Home, label: 'Home', path: '/dashboard' },
  { icon: Car, label: 'Vehicles', path: '/vehicles' },
  { icon: Users2, label: 'Customers', path: '/customers' },
  { icon: Users, label: 'Users', path: '/users', hideForRep: true },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function MobileNavigation() {
  const { role } = useAuth();

  const visibleNavItems = navItems.filter(item => 
    !(item.hideForRep && role === UserRole.REP)
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex items-center justify-around h-16">
        {visibleNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex flex-col items-center justify-center
                w-full h-full
                ${isActive 
                  ? 'text-blue-600' 
                  : 'text-gray-600'
                }
              `}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
} 