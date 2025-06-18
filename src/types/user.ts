// User Roles Enum
export enum UserRole {
  ADMIN = 'admin',
  REP = 'rep'
}

// User Interface
export interface User {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  lastLoginAt?: string;
}

// User Permissions Interface
export interface UserPermissions {
  canViewVehicles: boolean;
  canCheckoutVehicles: boolean;
  canManageCustomers: boolean;
  canAccessAdminSettings: boolean;
}

// Function to get permissions based on role
export function getUserPermissions(role: UserRole): UserPermissions {
  switch (role.toLowerCase()) {
    case UserRole.ADMIN:
      return {
        canViewVehicles: true,
        canCheckoutVehicles: true,
        canManageCustomers: true,
        canAccessAdminSettings: true
      };
    case UserRole.REP:
      return {
        canViewVehicles: true,
        canCheckoutVehicles: true,
        canManageCustomers: true,
        canAccessAdminSettings: false
      };
    default:
      return {
        canViewVehicles: false,
        canCheckoutVehicles: false,
        canManageCustomers: false,
        canAccessAdminSettings: false
      };
  }
}

// Authentication Context Type
export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  permissions: UserPermissions;
} 