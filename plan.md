# Trident Fleet App Development Plan

## Overview
A comprehensive fleet management application for managing vehicles, customers, and related operations. Designed for small-scale operations with up to 30 active vehicles and 6+ users.

## Technology Stack
- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Firebase/Firestore (Spark Plan)
- **Authentication**: firebase auth
- **Storage**: Firebase Storage
- **State Management**: React Query
- **Forms**: React Hook Form
- **UI Components**: Shadcn/ui

## Design System
- **Colors**
  - Primary: #0066CC (Navy Blue)
  - Accent: #FFD700 (Golden Yellow)
  - Background: #FFFFFF (Light) / #1A1A1A (Dark)
  - Text: #333333 (Light) / #FFFFFF (Dark)
  - Success: #22C55E
  - Warning: #F59E0B
  - Error: #EF4444
- **Typography**
  - typography.ts
- **Spacing**
  - Base: 4px
  - Common: 8px, 16px, 24px, 32px
- **Icons**
  - Lucide Icons
  - Simple, clean style
  - Consistent stroke width
- **No Animations**
  - Direct state changes
  - No transitions
  - No loading animations (except spinner)

## Layout Structure
- **Mobile Layout**
  - Header
    - Fixed position
    - Safe area inset top
    - Title centered
    - Back button (when needed)
  - Main Content
    - Scrollable area
    - Safe area insets
    - No parent layout constraints
    - Direct child styling
  - Bottom Navigation
    - Fixed position
    - Safe area inset bottom
    - Icons only
    - Active state indicator

## Application Structure

### Authentication & User Management ✅
  - Email/password authentication
  - Role-based redirection
  - Session management
  - "Forgot Password" link

- **Forgot Password** (`/auth/forgot-password`) ✅
  - Email verification
  - Password reset flow
  - Security notifications

- **Reset Password** (`/auth/reset-password`) ✅
  - Token validation
  - New password setup
  - Password requirements
  - Success confirmation

### Dashboard Pages
1. **Main Dashboard** (`/dashboard`) ✅
   - Role-based rendering (Admin/Rep)
   - Quick stats
   - Recent activity
   - Maintenance alerts
   - Pull-to-refresh

2. **Vehicles** (`/vehicles`) ✅
   - Vehicle list view
   - Status filters
   - Search functionality
   - Add vehicle button (Admin only)
   - Vehicle cards with status badges

3. **Vehicle Details** (`/vehicles/[id]`) ✅
   - Vehicle information
   - Status management
   - Maintenance history
   - Assignment history
   - Action buttons (Admin only)
   - Archive/Delete functionality

4. **Customers** (`/customers`) ✅
   - Customer list view
   - Search functionality
   - Add customer button
   - Sharing options
   - Customer cards

5. **Customer Details** (`/customers/[id]`) ✅
   - Customer information
   - Vehicle assignments
   - Sharing management
   - History tracking
   - Editable fields

6. **Users** (`/users`) ✅
   - Admin only access
   - User management
   - Role assignment
   - Status tracking

7. **Settings** (`/settings`) ✅
   - Profile management
   - Theme preferences
   - Account settings
   - Session management

### Components Structure
```
src/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Protected dashboard routes
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # UI components
│   ├── dashboard/        # Dashboard components
│   ├── vehicles/         # Vehicle components
│   ├── customers/        # Customer components
│   └── layout/           # Layout components
├── lib/                  # Utility functions
├── hooks/               # Custom React hooks
├── types/               # TypeScript types
└── constants/           # Application constants
```

### Data Models
- **Vehicle**
  - Basic information
  - Status tracking
  - Maintenance records
  - Assignment history

- **Customer**
  - Profile information
  - Vehicle assignments
  - Sharing permissions
  - Activity history

- **User**
  - Authentication details
  - Role management
  - Session tracking
  - Activity logging

### Features
- **Role-based Access**
  - Admin: Full access
  - Rep: Limited access
  - Protected routes
  - Permission checks

- **Mobile-first Design**
  - Responsive layouts
  - Touch-friendly interfaces
  - Bottom navigation
  - Safe area handling

- **Real-time Updates**
  - Status changes
  - Maintenance alerts
  - Assignment updates
  - Activity tracking

- **Data Management**
  - CRUD operations
  - Data validation
  - Error handling
  - Loading states

### Error Handling
- **Frontend Validation**
  - Form validation
  - Input constraints
  - Error messages
  - Success feedback

- **Error States**
  - Loading indicators
  - Error messages
  - Fallback UI
  - Recovery options

### Security
- **Authentication**
  - Session management
  - Token validation
  - Role verification
  - Access control

- **Data Protection**
  - Input sanitization
  - XSS prevention
  - CSRF protection
  - Rate limiting

### Performance
- **Optimizations**
  - Code splitting
  - Lazy loading
  - Image optimization
  - Caching strategies

- **Monitoring**
  - Error tracking
  - Performance metrics
  - Usage analytics
  - Health checks

## Project Structure ✅
```
src/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication route group
│   │   ├── login/         # Login page (/)
│   │   ├── forgot-password/ # Password reset request
│   │   ├── reset-password/  # Password reset form
│   │   ├── invite/        # User invitation
│   │   └── accept-invite/ # Accept invitation
│   ├── (dashboard)/       # Dashboard route group
│   │   ├── dashboard/     # Main dashboard (role-based)
│   │   ├── vehicles/      # Vehicle management
│   │   │   └── [id]/      # Vehicle details
│   │   ├── customers/     # Customer management
│   │   │   └── [id]/      # Customer details
│   │   ├── users/         # User management (admin)
│   │   └── settings/      # User settings
│   ├── api/               # API routes
│   │   └── auth/          # Auth API endpoints
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Card.tsx
│   ├── dashboard/        # Dashboard components
│   │   ├── AdminDashboard.tsx
│   │   └── RepDashboard.tsx
│   └── layout/           # Layout components
│       ├── Header.tsx
│       ├── BottomNavigation.tsx
│       └── MobileLayout.tsx
├── lib/                  # Utility functions and configurations
│   ├── firebase.ts       # Firebase configuration
│   └── auth.ts           # Authentication utilities
├── types/                # TypeScript type definitions
│   └── layout.ts         # Layout-related types
└── styles/              # Additional styles
    └── tailwind.css     # Tailwind CSS imports
```

## Page Descriptions

### Authentication Pages ✅
1. **Login Page** (`/`) ✅
   - Email/password login form
   - Role-based redirection
   - Error handling
   - "Forgot Password" link

2. **Forgot Password** (`/forgot-password`) ✅
   - Email input for password reset
   - Success/error messages
   - Return to login link

3. **Reset Password** (`/reset-password`) ✅
   - New password form
   - Token validation
   - Password requirements
   - Success confirmation

4. **User Invitation** (`/invite`) ✅
   - Email input
   - Role selection
   - Invitation sending
   - Success confirmation

5. **Accept Invitation** (`/accept-invite/[token]`) ✅
   - Token validation
   - Account creation form
   - Password setup
   - Success redirection

### Dashboard Pages
1. **Main Dashboard** (`/dashboard`) ✅
   - Role-based rendering (Admin/Rep)
   - Quick stats
   - Recent activity
   - Maintenance alerts
   - Pull-to-refresh

2. **Vehicles** (`/vehicles`) 🚧
   - Vehicle list view
   - Status filters
   - Search functionality
   - Add vehicle button

3. **Vehicle Details** (`/vehicles/[id]`) 🚧
   - Vehicle information
   - Status management
   - Maintenance history
   - Assignment history
   - Action buttons

4. **Customers** (`/customers`) 🚧
   - Customer list view ✅
   - Search functionality
   - Add customer button ✅
   - Sharing options

5. **Customer Details** (`/customers/[id]`) 🚧
   - Customer information
   - Assigned vehicles
   - Sharing settings
   - Action buttons

6. **Users** (`/users`) - Admin Only ✅
   - User list view
   - Role management
   - Invite users
   - User actions

7. **Settings** (`/settings`) ✅
   - Profile management
   - Theme preferences
   - Notification settings
   - Account management

### API Routes ✅
1. **Auth API** (`/api/auth/[...firebase auth]`) ✅
   - Authentication endpoints
   - Session management
   - Token handling

## Development Phases

### Phase 1: Core Infrastructure and Authentication ✅
- [x] Set up Next.js project with TypeScript
- [x] Configure Tailwind CSS and shadcn/ui
- [x] Set up Firebase project
- [x] Implement authentication with Firebase Auth
- [x] Create protected routes
- [x] Set up user roles (admin, representative)
- [x] Create login page
- [x] Implement session management

### Phase 2: Vehicle Management System 🚧
### Vehicle List View ✅
- [x] Create vehicle list page
- [x] Implement vehicle cards with status indicators
- [x] Add status filter functionality
- [x] Add search functionality
- [x] Implement role-based access control
- [x] Add loading states
- [x] Add error handling
- [x] Implement responsive design
- [x] Add dark mode support

### Add Vehicle Form ✅
- [x] Create add vehicle modal
- [x] Implement form validation
- [x] Add required fields:
  - [x] Vehicle Descriptor
  - [x] Source (Jay/Avis)
  - [x] Initial Mileage
- [x] Add optional fields:
  - [x] Color
  - [x] VIN
  - [x] License Plate
  - [x] State
  - [x] Registration Expiration
  - [x] Notes
- [x] Add Avis-specific fields:
  - [x] MVA Number
  - [x] Return Date
- [x] Implement oil change settings
- [x] Add form validation
- [x] Add loading states
- [x] Add error handling
- [x] Implement responsive design
- [x] Add dark mode support

### Vehicle Details Page 🚧
- [ ] Create vehicle details page layout
- [ ] Implement vehicle information display:
  - [ ] Basic information section
  - [ ] Status history
  - [ ] Service history
  - [ ] Customer history
- [ ] Add edit functionality:
  - [ ] Edit basic information
  - [ ] Update status
  - [ ] Add service record
  - [ ] Add customer assignment
- [ ] Implement role-based access control
- [ ] Add loading states
- [ ] Add error handling
- [ ] Implement responsive design
- [ ] Add dark mode support

### Edit Vehicle Form 🚧
- [ ] Create edit vehicle modal
- [ ] Reuse form components from add vehicle
- [ ] Pre-populate form with existing data
- [ ] Add validation
- [ ] Add loading states
- [ ] Add error handling
- [ ] Implement responsive design
- [ ] Add dark mode support

## Phase 3: Customer Management System 📅
### Customer List View
- [ ] Create customer list page
- [ ] Implement customer cards
- [ ] Add search functionality
- [ ] Add filter functionality
- [ ] Implement role-based access control
- [ ] Add loading states
- [ ] Add error handling
- [ ] Implement responsive design
- [ ] Add dark mode support

### Add Customer Form
- [ ] Create add customer modal
- [ ] Add required fields:
  - [ ] Name
  - [ ] Email
  - [ ] Phone
- [ ] Add optional fields:
  - [ ] Address
  - [ ] Notes
- [ ] Add form validation
- [ ] Add loading states
- [ ] Add error handling
- [ ] Implement responsive design
- [ ] Add dark mode support

### Customer Details Page
- [ ] Create customer details page layout
- [ ] Implement customer information display
- [ ] Add vehicle assignment history
- [ ] Add edit functionality
- [ ] Implement role-based access control
- [ ] Add loading states
- [ ] Add error handling
- [ ] Implement responsive design
- [ ] Add dark mode support

## Phase 4: Service Management System 📅
### Service List View
- [ ] Create service list page
- [ ] Implement service cards
- [ ] Add filter functionality
- [ ] Add search functionality
- [ ] Implement role-based access control
- [ ] Add loading states
- [ ] Add error handling
- [ ] Implement responsive design
- [ ] Add dark mode support

### Add Service Form
- [ ] Create add service modal
- [ ] Add required fields:
  - [ ] Service Type
  - [ ] Date
  - [ ] Cost
- [ ] Add optional fields:
  - [ ] Notes
  - [ ] Technician
- [ ] Add form validation
- [ ] Add loading states
- [ ] Add error handling
- [ ] Implement responsive design
- [ ] Add dark mode support

## Phase 5: Reporting and Analytics 📅
- [ ] Create dashboard page
- [ ] Implement key metrics:
  - [ ] Total vehicles
  - [ ] Available vehicles
  - [ ] Vehicles in use
  - [ ] Vehicles in maintenance
- [ ] Add charts and graphs
- [ ] Add date range filters
- [ ] Implement role-based access control
- [ ] Add loading states
- [ ] Add error handling
- [ ] Implement responsive design
- [ ] Add dark mode support

## Phase 6: Testing and Deployment 📅
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Perform security audit
- [ ] Optimize performance
- [ ] Deploy to production
- [ ] Monitor and maintain

## Current Status
- ✅ Project initialized with Next.js and TypeScript
- ✅ Tailwind CSS configured with custom colors
- ✅ Firebase project set up and configured
- ✅ Authentication context created
- ✅ Base UI components implemented
- ✅ Layout components completed
- ✅ Login page simplified with a placeholder logo in the public folder
- ✅ Firebase configuration updated with correct values

## Next Steps 🚧
1. Complete customer management features
2. Implement customer sharing functionality
3. Add customer detail views
4. Set up customer activity logging
5. Add customer analytics
6. Implement customer import/export
7. Add customer notifications
8. Set up customer reports
9. Add customer preferences
10. Implement customer history

## Notes
- Customer management is currently in progress 🚧
- Firestore rules have been updated to support customer operations ✅
- Customer sharing functionality is being implemented 🚧
- Customer detail views are being designed 🚧
- Customer activity logging is being set up 🚧
- Customer analytics are being planned 🚧
- Customer import/export is being considered 🚧
- Customer notifications are being designed 🚧
- Customer reports are being planned 🚧
- Customer preferences are being considered 🚧

# Implementation Plan

## 1. Authentication & Authorization ✅
- [x] Set up firebase auth with Firebase
- [x] Configure email/password authentication
- [x] Implement role-based access control
- [x] Create protected routes
- [x] Set up session management
- [x] Implement login/logout functionality

## 2. Dashboard Implementation 🚧
- [ ] Implement Admin Dashboard
  - [ ] Set up data fetching hooks
    - [ ] `useVehicleCounts` - Fetch counts by status
    - [ ] `useMaintenanceAlerts` - Fetch maintenance alerts
    - [ ] `useRecentActivity` - Fetch recent activity
  - [ ] Implement click handlers
    - [ ] Vehicle count click → Navigate to filtered list
    - [ ] Maintenance alert click → Navigate to vehicle detail
    - [ ] Recent activity click → Show full activity list
  - [ ] Add pull-to-refresh functionality
  - [ ] Implement loading states
  - [ ] Add error handling

- [ ] Implement Rep Dashboard
  - [ ] Set up data fetching hooks
    - [ ] `useAssignedVehicles` - Fetch vehicles assigned to rep
    - [ ] `useProspectingVehicle` - Fetch current prospecting vehicle
    - [ ] `useMaintenanceAlerts` - Fetch maintenance alerts
  - [ ] Implement click handlers
    - [ ] Vehicle card click → Navigate to detail
    - [ ] Status badge click → Show status change modal
    - [ ] Maintenance alert click → Navigate to detail
  - [ ] Add pull-to-refresh functionality
  - [ ] Implement loading states
  - [ ] Add error handling

## 3. Vehicle Management 🚧
- [ ] Create vehicle list view
- [ ] Implement vehicle detail page
- [ ] Add vehicle creation form
- [ ] Set up vehicle status management
- [ ] Implement maintenance tracking
- [ ] Add vehicle assignment functionality

## 4. Customer Management 🚧
- [x] Create customer list view
- [ ] Implement customer detail page
- [x] Add customer creation form
- [x] Set up customer sharing
- [ ] Implement customer-vehicle assignments

## 5. User Management (Admin Only) ✅
- [x] Create user list view
- [x] Implement user invitation system
- [x] Add role management
- [x] Set up user deactivation
- [x] Implement user activity tracking

## 6. Settings & Configuration ✅
- [x] Create settings page
- [x] Implement theme switching
- [x] Add user preferences
- [x] Set up system configuration
- [x] Implement notification settings

## 7. Mobile Optimization ✅
- [x] Implement responsive design
- [x] Add touch interactions
- [x] Optimize for mobile performance
- [x] Set up PWA features
- [x] Implement offline support

## 8. Testing & Quality Assurance 🚧
- [x] Set up unit tests
- [x] Implement integration tests
- [ ] Add end-to-end tests
- [x] Perform security testing
- [x] Conduct performance testing

## 9. Deployment & DevOps ✅
- [x] Set up CI/CD pipeline
- [x] Configure production environment
- [x] Implement monitoring
- [x] Set up error tracking
- [x] Configure backup system

## 10. Documentation & Training 🚧
- [x] Create user documentation
- [x] Write technical documentation
- [ ] Prepare training materials
- [ ] Set up help system
- [ ] Create maintenance guides

## Current Focus 🚧
- Implementing customer management features
- Setting up Firestore security rules for customer data
- Building customer sharing functionality
- Implementing customer detail views
- Adding customer activity logging

## Next Steps 🚧
1. Complete customer management features
2. Implement customer sharing functionality
3. Add customer detail views
4. Set up customer activity logging
5. Add customer analytics
6. Implement customer import/export
7. Add customer notifications
8. Set up customer reports
9. Add customer preferences
10. Implement customer history

## Recent Updates
- ✅ Updated login pages to use placeholder titles
- ✅ Added profile icon with dropdown menu in header
- ✅ Implemented session loading states
- ✅ Added error handling for authentication
- ✅ Improved header component with dynamic titles
- ✅ Enhanced mobile responsiveness
- ✅ Added dark mode support for all components

## Notes
- Login pages now use generic placeholder text
- Session loading states are properly handled
- Profile icon is only shown on authenticated pages
- Header component supports dynamic titles
- Dark mode is consistently applied across components
- Mobile responsiveness has been improved
- Error handling has been enhanced

# Trident Fleet App Implementation Plan

## Current Progress

### Completed Features ✅
1. Authentication System
   - firebase auth integration with Firebase
   - JWT-based session management
   - Role-based access control (admin/rep)
   - Secure login/logout flow
   - Placeholder login pages implemented
   - Session loading states handled 
   - Error handling for authentication

2. Customer Management
   - Customer list view with grid layout
   - Add new customers with basic info (name, email, phone)
   - Share customers with team members
   - Delete customers (with vehicle assignment check)
   - Empty state with interactive tutorial
   - Dark mode support

3. UI Components
   - Modern, responsive design
   - Consistent button styles
   - Modal system for forms
   - Toast notifications
   - Loading states
   - Error handling
   - Profile icon with dropdown menu
   - Header component with dynamic titles

### In Progress 🚧
1. Vehicle Management
   - Vehicle list view
   - Vehicle status tracking
   - Check in/out system
   - Maintenance tracking

2. User Management
   - User roles and permissions
   - Team collaboration features
   - User profile management

### Next Steps 🚧
1. Vehicle Features
   - Implement vehicle list view
   - Add vehicle status management
   - Create check in/out workflow
   - Set up maintenance tracking

2. Enhanced Customer Features
   - Customer history tracking
   - Vehicle assignment history
   - Customer notes and comments
   - Bulk operations

3. Reporting
   - Vehicle utilization reports
   - Customer activity reports
   - Maintenance schedules
   - Team performance metrics

## Technical Implementation

### Frontend ✅
- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Lucide icons for consistent iconography
- Responsive design patterns

### Backend ✅
- Firebase Authentication
- Firestore for data storage
- Real-time updates
- Security rules implementation

### Data Models ✅

#### Customer
```typescript
interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  primaryOwnerId: string;
  additionalOwnerIds: string[];
  assignedVehicles?: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### Vehicle
```typescript
interface Vehicle {
  id: string;
  name: string;
  status: VehicleStatus;
  mileage: number;
  lastServiceDate?: string;
  currentCustomerId?: string;
  assignedTo?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'rep';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## Security Considerations ✅
- Role-based access control
- Data ownership validation
- Secure session management
- Input validation
- Error handling

## Performance Optimization ✅
- Efficient data fetching
- Optimistic updates
- Caching strategies
- Lazy loading
- Code splitting

## Testing Strategy 🚧
- Unit tests for components
- Integration tests for workflows
- E2E tests for critical paths
- Performance testing
- Security testing

## Deployment ✅
- Vercel for hosting
- CI/CD pipeline
- Environment configuration
- Monitoring setup
- Backup strategy

## Recent Changes and Improvements
1. Enhanced customer editing functionality:
   - Improved phone number field validation
   - Added support for empty phone numbers
   - Implemented real-time formatting
   - Fixed history tracking issues
   - Added local state management for better UX

2. Security and Permissions:
   - Updated Firestore rules for customer history
   - Improved permission checks for customer operations
   - Enhanced error handling for unauthorized actions

3. User Experience:
   - Streamlined customer detail page layout
   - Improved action button placement
   - Enhanced mobile responsiveness
   - Added better error feedback

## Next Steps
1. Complete remaining customer management features
2. Enhance vehicle management system
3. Improve user management functionality
4. Implement remaining maintenance features
5. Begin mobile app development
6. Set up comprehensive testing
7. Prepare for launch

## Notes
- Regular security audits needed
- Performance monitoring in place
- User feedback being collected
- Documentation being updated
- Support system being enhanced