export type NavigationItem = {
  id: string;
  label: string;
  icon: string;
  href: string;
  roles?: string[];
  isActive?: boolean;
};

export type HeaderProps = {
  title: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
};

export type BottomNavigationProps = {
  currentPath: string;
  items: NavigationItem[];
  userRole: string;
};

export type MobileLayoutProps = {
  children: React.ReactNode;
  header?: HeaderProps;
  showBottomNav?: boolean;
  currentPath: string;
  userRole: string;
}; 