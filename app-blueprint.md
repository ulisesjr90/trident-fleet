# Trident Fleet App Blueprint

## Overview
A comprehensive fleet management application for managing vehicles, customers, and related operations. Designed for small-scale operations with up to 30 active vehicles and 6+ users.

## Technology Stack
- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Firebase/Firestore (Spark Plan)
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage
- **State Management**: Zustand
- **Forms**: React Hook Form
- **Data Fetching**: React Query
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
  - Font: Inter
  - Sizes: 14px (base), 16px (large), 20px (xlarge)
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

### Button Styles
- **Primary Button**
  - Background: Primary color
  - Text: White
  - Height: 40px
  - Padding: 16px 24px
  - Border radius: 8px
  - Used for main actions

- **Accent Button**
  - Background: Accent color
  - Text: Dark
  - Height: 40px
  - Padding: 16px 24px
  - Border radius: 8px
  - Used for secondary actions

- **Danger Button**
  - Background: Error color
  - Text: White
  - Height: 40px
  - Padding: 16px 24px
  - Border radius: 8px
  - Used for Cancel/Delete

- **Button Pairs**
  - Primary + Accent for main actions
  - Primary + Danger for destructive actions
  - Consistent spacing between buttons
  - Full width on mobile

### Form Styles
- **Input Fields**
  - Height: 40px
  - Border: 1px solid
  - Border radius: 8px
  - Padding: 8px 12px
  - Full width
  - No parent layout constraints

- **Labels**
  - Font size: 14px
  - Font weight: 500
  - Margin bottom: 8px
  - Direct child styling

- **Form Groups**
  - Margin bottom: 24px
  - No parent layout constraints
  - Direct child styling

- **Error States**
  - Border color: Error
  - Error message below input
  - Font size: 12px
  - Color: Error

- **Success States**
  - Border color: Success
  - No additional indicators

## Application Structure

### Error Handling & Validation
- **Frontend-First Approach**
  - All validation handled in UI
  - Simple error messages
  - Clear user feedback

- **Error States**
  - Firebase Unavailable
    - Show message at top of app
    - "Service temporarily unavailable"
    - No retry logic
  - Offline State
    - Show "Offline" indicator at top of app
    - No offline functionality
  - Operation Failed
    - Return to beginning
    - Show error message
    - No complex recovery

- **Loading States**
  - Skeleton Loaders
    - Standard Field Sizes
      - Title: 24px height, 60% width
      - Subtitle: 16px height, 40% width
      - Body text: 14px height, 80% width
      - Small text: 12px height, 30% width
      - Avatar: 40px x 40px
      - Icon: 24px x 24px
    - Vehicle Cards
      - Image: 200px x 120px
      - Title: Standard title size
      - Details: 3 lines of body text
      - Status badge: 24px height, 100px width
    - Customer Cards
      - Avatar: Standard avatar size
      - Name: Standard title size
      - Contact: 2 lines of body text
      - Actions: 3 standard icon sizes
    - Tables
      - Header: Standard title size
      - Rows: Standard body text size
      - Actions: Standard icon size
    - Lists
      - Items: Standard body text size
      - Icons: Standard icon size
    - Forms
      - Labels: Standard subtitle size
      - Inputs: 40px height, full width
      - Buttons: 40px height, 120px width
  - Simple spinner for:
    - Status changes
    - Vehicle assignments
    - Customer creation
    - Archive operations
  - No complex loading states

- **Error Tracking**
  - Sentry for error reporting
  - No additional analytics
  - No custom logging

- **Security**
  - Basic Firebase Auth
  - Role-based access
  - No additional complexity

- **Data Consistency**
  - Frontend validation only
  - No complex race condition handling
  - Simple optimistic updates

- **Failure Handling**
  - On any failure:
    - Show error message
    - Return to previous state
    - No partial updates
    - No complex recovery

### Form Validation
- **Vehicle Creation**
  - Required: Vehicle Descriptor only
  - Optional: All other fields
- **Customer Creation**
  - Required: Name only
  - Optional: All other fields
- **Validation Feedback**
  - Simple error messages
  - Basic form validation
  - Clear success/error states

### Mobile Experience
- **Safe Area & Notch Handling**
  - Respect iPhone notch area
  - Use safe-area-inset-top for header
  - Use safe-area-inset-bottom for navigation
  - Content scrolls under notch
  - Status bar text adapts to theme

- **Standalone App Behavior**
  - Full-screen mode
  - No browser chrome
  - Home screen icon
  - Splash screen
  - Native-like feel

- **Mobile Navigation**
  - Bottom navigation bar
    - Fixed position
    - 4-5 main items (role-based)
    - Active state indicator
    - Haptic feedback on tap
    - Icons only (no labels)
  - Navigation Items
    - Dashboard (Home icon)
    - Vehicles (Car icon)
    - Customers (Users icon)
    - Users (UserCog icon) - Admin only
    - Settings (Gear icon)
  - No sidebar on mobile
  - Quick actions in bottom sheet

- **Mobile Features**
  - Swipe to refresh lists
  - Pull to refresh
  - Touch-friendly targets (min 44px)
  - Haptic feedback on actions
  - Bottom sheet for modals
  - Native-like scrolling

- **Mobile Optimizations**
  - Card-based layout
  - Stacked information
  - Simplified actions
  - Touch-friendly buttons
  - Responsive tables
  - Bottom sheet for modals
  - Native-like scrolling

### Data Display
- **Dates**
  - Format: MM/DD/YYYY
  - Time: 12-hour format (AM/PM)
  - Central Time (Killeen, TX)

- **Numbers**
  - Mileage: With commas and "miles" (e.g., "1,234 miles")
  - Phone: (XXX) XXX-XXXX
  - Currency: USD with $ symbol

- **Status Indicators**
  - Color-coded badges
  - Simple icons
  - Clear labels

### Vehicle Details
- **Basic Info**
  - Vehicle Descriptor
  - Color
  - Source (Jay/Avis)
  - VIN
  - License Plate
  - State
  - Registration Expiration

- **Avis Specific**
  - MVA Number
  - Return Date

- **Status & Maintenance**
  - Current Status
  - Current Mileage
  - Next Oil Change Due
  - Maintenance History

### Dashboard Data
- **Real-time Updates**
  - Vehicle counts
  - Maintenance alerts
  - Status changes
  - Recent activity

- **Data Triggers**
  - Status changes
  - Maintenance updates
  - Customer assignments
  - Vehicle assignments

- **Refresh Behavior**
  - Manual refresh (swipe/pull)
  - No auto-refresh
  - No background polling

### Deployment
- Local development environment
- Direct deployment to Firebase hosting
- Version control via GitHub
- No separate staging environment
- Deploy when ready
- No complex deployment process

### Data Models

#### Vehicle
```typescript
interface Vehicle {
  id: string;
  vehicleDescriptor: string;  // Only required field
  color?: string;
  source?: 'Jay' | 'Avis';
  vin?: string;
  licensePlate?: string | null;
  state?: string | null;
  registrationExpiration?: Timestamp;
  status: VehicleStatus;
  currentMileage?: number;
  nextOilChangeDueMileage?: number;
  assignedTo?: string | null;
  customerId?: string | null;
  notes?: string;
  isArchived: boolean;
  archivedAt?: Timestamp;
  archivedBy?: string;
  archiveReason?: string;
  mvaNumber?: string;
  returnDate?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### Customer
```typescript
interface Customer {
  id: string;
  name: string;  // Only required field
  email?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  primaryOwnerId: string;
  additionalOwnerIds: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Root Level Features
- **Theme Management**
  - Light/Dark mode toggle
  - System preference detection
  - Theme persistence
  - Root-level theme provider
  - Consistent theming across all components
  - Design System Consistency
    - Button Styles
      - Primary
      - Secondary
      - Destructive
      - Ghost
      - Link
      - Consistent hover/active states
    - Color Palette
      - Primary colors
      - Secondary colors
      - Accent colors
      - Semantic colors (success, warning, error)
      - Background colors
      - Text colors
    - Typography
      - Font families
      - Font sizes
      - Font weights
      - Line heights
      - Letter spacing
  - Responsive Theming
    - Desktop-specific styles
      - Larger touch targets
      - Hover states
      - Complex interactions
    - Mobile-specific styles
      - Touch-friendly sizing
      - Simplified interactions
      - Optimized spacing
    - Breakpoint management
      - Consistent breakpoints
      - Theme-aware responsive design
- **PWA Features**
  - Basic PWA Support
    - Home screen installation (Safari)
    - App icon
    - Splash screen
  - Responsive Design
    - Works in both browser and home screen
    - Touch-friendly interface
    - Mobile-optimized layout

### Authentication & User Management

#### Shared Authentication Pages
  - Email/password authentication
  - Role-based redirection
  - Session management
  - "Forgot Password" link

- **Forgot Password** (`/auth/forgot-password`)
  - Email verification
  - Password reset flow
  - Security notifications

- **Reset Password** (`/auth/reset-password`)
  - Token validation
  - New password setup
  - Password requirements
  - Success confirmation

#### Registration Flow
- **Email Invitation** (`/auth/invite`)
  - **On Load**
    - Validate invitation token
    - Check expiration
  - **Triggers**
    - Email input → Validate format
    - Role selection → Update form
    - Submit → Send invitation
    - Success → Show confirmation
    - Failure → Show error message

- **Accept Invitation** (`/auth/accept-invite/[token]`)
  - **On Load**
    - Validate token
    - Check expiration
    - Pre-fill email
  - **Triggers**
    - Password input → Show/hide password
    - Confirm password → Match validation
    - Submit → Create account
    - Success → Redirect to dashboard already logged in
    - Failure → Show error message

#### Admin Pages
- **Admin Dashboard** (`/admin/dashboard`)
  - Vehicle Statistics
    - Total Cars
    - Available Cars
    - Cars with Customers
    - Cars in Maintenance
    - Prospecting Cars
    - Expandable Details
      - List of available vehicles
      - List of vehicles with customers
      - List of vehicles in maintenance
      - List of prospecting vehicles
  - Dashboard Components
    - Oil Change Due
      - Count of vehicles needing oil changes
      - Expandable list with mileage details
    - Registration Status
      - Count of vehicles with expiring registrations
      - Expandable list with expiry dates
    - Avis Returns
      - Count of vehicles due for return
      - Expandable list with return dates
  - Quick Actions
    - Add new vehicle
    - Assign vehicle
    - Create maintenance task
  - Recent Activity
    - Latest vehicle assignments
    - Status changes
    - Maintenance updates
    - Expandable Details
      - Full activity list with timestamps
      - Filter by activity type
      - Filter by date range

- **User Management** (`/admin/users`)
  - Table View
    - User Information
      - Name
      - Email
    - Role Information
      - Role (admin/rep)
    - Status Information
      - Status (Active/Inactive)
    - Actions
      - Change Role (admin/rep)
      - Deactivate/Activate
      - Delete User
  - Quick Actions
    - Invite User Button
      - Opens Invite Modal
      - Email input
      - Role selection
      - Send invitation via work email template
  - Table Features
    - Inline Column Sorting
    - Simple Filters
      - By Role
      - By Status
  - User Actions Modal
    - Role Management
      - Change to Admin
      - Change to Rep
    - Status Management
      - Deactivate User
      - Activate User
    - Account Management
      - Delete User
      - View Activity

- **Invitations** (`/admin/invitations`)
  - Send new invitations
  - Track invitation status
  - Role assignment
  - Expiration management
  - Resend invitations
  - Cancel pending invitations

#### Rep Pages
- **Rep Dashboard** (`/rep/dashboard`)
  - Vehicle Management
    - Available Vehicles
    - In Maintenance
    - My Vehicles (assigned to you)
  - Assignment Overview
    - My Prospecting Vehicle (single vehicle)
    - Customer Vehicles (multiple assignments)
  - Maintenance Alerts
    - Registration Expiring Soon
    - Oil Change Needed
    - Avis Return Due
  - Quick Actions
    - Assign Vehicle
    - Update Status
    - Record Maintenance

### Customer Management

#### Admin Pages
- **Customers List** (`/admin/customers`)
  - Table View
    - Customer Information
      - Name
      - Email
      - Phone
    - Ownership Information
      - Primary Owner (can have multiple owners per customer)
      - Shared Owners
    - Vehicle Information
      - Vehicle Count
      - Vehicle Status
    - Document Information
      - Document Count (e.g., 2/3)
    - Metadata
      - Created Date
    - Actions
      - Edit Customer
      - View Details
      - Manage Owners
      - View Vehicles
  - Quick Actions
    - Add New Customer
      - Simple form with name only
      - Optional fields (can be added later):
        - Email
        - Phone
        - Notes
      - Auto-assigns to creator as primary owner
      - Success notification
    - Share Customer
      - Select user to share with
      - Sharing permissions:
        - Can view customer
        - Can edit customer
        - Can assign vehicles
        - Can manage other shared owners
      - Notification to shared user
      - Audit log of sharing
    - Export Data
  - Table Features
    - Inline Column Sorting
    - Simple Filters
      - By Primary Owner
      - By Vehicle Status
      - By Shared Owners

#### Rep Pages
- **Customers List** (`/rep/customers`)
  - Assigned customers only
  - Basic customer information
  - Quick Actions
    - Add New Customer
      - Simple form with name only
      - Optional fields (can be added later):
        - Email
        - Phone
        - Notes
      - Auto-assigns to creator as primary owner
      - Success notification
    - Share Customer
      - Select user to share with
      - Sharing permissions:
        - Can view customer
        - Can edit customer
        - Can assign vehicles
      - Notification to shared user
      - Audit log of sharing

- **Customer Detail** (`/rep/customers/[id]`)
  - View customer information
  - Basic updates

### Vehicle Management

#### Admin Pages
- **Vehicles List** (`/admin/vehicles`)
  - Table View
    - Vehicle Information
      - Make, Model, Year, Color
      - Source (Jay or Avis)
    - Status Information
      - Status (Primary Status Only)
    - Driver Information
      - Current Driver
    - Maintenance Information
      - Current Mileage
      - Miles Until Oil Change
    - Registration Information
      - Registration Expiry
      - Due Date
      - License Plate
    - Actions
      - Edit Vehicle
      - Assign/Unassign
      - Update Status
      - Maintenance Records
      - View History
      - Archive/Unarchive (Admin only)

- **Add New Vehicle**
  - Required Fields
    - Vehicle Descriptor
    - Initial Mileage
    - Source (Jay/Avis)
  - Optional Fields
    - Color
    - VIN
    - License Plate
    - State
    - Registration Expiration
    - Notes
  - Oil Change Settings
    - Default: Next oil change at (initial mileage + 5000)
    - Optional: Set custom next oil change mileage
    - Warning at 1000 miles remaining
    - Overdue message if past due

- **Vehicle Detail** (`/admin/vehicles/[id]`)
  - Vehicle information
  - Maintenance records
  - Assignment history
  - Status management
  - Archive/Unarchive action (Admin only)
  - Archive history (if archived)

- **Vehicle Assignment** (`/admin/vehicles/[id]/assign`)
  - Assign to customers
  - Assign to staff
  - Schedule management

- **Vehicle Events** (`/admin/vehicles/[id]/events`)
  - Status change history
  - Maintenance history
  - Timeline view

#### Rep Pages
- **Vehicles List** (`/rep/vehicles`)
  - **On Load**
    - Fetch available vehicles
    - Fetch vehicles assigned to current rep
    - Apply default filters
  - **Triggers**
    - Click vehicle card → Navigate to vehicle detail
    - Click status badge → Show status change modal (only for assigned vehicles)
    - Click assign → Show assignment modal (only for available vehicles)
    - Filter change → Update vehicle list

- **Vehicle Detail** (`/rep/vehicles/[id]`)
  - **On Load**
    - Fetch vehicle details
    - Fetch vehicle events
    - Fetch maintenance history
  - **Triggers**
    - Click status badge → Show status modal (only for assigned vehicles)
    - Click maintenance → Show maintenance modal (only for assigned vehicles)
    - Click assign → Show assignment modal (only if vehicle is available)
  - **View-only mode for:**
    - Vehicle information
    - Maintenance history
    - Assignment history

### Task System

#### Admin Pages
- **Tasks Dashboard** (`/admin/tasks`)
  - Task overview
  - Priority management
  - Assignment interface
  - Status tracking

- **Task Creation** (`/admin/tasks/create`)
  - Task details
  - Assignment
  - Priority setting
  - Due date management

#### Rep Pages
- **Tasks Dashboard** (`/rep/tasks`)
  - Personal tasks
  - Status updates
  - Due date tracking

### Reports & Analytics (Admin Only)

- **Fleet Overview** (`/admin/reports/fleet`)
  - Vehicle utilization
  - Status distribution
  - Maintenance schedule

- **Customer Activity** (`/admin/reports/customers`)
  - Customer engagement
  - Document status
  - Activity timeline

- **Maintenance Reports** (`/admin/reports/maintenance`)
  - Scheduled maintenance
  - Service history
  - Cost tracking

### Settings

#### Admin Pages
- **System Settings** (`/admin/settings`)
  - Document types
  - User roles
  - System preferences

- **UI Preferences** (`/admin/settings/ui`)
  - Theme settings
  - Layout preferences
  - Notification settings

#### Rep Pages
- **Personal Settings** (`/rep/settings`)
  - Profile management
  - UI preferences
  - Notification settings

### Settings Pages

#### Admin Settings (`/admin/settings`)
- **Profile Section**
  - Name
  - Email (read-only)
  - Role (read-only)
  - Profile picture (optional)

- **App Settings**
  - Theme toggle (Light/Dark)
  - Language (English only)

- **Account Management**
  - Change password
  - Session management
  - Logout

#### Rep Settings (`/rep/settings`)
- **Profile Section**
  - Name
  - Email (read-only)
  - Role (read-only)
  - Profile picture (optional)

- **App Settings**
  - Theme toggle (Light/Dark)
  - Language (English only)

- **Account Management**
  - Change password
  - Session management
  - Logout

### Settings Behavior
- **Profile Updates**
  - Inline editing
  - Auto-save on blur
  - Simple validation

- **Theme Changes**
  - Immediate application
  - Persists across sessions
  - System preference detection
  - Manual override

- **Password Changes**
  - Simple requirements
  - Current password verification
  - New password confirmation
  - Success notification

- **Session Management**
  - View active sessions
  - Logout from all devices
  - Simple session list

## Shared Components

### Navigation
- **Desktop Navigation**
  - Collapsible Sidebar
    - Toggle button to expand/collapse
    - Icons-only view when collapsed
    - Full text + icons when expanded
    - Active state indicators
    - Role-based menu items
    - Sticky positioning

- **Mobile Navigation**
  - Bottom Navigation Bar
    - Fixed position
    - 4-5 main items (role-based)
    - Active state indicator
    - Haptic feedback on tap
  - Navigation Items
    - Dashboard (Home icon)
    - Vehicles (Car icon)
    - Customers (Users icon)
    - Users (UserCog icon) - Admin only
    - Settings (Gear icon)
  - No sidebar on mobile
  - Quick actions in bottom sheet

### Notifications
- Task notifications
- Document approval alerts
- Maintenance reminders
- System notifications

### Search
- Global search interface
- Advanced filtering
- Recent searches
- Search history

### Dashboard Widgets
- Tasks due today
- Vehicles needing maintenance
- Recent customer activity
- Document pending verification

### Status & Assignment Flow
- **Vehicle Statuses**
  - Available
    - Flow: Can be assigned to customer or prospecting
    - Required: 
      - Mileage update (can be overridden with warning)
    - Review: 
      - Confirm status change
      - Verify mileage
  - With Customer
    - Flow: Assigned to a customer
    - Required: 
      - Mileage update (can be overridden with warning)
      - Customer selection:
        - Choose from existing customers
        - Create new customer
    - Review:
      - Confirm customer assignment
      - Verify mileage
  - Prospecting
    - Flow: Assigned to rep for prospecting
    - Required: 
      - Mileage update (can be overridden with warning)
      - Rep selection
    - Review:
      - Confirm rep assignment
      - Verify mileage
  - Maintenance
    - Flow: In maintenance or repair
    - Required: 
      - Mileage update (can be overridden with warning)
      - Maintenance type:
        - Oil Change (resets next oil change counter)
        - Other Maintenance (free text description)
    - Review:
      - Confirm maintenance type
      - Verify mileage
  - Unavailable
    - Flow: Not available for assignment
    - Required: 
      - Mileage update (can be overridden with warning)
      - Reason
    - Review:
      - Confirm reason
      - Verify mileage
  - Archived
    - Flow: Vehicle is no longer in active use
    - Required:
      - Archive reason
      - Final mileage update
    - Review:
      - Confirm archive reason
      - Verify final mileage
    - Note: Can only be archived from Available or Unavailable status
    - Note: Archived vehicles can be unarchived by admins only

- **Status Change**
  - Simple modal with:
    - Current status
    - New status
    - Mileage input (with override warning)
    - Required fields for new status
  - Review step before commit
  - Admin can override any status
  - Reps follow standard flows

- **Timeline Output**
  - Each status change creates a timeline entry
  - Accessible in vehicle details page
  - Entry includes:
    - New status
    - Mileage at change
    - Timestamp
    - User who made change
    - Additional details (customer, maintenance type, etc.)
  - Entries are chronological
  - Previous status can be inferred from sequence

## Data Models

### Customer
```typescript
interface Customer {
  id: string;
  name: string;  // Combined name field
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  primaryOwnerId: string;
  additionalOwnerIds: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Vehicle
```typescript
enum VehicleStatus {
  Available = 'Available',
  WithCustomer = 'With Customer',
  Prospecting = 'Prospecting',
  Maintenance = 'Maintenance',
  Unavailable = 'Unavailable',
  Archived = 'Archived'
}

interface Vehicle {
  id: string;
  vehicleDescriptor: string;
  color: string;
  source: 'Jay' | 'Avis';
  vin: string;
  licensePlate: string | null;
  state: string | null;
  registrationExpiration: Timestamp;
  status: VehicleStatus;
  currentMileage: number;
  nextOilChangeDueMileage: number;
  assignedTo: string | null;  // Single user ID (rep/admin) or null if Available
  customerId: string | null;
  notes: string;
  isArchived: boolean;  // Archived vehicles are hidden from active views
  archivedAt?: Timestamp;  // When the vehicle was archived
  archivedBy?: string;  // User ID who archived the vehicle
  archiveReason?: string;  // Why the vehicle was archived
  // Avis specific fields
  mvaNumber?: string;
  returnDate?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Task
```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  isHighPriority: boolean;
  assignedTo: string[];
  createdBy: string;
  entityType: string;
  entityId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Vehicle Events
```typescript
interface VehicleEvent {
  id: string;
  vehicleId: string;
  type: 'status_change' | 'maintenance' | 'assignment' | 'archive' | 'unarchive';
  newStatus: VehicleStatus;
  mileage: number;
  timestamp: Timestamp;
  userId: string;  // User who made the change
  // Additional fields based on event type
  maintenanceType?: 'oil_change' | 'other';
  maintenanceDescription?: string;
  customerId?: string;  // Set when status is WithCustomer
  assignedTo?: string;  // Set when status is Prospecting
  archiveReason?: string;  // Set when type is archive
  notes?: string;
}
```

### Customer Sharing
```typescript
interface CustomerSharing {
  id: string;
  customerId: string;
  sharedWithUserId: string;
  permissions: {
    canView: boolean;
    canEdit: boolean;
    canAssign: boolean;
    canManageSharing: boolean;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Invitations
```typescript
interface Invitation {
  id: string;
  email: string;
  role: 'admin' | 'rep';
  status: 'pending' | 'accepted' | 'expired';
  token: string;
  expiresAt: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## Firebase Collections

### Vehicles
```typescript
enum VehicleStatus {
  Available = 'Available',
  WithCustomer = 'With Customer',
  Prospecting = 'Prospecting',
  Maintenance = 'Maintenance',
  Unavailable = 'Unavailable',
  Archived = 'Archived'
}

interface Vehicle {
  id: string;
  vehicleDescriptor: string;
  color: string;
  source: 'Jay' | 'Avis';
  vin: string;
  licensePlate: string | null;
  state: string | null;
  registrationExpiration: Timestamp;
  status: VehicleStatus;
  currentMileage: number;
  nextOilChangeDueMileage: number;
  assignedTo: string | null;  // Single user ID (rep/admin) or null if Available
  customerId: string | null;
  notes: string;
  isArchived: boolean;  // Archived vehicles are hidden from active views
  archivedAt?: Timestamp;  // When the vehicle was archived
  archivedBy?: string;  // User ID who archived the vehicle
  archiveReason?: string;  // Why the vehicle was archived
  // Avis specific fields
  mvaNumber?: string;
  returnDate?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Vehicle Events
```typescript
interface VehicleEvent {
  id: string;
  vehicleId: string;
  type: 'status_change' | 'maintenance' | 'assignment' | 'archive' | 'unarchive';
  newStatus: VehicleStatus;
  mileage: number;
  timestamp: Timestamp;
  userId: string;  // User who made the change
  // Additional fields based on event type
  maintenanceType?: 'oil_change' | 'other';
  maintenanceDescription?: string;
  customerId?: string;  // Set when status is WithCustomer
  assignedTo?: string;  // Set when status is Prospecting
  archiveReason?: string;  // Set when type is archive
  notes?: string;
}
```

### Data Retention & Cleanup
- Vehicle history maintained for 1 year
- Archived vehicles retained for 1 year
- Automatic cleanup of old data
  - Remove vehicle events older than 1 year
  - Remove archived vehicles older than 1 year
  - Keep basic vehicle record for reference

## Page Triggers & Actions

### Admin Pages

#### Dashboard (`/admin/dashboard`)
- **On Load**
  - Fetch vehicle counts by status
  - Fetch maintenance alerts
  - Fetch recent activity
- **Triggers**
  - Click on vehicle count → Navigate to filtered vehicle list
  - Click on maintenance alert → Navigate to vehicle detail
  - Click on recent activity → Show full activity list
  - Pull to refresh → Update all counts

#### Vehicles List (`/admin/vehicles`)
- **On Load**
  - Fetch all non-archived vehicles
  - Apply default filters
- **Triggers**
  - Click vehicle card → Navigate to vehicle detail
  - Click status badge → Show status change modal
  - Click assign button → Show assignment modal
  - Click archive button → Show archive confirmation
  - Filter change → Update vehicle list
  - Sort change → Update vehicle list
  - Pull to refresh → Update vehicle list

#### Vehicle Detail (`/admin/vehicles/[id]`)
- **On Load**
  - Fetch vehicle details
  - Fetch vehicle events
  - Fetch maintenance history
- **Triggers**
  - Click field → Enable inline edit
  - Click outside → Save changes
  - Click status badge → Show status modal
  - Click maintenance → Show maintenance modal
  - Click archive → Show archive modal
  - Click unarchive → Show unarchive confirmation
  - Pull to refresh → Update vehicle details

#### Customers List (`/admin/customers`)
- **On Load**
  - Fetch all customers
  - Apply default filters
- **Triggers**
  - Click customer card → Navigate to customer detail
  - Click add customer → Show add customer modal
  - Click share → Show sharing modal
  - Filter change → Update customer list
  - Sort change → Update customer list
  - Pull to refresh → Update customer list

#### Customer Detail (`/admin/customers/[id]`)
- **On Load**
  - Fetch customer details
  - Fetch assigned vehicles
  - Fetch sharing information
- **Triggers**
  - Click field → Enable inline edit
  - Click outside → Save changes
  - Click share → Show sharing modal
  - Click assign vehicle → Show vehicle assignment modal
  - Click remove sharing → Show confirmation
  - Pull to refresh → Update customer details

#### Users List (`/admin/users`)
- **On Load**
  - Fetch all users
  - Apply default filters
- **Triggers**
  - Click invite → Show invite modal
  - Click role change → Show role change modal
  - Click deactivate → Show confirmation
  - Click delete → Show confirmation
  - Pull to refresh → Update user list

#### Settings (`/admin/settings`)
- **On Load**
  - Fetch user profile
  - Fetch app preferences
- **Triggers**
  - Click field → Enable inline edit
  - Click outside → Save changes
  - Theme toggle → Immediate change
  - Password change → Show password modal
  - Logout → Clear session

### Rep Pages

#### Dashboard (`/rep/dashboard`)
- **On Load**
  - Fetch assigned vehicles
  - Fetch prospecting vehicle
  - Fetch maintenance alerts
- **Triggers**
  - Click vehicle card → Navigate to vehicle detail
  - Click status badge → Show status change modal
  - Click maintenance alert → Navigate to vehicle detail
  - Pull to refresh → Update dashboard

#### Vehicles List (`/rep/vehicles`)
- **On Load**
  - Fetch available vehicles
  - Fetch vehicles assigned to current rep
  - Apply default filters
- **Triggers**
  - Click vehicle card → Navigate to vehicle detail
  - Click status badge → Show status change modal (only for assigned vehicles)
  - Click assign → Show assignment modal (only for available vehicles)
  - Filter change → Update vehicle list
  - Pull to refresh → Update vehicle list

#### Vehicle Detail (`/rep/vehicles/[id]`)
- **On Load**
  - Fetch vehicle details
  - Fetch vehicle events
  - Fetch maintenance history
- **Triggers**
  - Click status badge → Show status modal (only for assigned vehicles)
  - Click maintenance → Show maintenance modal (only for assigned vehicles)
  - Click assign → Show assignment modal (only if vehicle is available)
  - Pull to refresh → Update vehicle details

#### Customers List (`/rep/customers`)
- **On Load**
  - Fetch assigned customers
  - Apply default filters
- **Triggers**
  - Click customer card → Navigate to customer detail
  - Click add customer → Show add customer modal
  - Click share → Show sharing modal
  - Filter change → Update customer list
  - Pull to refresh → Update customer list

#### Customer Detail (`/rep/customers/[id]`)
- **On Load**
  - Fetch customer details
  - Fetch assigned vehicles
  - Fetch sharing information
- **Triggers**
  - Click field → Enable inline edit
  - Click outside → Save changes
  - Click share → Show sharing modal
  - Click assign vehicle → Show vehicle assignment modal
  - Pull to refresh → Update customer details

#### Settings (`/rep/settings`)
- **On Load**
  - Fetch user profile
  - Fetch app preferences
- **Triggers**
  - Click field → Enable inline edit
  - Click outside → Save changes
  - Theme toggle → Immediate change
  - Password change → Show password modal
  - Logout → Clear session

### Shared Triggers

#### Status Change Modal
- **On Open**
  - Load current status
  - Load current mileage
- **Triggers**
  - Status selection → Update required fields
  - Mileage input → Validate against last recorded
  - Customer selection → Update customer fields
  - Submit → Create vehicle event and update status

#### Assignment Modal
- **On Open**
  - Load available vehicles
  - Load customer list
- **Triggers**
  - Vehicle selection → Update vehicle details
  - Customer selection → Update customer details
  - Submit → Create assignment event

#### Maintenance Modal
- **On Open**
  - Load current mileage
  - Load maintenance history
- **Triggers**
  - Maintenance type selection → Update required fields
  - Mileage input → Validate against last recorded
  - Submit → Create maintenance event

#### Sharing Modal
- **On Open**
  - Load user list
  - Load current sharing status
- **Triggers**
  - User selection → Update permissions
  - Permission toggle → Update available actions
  - Submit → Update sharing status

### Inline Edit Behavior
- **On Field Click**
  - Show edit cursor
  - Highlight editable field
  - Focus input
- **During Edit**
  - Real-time validation
  - Show error state if invalid
  - Press Enter to save
  - Click outside to auto-save
- **On Save (Enter or Blur)**
  - Validate input
  - Show loading state
  - Update database
  - Show success/error message
  - Remove edit state
- **On Escape**
  - Revert changes
  - Restore original value
  - Remove edit state

### Vehicle Assignment Rules
- **Rep Permissions**
  - Can only assign available vehicles
  - Cannot edit vehicle information
  - Can only update status of assigned vehicles
  - Cannot modify vehicles assigned to other reps
  - Can view all vehicle details in read-only mode

- **Admin Permissions**
  - Can assign any vehicle
  - Can edit all vehicle information
  - Can update any vehicle's status
  - Can modify any vehicle's assignment
  - Full access to all vehicle functions

### Status Update Rules
- **Rep Permissions**
  - Can update status of vehicles assigned to them
  - Can only change status of available vehicles to:
    - Prospecting (if not already prospecting another vehicle)
    - With Customer (if customer is assigned)
  - Cannot change status of vehicles assigned to other reps

- **Admin Permissions**
  - Can update status of any vehicle
  - Can override any status change
  - Can modify any vehicle's assignment

### Delete Permissions
- **Vehicle Deletion**
  - Admin only
  - Requires confirmation message
  - Cannot delete if:
    - Assigned to customer
    - In maintenance
    - Has active status
  - User decides whether to archive or delete

- **Customer Deletion**
  - Admin: Can delete any customer
  - Rep: Can delete only their own customers
  - Requires confirmation message
  - Cannot delete if:
    - Has assigned vehicles
    - Is primary owner of other customers
  - User decides whether to archive or delete

### Status Changes
- **Confirmation Required**
  - Archive/Unarchive
  - Delete operations
  - No confirmation for regular status changes
  - Simple modal with:
    - Action description
    - Primary + Accent buttons
    - No complex validation

## Data Models

### Customer
```typescript
interface Customer {
  id: string;
  name: string;  // Combined name field
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  primaryOwnerId: string;
  additionalOwnerIds: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Vehicle
```typescript
enum VehicleStatus {
  Available = 'Available',
  WithCustomer = 'With Customer',
  Prospecting = 'Prospecting',
  Maintenance = 'Maintenance',
  Unavailable = 'Unavailable',
  Archived = 'Archived'
}

interface Vehicle {
  id: string;
  vehicleDescriptor: string;
  color: string;
  source: 'Jay' | 'Avis';
  vin: string;
  licensePlate: string | null;
  state: string | null;
  registrationExpiration: Timestamp;
  status: VehicleStatus;
  currentMileage: number;
  nextOilChangeDueMileage: number;
  assignedTo: string | null;  // Single user ID (rep/admin) or null if Available
  customerId: string | null;
  notes: string;
  isArchived: boolean;  // Archived vehicles are hidden from active views
  archivedAt?: Timestamp;  // When the vehicle was archived
  archivedBy?: string;  // User ID who archived the vehicle
  archiveReason?: string;  // Why the vehicle was archived
  // Avis specific fields
  mvaNumber?: string;
  returnDate?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Task
```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  isHighPriority: boolean;
  assignedTo: string[];
  createdBy: string;
  entityType: string;
  entityId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Vehicle Events
```typescript
interface VehicleEvent {
  id: string;
  vehicleId: string;
  type: 'status_change' | 'maintenance' | 'assignment' | 'archive' | 'unarchive';
  newStatus: VehicleStatus;
  mileage: number;
  timestamp: Timestamp;
  userId: string;  // User who made the change
  // Additional fields based on event type
  maintenanceType?: 'oil_change' | 'other';
  maintenanceDescription?: string;
  customerId?: string;  // Set when status is WithCustomer
  assignedTo?: string;  // Set when status is Prospecting
  archiveReason?: string;  // Set when type is archive
  notes?: string;
}
```

### Customer Sharing
```typescript
interface CustomerSharing {
  id: string;
  customerId: string;
  sharedWithUserId: string;
  permissions: {
    canView: boolean;
    canEdit: boolean;
    canAssign: boolean;
    canManageSharing: boolean;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Invitations
```typescript
interface Invitation {
  id: string;
  email: string;
  role: 'admin' | 'rep';
  status: 'pending' | 'accepted' | 'expired';
  token: string;
  expiresAt: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## Firebase Collections

### Vehicles
```typescript
enum VehicleStatus {
  Available = 'Available',
  WithCustomer = 'With Customer',
  Prospecting = 'Prospecting',
  Maintenance = 'Maintenance',
  Unavailable = 'Unavailable',
  Archived = 'Archived'
}

interface Vehicle {
  id: string;
  vehicleDescriptor: string;
  color: string;
  source: 'Jay' | 'Avis';
  vin: string;
  licensePlate: string | null;
  state: string | null;
  registrationExpiration: Timestamp;
  status: VehicleStatus;
  currentMileage: number;
  nextOilChangeDueMileage: number;
  assignedTo: string | null;  // Single user ID (rep/admin) or null if Available
  customerId: string | null;
  notes: string;
  isArchived: boolean;  // Archived vehicles are hidden from active views
  archivedAt?: Timestamp;  // When the vehicle was archived
  archivedBy?: string;  // User ID who archived the vehicle
  archiveReason?: string;  // Why the vehicle was archived
  // Avis specific fields
  mvaNumber?: string;
  returnDate?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Vehicle Events
```typescript
interface VehicleEvent {
  id: string;
  vehicleId: string;
  type: 'status_change' | 'maintenance' | 'assignment' | 'archive' | 'unarchive';
  newStatus: VehicleStatus;
  mileage: number;
  timestamp: Timestamp;
  userId: string;  // User who made the change
  // Additional fields based on event type
  maintenanceType?: 'oil_change' | 'other';
  maintenanceDescription?: string;
  customerId?: string;  // Set when status is WithCustomer
  assignedTo?: string;  // Set when status is Prospecting
  archiveReason?: string;  // Set when type is archive
  notes?: string;
}
```

### Data Retention & Cleanup
- Vehicle history maintained for 1 year
- Archived vehicles retained for 1 year
- Automatic cleanup of old data
  - Remove vehicle events older than 1 year
  - Remove archived vehicles older than 1 year
  - Keep basic vehicle record for reference

## Page Triggers & Actions

### Admin Pages

#### Dashboard (`/admin/dashboard`)
- **On Load**
  - Fetch vehicle counts by status
  - Fetch maintenance alerts
  - Fetch recent activity
- **Triggers**
  - Click on vehicle count → Navigate to filtered vehicle list
  - Click on maintenance alert → Navigate to vehicle detail
  - Click on recent activity → Show full activity list
  - Pull to refresh → Update all counts

#### Vehicles List (`/admin/vehicles`)
- **On Load**
  - Fetch all non-archived vehicles
  - Apply default filters
- **Triggers**
  - Click vehicle card → Navigate to vehicle detail
  - Click status badge → Show status change modal
  - Click assign button → Show assignment modal
  - Click archive button → Show archive confirmation
  - Filter change → Update vehicle list
  - Sort change → Update vehicle list
  - Pull to refresh → Update vehicle list

#### Vehicle Detail (`/admin/vehicles/[id]`)
- **On Load**
  - Fetch vehicle details
  - Fetch vehicle events
  - Fetch maintenance history
- **Triggers**
  - Click field → Enable inline edit
  - Click outside → Save changes
  - Click status badge → Show status modal
  - Click maintenance → Show maintenance modal
  - Click archive → Show archive modal
  - Click unarchive → Show unarchive confirmation
  - Pull to refresh → Update vehicle details

#### Customers List (`/admin/customers`)
- **On Load**
  - Fetch all customers
  - Apply default filters
- **Triggers**
  - Click customer card → Navigate to customer detail
  - Click add customer → Show add customer modal
  - Click share → Show sharing modal
  - Filter change → Update customer list
  - Sort change → Update customer list
  - Pull to refresh → Update customer list

#### Customer Detail (`/admin/customers/[id]`)
- **On Load**
  - Fetch customer details
  - Fetch assigned vehicles
  - Fetch sharing information
- **Triggers**
  - Click field → Enable inline edit
  - Click outside → Save changes
  - Click share → Show sharing modal
  - Click assign vehicle → Show vehicle assignment modal
  - Click remove sharing → Show confirmation
  - Pull to refresh → Update customer details

#### Users List (`/admin/users`)
- **On Load**
  - Fetch all users
  - Apply default filters
- **Triggers**
  - Click invite → Show invite modal
  - Click role change → Show role change modal
  - Click deactivate → Show confirmation
  - Click delete → Show confirmation
  - Pull to refresh → Update user list

#### Settings (`/admin/settings`)
- **On Load**
  - Fetch user profile
  - Fetch app preferences
- **Triggers**
  - Click field → Enable inline edit
  - Click outside → Save changes
  - Theme toggle → Immediate change
  - Password change → Show password modal
  - Logout → Clear session

### Rep Pages

#### Dashboard (`/rep/dashboard`)
- **On Load**
  - Fetch assigned vehicles
  - Fetch prospecting vehicle
  - Fetch maintenance alerts
- **Triggers**
  - Click vehicle card → Navigate to vehicle detail
  - Click status badge → Show status change modal
  - Click maintenance alert → Navigate to vehicle detail
  - Pull to refresh → Update dashboard

#### Vehicles List (`/rep/vehicles`)
- **On Load**
  - Fetch available vehicles
  - Fetch vehicles assigned to current rep
  - Apply default filters
- **Triggers**
  - Click vehicle card → Navigate to vehicle detail
  - Click status badge → Show status change modal (only for assigned vehicles)
  - Click assign → Show assignment modal (only for available vehicles)
  - Filter change → Update vehicle list
  - Pull to refresh → Update vehicle list

#### Vehicle Detail (`/rep/vehicles/[id]`)
- **On Load**
  - Fetch vehicle details
  - Fetch vehicle events
  - Fetch maintenance history
- **Triggers**
  - Click status badge → Show status modal (only for assigned vehicles)
  - Click maintenance → Show maintenance modal (only for assigned vehicles)
  - Click assign → Show assignment modal (only if vehicle is available)
  - Pull to refresh → Update vehicle details

#### Customers List (`/rep/customers`)
- **On Load**
  - Fetch assigned customers
  - Apply default filters
- **Triggers**
  - Click customer card → Navigate to customer detail
  - Click add customer → Show add customer modal
  - Click share → Show sharing modal
  - Filter change → Update customer list
  - Pull to refresh → Update customer list

#### Customer Detail (`/rep/customers/[id]`)
- **On Load**
  - Fetch customer details
  - Fetch assigned vehicles
  - Fetch sharing information
- **Triggers**
  - Click field → Enable inline edit
  - Click outside → Save changes
  - Click share → Show sharing modal
  - Click assign vehicle → Show vehicle assignment modal
  - Pull to refresh → Update customer details

#### Settings (`/rep/settings`)
- **On Load**
  - Fetch user profile
  - Fetch app preferences
- **Triggers**
  - Click field → Enable inline edit
  - Click outside → Save changes
  - Theme toggle → Immediate change
  - Password change → Show password modal
  - Logout → Clear session

### Shared Triggers

#### Status Change Modal
- **On Open**
  - Load current status
  - Load current mileage
- **Triggers**
  - Status selection → Update required fields
  - Mileage input → Validate against last recorded
  - Customer selection → Update customer fields
  - Submit → Create vehicle event and update status

#### Assignment Modal
- **On Open**
  - Load available vehicles
  - Load customer list
- **Triggers**
  - Vehicle selection → Update vehicle details
  - Customer selection → Update customer details
  - Submit → Create assignment event

#### Maintenance Modal
- **On Open**
  - Load current mileage
  - Load maintenance history
- **Triggers**
  - Maintenance type selection → Update required fields
  - Mileage input → Validate against last recorded
  - Submit → Create maintenance event

#### Sharing Modal
- **On Open**
  - Load user list
  - Load current sharing status
- **Triggers**
  - User selection → Update permissions
  - Permission toggle → Update available actions
  - Submit → Update sharing status

### Inline Edit Behavior
- **On Field Click**
  - Show edit cursor
  - Highlight editable field
  - Focus input
- **During Edit**
  - Real-time validation
  - Show error state if invalid
  - Press Enter to save
  - Click outside to auto-save
- **On Save (Enter or Blur)**
  - Validate input
  - Show loading state
  - Update database
  - Show success/error message
  - Remove edit state
- **On Escape**
  - Revert changes
  - Restore original value
  - Remove edit state

### Status Transition Rules

#### Available
- **From Available**
  - To Prospecting (Rep and admin)
    - Rep must not have another prospecting vehicle
    - Requires mileage update (can be overridden with warning)
  - To With Customer (Rep/Admin)
    - Requires customer selection or creation
    - Requires mileage update (can be overridden with warning)
  - To Maintenance (Admin only)
    - Requires maintenance type
    - Requires mileage update (can be overridden with warning)
  - To Unavailable (Admin only)
    - Requires reason
    - Requires mileage update (can be overridden with warning)
  - To Archived (Admin only)
    - Requires archive reason
    - Requires final mileage (can be overridden with warning)

#### Prospecting
- **From Prospecting**
  - To Available (Rep/Admin)
    - Requires mileage update (can be overridden with warning)
  - To With Customer (Rep/Admin)
    - Requires customer selection or creation
    - Requires mileage update (can be overridden with warning)
  - To Maintenance (Admin only)
    - Requires maintenance type
    - Requires mileage update (can be overridden with warning)
  - To Unavailable (Admin only)
    - Requires reason
    - Requires mileage update (can be overridden with warning)
  - To Archived (Admin only)
    - Requires archive reason
    - Requires final mileage (can be overridden with warning)

#### With Customer
- **From With Customer**
  - To Available (Rep/Admin)
    - Requires mileage update (can be overridden with warning)
  - To Maintenance (Admin only)
    - Requires maintenance type
    - Requires mileage update (can be overridden with warning)
  - To Unavailable (Admin only)
    - Requires reason
    - Requires mileage update (can be overridden with warning)
  - To Archived (Admin only)
    - Requires archive reason
    - Requires final mileage (can be overridden with warning)

#### Maintenance
- **From Maintenance**
  - To Available (Admin only)
    - Requires mileage update (can be overridden with warning)
  - To With Customer (Admin only)
    - Requires customer selection or creation
    - Requires mileage update (can be overridden with warning)
  - To Unavailable (Admin only)
    - Requires reason
    - Requires mileage update (can be overridden with warning)
  - To Archived (Admin only)
    - Requires archive reason
    - Requires final mileage (can be overridden with warning)

#### Unavailable
- **From Unavailable**
  - To Available (Admin only)
    - Requires mileage update (can be overridden with warning)
  - To With Customer (Admin only)
    - Requires customer selection or creation
    - Requires mileage update (can be overridden with warning)
  - To Maintenance (Admin only)
    - Requires maintenance type
    - Requires mileage update (can be overridden with warning)
  - To Archived (Admin only)
    - Requires archive reason
    - Requires final mileage (can be overridden with warning)

#### Archived
- **From Archived**
  - To Available (Admin only)
    - Requires reason for unarchive
    - Requires current mileage (can be overridden with warning)
    - Requires verification

### Transition Validation Rules
- **Mileage Validation**
  - Can be overridden with warning message
  - Warning shows:
    - Last recorded mileage
    - New mileage
    - Difference
    - Confirmation required
  - No hard restrictions on mileage values

- **Customer Validation**
  - Customer must exist in system
  - Customer must be active
  - Rep must have access to customer

- **Maintenance Validation**
  - Must specify maintenance type:
    - Oil Change
      - Updates nextOilChangeDueMileage (current + 5000)
      - Shows warning at 1000 miles remaining
      - Shows overdue message if past 5000 miles
    - Other Maintenance
      - Requires description can be overriden with warning
  - Requires mileage update (can be overridden with warning)

- **Archive Validation**
  - Must provide reason
  - Must be from Available or Unavailable status
  - Cannot be archived if assigned to customer
  - Cannot be archived if in maintenance

### Transition Events
- Each status change creates a vehicle event
- Event includes:
  - Previous status
  - New status
  - Mileage at change
  - User who made change
  - Timestamp
  - Additional details based on transition type

### List Views
- **Vehicle List**
  - Default Sort
    - Primary: Status (Available, With Customer, Prospecting, Maintenance, Unavailable)
    - Secondary: Vehicle Descriptor
  - No search functionality
  - Simple status filters
  - Card-based layout
  - Consistent spacing

- **Customer List**
  - Default Sort
    - Primary: Name
  - No search functionality
  - Simple filters
  - Card-based layout
  - Consistent spacing

- **User List (Admin)**
  - Default Sort
    - Primary: Role (Admin, Rep)
    - Secondary: Name
  - No search functionality
  - Simple role filters
  - Card-based layout
  - Consistent spacing

### Status Changes
- **Confirmation Required**
  - Archive/Unarchive
  - Delete operations
  - No confirmation for regular status changes
  - Simple modal with:
    - Action description
    - Primary + Accent buttons
    - No complex validation

### Authentication Triggers

- **On Load**
  - Check for existing session
  - Redirect to dashboard if authenticated
- **Triggers**
  - Email input → Validate format
  - Password input → Show/hide password
  - Submit → Attempt login
  - Login success → Redirect to role-based dashboard
  - Login failure → Show error message
  - Forgot password → Navigate to reset page

#### Registration Flow
- **Email Invitation** (`/auth/invite`)
  - **On Load**
    - Validate invitation token
    - Check expiration
  - **Triggers**
    - Email input → Validate format
    - Role selection → Update form
    - Submit → Send invitation
    - Success → Show confirmation
    - Failure → Show error message

- **Accept Invitation** (`/auth/accept-invite/[token]`)
  - **On Load**
    - Validate token
    - Check expiration
    - Pre-fill email
  - **Triggers**
    - Password input → Show/hide password
    - Confirm password → Match validation
    - Submit → Create account
    - Success → Redirect to login
    - Failure → Show error message

#### Password Reset
- **Request Reset** (`/auth/forgot-password`)
  - **On Load**
    - Clear any existing session
  - **Triggers**
    - Email input → Validate format
    - Submit → Send reset email
    - Success → Show confirmation
    - Failure → Show error message

- **Reset Password** (`/auth/reset-password`)
  - **On Load**
    - Validate reset token
    - Check expiration
  - **Triggers**
    - Password input → Show/hide password
    - Confirm password → Match validation
    - Submit → Update password
    - Success → Redirect to login
    - Failure → Show error message

### Session Management Triggers

#### Session State
- **On App Load**
  - Check Firebase Auth state
  - Validate session token
  - Redirect to login if invalid
  - Load user role and permissions
  - Check last activity timestamp

- **Session Expiration**
  - Token expires → Redirect to login
  - Show "Session expired" message
  - Clear local storage
  - Clear any pending operations
  - Log session end time

- **Session Interruption**
  - Firebase unavailable → Show error message
  - Network disconnect → Show offline message
  - Invalid permissions → Redirect to appropriate view
  - Browser close → Save session state

#### User Interactions
- **Logout**
  - Click logout → Clear session
  - Clear local storage
  - Redirect to login
  - Show confirmation message
  - Log logout time and reason

- **Session Timeout**
  - Inactivity detection (2 weeks)
  - Show timeout warning at 1 week
  - Auto-logout after 2 weeks
  - Clear sensitive data
  - Log timeout reason

- **Role Changes**
  - Admin changes role → Update permissions
  - Refresh user session
  - Redirect to appropriate view
  - Show confirmation message
  - Log role change

#### Activity Tracking
- **User Actions**
  - Page navigation → Update last activity
  - Form interaction → Update last activity
  - Data modification → Update last activity
  - Status changes → Update last activity

- **Session Refresh**
  - Successful action → Extend session
  - Regular activity check → Update timestamp
  - Background sync → Maintain session
  - Token refresh → Update expiration

#### Security Triggers
- **Multiple Sessions**f
  - New login → Invalidate other sessions
  - Show "Logged in elsewhere" message
  - Force logout from other devices
  - Clear other session data
  - Log device information

- **Suspicious Activity**
  - Multiple failed logins → Temporary lockout
  - Show security warning
  - Require password reset
  - Notify admin (if configured)
  - Log security events

#### Session Recovery
- **Browser Refresh**
  - Maintain session state
  - Restore last view
  - Preserve form data
  - Keep filters active

- **Tab Management**
  - New tab → Share session
  - Close tab → Check other tabs
  - Multiple tabs → Sync state
  - Last tab close → Start timeout

### Activity Triggers

#### Vehicle Events
- Status change → Log event
- Mileage update → Log event
- Maintenance → Log event

#### Customer Events
- Create customer → Log event
- Update customer → Log event
- Delete customer → Log event

#### User Events
- Login → Log event
- Logout → Log event
- Role change → Log event

#### Activity Log
- Timestamp
- User ID
- Action
- Entity ID

### Activity Triggers

#### Vehicle Activities
- **Status Changes**
  - Change status → Log event
  - Update mileage → Log event
  - Assign vehicle → Log event
  - Archive vehicle → Log event

- **Maintenance**
  - Record oil change → Log event
  - Add maintenance → Log event

#### Customer Activities
- **Profile**
  - Create customer → Log event
  - Update customer → Log event
  - Delete customer → Log event

- **Sharing**
  - Share customer → Log event
  - Remove sharing → Log event

#### User Activities
- **Account**
  - Create account → Log event
  - Change role → Log event
  - Deactivate account → Log event

#### System Activities
- **Login**
  - Successful login → Log event
  - Failed login → Log event
  - Session timeout → Log event

#### Activity Logging
- **Event Details**
  - Timestamp
  - User ID
  - Action type
  - Entity ID
  - New state

- **Activity Types**
  - Create
  - Update
  - Delete
  - Archive
  - Assign
  - Status Change
  - Maintenance
  - Login
  - Logout

- **Storage**
  - Store in Firestore
  - Index by timestamp
  - Index by user