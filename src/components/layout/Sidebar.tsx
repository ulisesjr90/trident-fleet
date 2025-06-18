import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home,
  Car,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Users2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/user';
import { userService } from '../../services/userService';
import type { FirestoreUser } from '../../services/userService';

interface NavItem {
  icon: typeof Home;
  label: string;
  path: string;
  hideForRep?: boolean;
}

const navItems: NavItem[] = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: Car, label: 'Vehicles', path: '/vehicles' },
  { icon: Users2, label: 'Customers', path: '/customers' },
  { icon: Users, label: 'Users', path: '/users', hideForRep: true },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout, role, user } = useAuth();
  const [userData, setUserData] = useState<FirestoreUser | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.uid) {
        try {
          const firestoreUser = await userService.getUserById(user.uid);
          setUserData(firestoreUser);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [user?.uid]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const visibleNavItems = navItems.filter(item => 
    !(item.hideForRep && role === UserRole.REP)
  );

  return (
    <aside 
      className={`
        bg-white
        border-r border-gray-200
        transition-all duration-300
        flex flex-col
        ${isCollapsed ? 'w-16 md:w-20' : 'w-56 md:w-64'}
      `}
    >
      {/* Header with user info and collapse button */}
      <div className="p-2 md:p-4 border-b border-gray-200">
        <div className="flex items-center justify-between gap-2">
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {userData?.name || 'Loading...'}
              </h3>
              <p className="text-xs text-gray-500 truncate">
                {userData?.email || ''}
              </p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="
              p-2
              flex items-center justify-center
              text-gray-600
              hover:bg-gray-100
              rounded-lg
              transition-colors
              shrink-0
            "
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            ) : (
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="p-2 md:p-4 flex flex-col flex-grow">
        <nav className="flex-1 space-y-1 md:space-y-2">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-2 md:gap-3 
                  px-2 md:px-3 
                  py-2
                  rounded-lg
                  transition-colors
                  ${isActive 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                <Icon className="w-5 h-5 md:w-6 md:h-6 shrink-0" />
                {!isCollapsed && (
                  <span className="text-sm md:text-base truncate">
                    {item.label}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-2 md:mt-4">
          <button
            onClick={handleLogout}
            className="
              w-full
              flex items-center gap-2 md:gap-3
              px-2 md:px-3
              py-2
              rounded-lg
              text-red-600
              hover:bg-red-50
              transition-colors
            "
          >
            <LogOut className="w-5 h-5 md:w-6 md:h-6 shrink-0" />
            {!isCollapsed && (
              <span className="text-sm md:text-base truncate">
                Log Out
              </span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
} 