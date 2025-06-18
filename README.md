# Trident Fleet Management Application

## Project Overview
Trident is an auto hail repair business with a diverse fleet of vehicles, designed with a SAP-inspired, mobile-first approach to fleet management and rental operations.

### Navigation and UI Improvements 
- Added Customers page to main navigation for better accessibility
- Enhanced sidebar with user profile information
- Improved navigation layout with collapsible sidebar
- Unified navigation experience across desktop and mobile views
- Fixed user display name to use Firestore data instead of Firebase Auth

## Business Context
- **Business Type**: Auto Hail Repair Service
- **Fleet Size**: Approximately 20 vehicles
- **Vehicle Ownership**: 
  - Company-owned vehicles
  - Avis-owned vehicles

## User Roles
### 1. Representative (Rep)
- View vehicle inventory
- Check out vehicles to customers
- Conduct vehicle prospecting
- Manage customer interactions
- Access limited system features

### 2. Administrator (Admin)
- Full system access
- User management
- System settings configuration
- Advanced reporting
- Comprehensive fleet oversight

## Application Pages
1. **Dashboard**
   - Overview of fleet status
   - Quick access to key information
   - Performance metrics

2. **Vehicles**
   - Complete vehicle inventory
   - Status tracking
   - Filtering and search capabilities

3. **Vehicle Details**
   - Comprehensive vehicle information
   - Maintenance history
   - Current status and usage

4. **Customers**
   - Customer list view
   - Basic customer information
   - Active rentals and interactions

5. **Customer Details**
   - Detailed customer profile
   - Rental history
   - Current vehicle assignments

6. **Users** (Admin Only)
   - User management
   - Role assignments
   - Access control

7. **Settings**
   - System configuration
   - Theme preferences
   - General application settings

## Design Philosophy
- **Minimalistic Approach**: Lean, efficient, and purposeful design
- **Mobile-First Strategy**: Prioritizing mobile user experience
- **Responsive Design**: Seamless interaction across devices
  - Mobile
  - Tablet
  - Desktop
- **Client-Side First**
  - Entire application logic runs on the client
  - Minimal server-side processing
  - Enhanced performance and responsiveness
  - Reduced backend complexity

## Vehicle Statuses
Vehicle lifecycle is managed through the following statuses:
- **Available**: Ready for rental or use
- **With Customer**: Currently rented or in use
- **Prospecting**: Potential vehicle being evaluated
- **Maintenance**: Undergoing repairs or service
- **Archived**: Removed from active fleet (hidden from main list)

## Technical Stack
- **Frontend**: React
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Backend/Database**: Firebase Spark Plan
- **State Management**: React Context API
- **Authentication**: Firebase Authentication
- **Language**: TypeScript

## Features

### 1. Vehicle Inventory Management
- Real-time vehicle status tracking
   - Responsive grid/list views
   - Quick status indicators
   - Adaptive layout for different screen sizes
- Instant status updates
- Client-side state management
- Role-based access control

### 2. Rental Management
   - Mobile-optimized booking interface
   - Real-time availability tracking
   - Touch-friendly interactions
- Immediate status changes
- Rep-specific vehicle checkout

### 3. User Management
- Secure role-based authentication
- Granular access controls
- Admin user administration

## Theming
- Light and Dark mode support
- Automatic theme detection
- Manual theme switching
- SAP-inspired design guidelines
  - Clean, minimalist interface
  - Intuitive navigation
  - Consistent color palette

## Data Management
- **Data Source**: CSV file (`vehicles_export_cleaned.csv`)
- **Seeding Process**: Custom script to import data into Firestore
- **Client-Side Processing**:
  - All data transformations handled in the browser
  - Minimal server-side logic
  - Enhanced performance and responsiveness
- **Data Handling**: 
  - Automatic cleaning of empty/undefined values
  - Robust error handling
  - Client-side state management

## Development

### Prerequisites
- Node.js (version specified in `package.json`)
- npm or Yarn
- Firebase account

### Setup
1. Clone the repository
   ```bash
   git clone https://github.com/your-org/trident-fleet.git
   cd trident-fleet
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up Firebase configuration
   - Create `.env` file
   - Add Firebase configuration variables

4. Run development server
   ```bash
   npm run dev
   ```

### Data Seeding
To seed vehicle data from the CSV file:
```bash
npm run seed:vehicles
```

## Deployment
- Platform: Firebase Hosting
- Optimization: 
  - Responsive build
- Performance-focused deployment
  - Minimal bundle size
  - Client-side rendering

## Code Quality
- **Linting**: ESLint
- **Formatting**: Prettier
- **Type Checking**: TypeScript

## Future Roadmap
- [ ] Advanced analytics dashboard
- [ ] Enhanced client-side caching
- [ ] Internationalization
- [ ] Enhanced reporting features
- [ ] Performance optimizations
- [ ] Offline support improvements
- [ ] Advanced role-based access controls

## Contributing
Refer to `CONTRIBUTING.md` for development guidelines and contribution process.

## License
[Specify License - e.g., MIT, Apache 2.0]

## Authentication & Access Control

### Login Mechanism
- Minimal, secure login page
- Firebase Authentication
- Role-based access control
- Client-side activity tracking

### User Roles
1. **Representative (Rep)**
   - Limited access to vehicle and customer management
   - Can check out vehicles
   - View limited system information

2. **Administrator (Admin)**
   - Full system access
   - User management
   - System configuration
   - Advanced reporting capabilities

### Authentication Flow
- Secure email/password login
- Automatic role detection
- Persistent session management
- Client-side permission enforcement

### Security Features
- Firebase Authentication
- Role-based access control
- Activity logging
- Minimal information exposure

## Typography and Design System

### Font Stack
- **Header Fonts**: 
  - Primary Header Font: `Inter`, a clean, modern sans-serif typeface
  - Weights: 600 (Semi-Bold) for headings
  - Fallback: `-apple-system, BlinkMacSystemFont, "Segoe UI"`

- **Body Font**:
  - Primary Body Font: `Inter`, same as headers but with lighter weights
  - Weights: 400 (Regular) for body text, 300 (Light) for secondary text
  - Fallback: `-apple-system, BlinkMacSystemFont, "Segoe UI"`

### Typography Hierarchy
```css
/* Tailwind CSS Typography Classes */
h1 { @apply text-3xl font-semibold text-gray-900 }
h2 { @apply text-2xl font-semibold text-gray-800 }
p  { @apply text-base text-gray-700 leading-relaxed }
```

### Styling Principles
- **Consistency**: Uniform typography across all components
- **Readability**: Generous line height and appropriate font sizes
- **Hierarchy**: Clear visual distinction between headings and body text
- **Responsive**: Font sizes adapt to screen sizes

### Color Typography Guidelines
- **Headings**: Dark gray (`text-gray-900`)
- **Body Text**: Slightly lighter gray (`text-gray-700`)
- **Secondary Text**: Light gray (`text-gray-500`)

### Implementation Notes
- Import Inter font in `tailwind.config.js`
- Use Tailwind's `@apply` directive for consistent styling
- Leverage CSS variables for easy theme adjustments

### Font Import (in `index.css`)
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap');

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

## Color Palette and Component Design System

### Primary Color Palette
- **Blue**: `#0070e0`
  - Represents trust, professionalism, and technology
  - Used for primary actions, headers, and key interactive elements
  - Gradient of 9 shades from light to dark

- **Yellow**: `#ffc700`
  - Represents energy, caution, and attention
  - Used for highlights, warnings, and accent elements
  - Gradient of 9 shades from light to dark

### Status Colors
- **Success**: `#2ecc71` (Green)
  - Used for positive confirmations, completed actions
  - Light variant for backgrounds: `#d4edda`

- **Warning**: `#f39c12` (Orange)
  - Used for cautionary messages, pending statuses
  - Light variant for backgrounds: `#fff3cd`

- **Danger**: `#e74c3c` (Red)
  - Used for errors, critical alerts, deletion actions
  - Light variant for backgrounds: `#f8d7da`

- **Info**: `#3498db` (Blue)
  - Used for informational messages, neutral statuses
  - Light variant for backgrounds: `#d1ecf1`

### Reusable Component Design Tokens

#### Border Radius
- **Component Radius**: `6px` (0.375rem)
  - Used for cards, modals, input fields
- **Badge Radius**: `4px` (0.25rem)
  - Used for status badges, tags, small interactive elements

#### Box Shadows
- **Component Shadow**: Subtle depth
  ```css
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  ```
- **Hover Shadow**: Enhanced depth on interaction
  ```css
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
  ```

### Component Guidelines

#### Status Badges
```jsx
// Example Status Badge Component
const StatusBadge = ({ status, children }) => {
  const statusClasses = {
    success: 'bg-status-success-light text-status-success',
    warning: 'bg-status-warning-light text-status-warning',
    danger: 'bg-status-danger-light text-status-danger',
    info: 'bg-status-info-light text-status-info'
  };

  return (
    <span 
      className={`
        inline-block px-2 py-1 
        rounded-badge 
        text-xs font-semibold
        ${statusClasses[status]}
      `}
    >
      {children}
    </span>
  );
}
```

#### Tailwind Usage Examples
```jsx
// Primary Button
<button className="
  bg-trident-blue-500 
  text-white 
  hover:bg-trident-blue-600 
  rounded-component 
  shadow-component
">
  Primary Action
</button>

// Status Badge
<StatusBadge status="success">Completed</StatusBadge>
```

### Implementation Notes
- Use Tailwind's color classes: `bg-trident-blue-500`, `text-trident-yellow-300`
- Leverage design tokens for consistent styling
- Maintain color accessibility standards
- Use light/dark variants for different contexts

## Reusable Component System

### Overview
Our component library is designed with modularity, consistency, and flexibility in mind. Each component follows our design system guidelines, ensuring a uniform look and feel across the application.

### Component Philosophy
- **Consistency**: Uniform styling and behavior
- **Flexibility**: Customizable through props
- **Accessibility**: Built with user experience in mind
- **Performance**: Lightweight and efficient

### Available Components

#### 1. Input Component
```typescript
interface InputProps {
  label?: string;        // Optional label
  error?: string;        // Error message
  variant?: 'default' | 'primary' | 'secondary';
}
```

**Usage Example:**
```jsx
<Input 
  label="Email Address"
  placeholder="Enter your email"
  variant="primary"
  error={emailError}
/>
```

**Features:**
- Multiple styling variants
- Built-in error handling
- Consistent typography
- Responsive design

#### 2. Button Component
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
}
```

**Usage Example:**
```jsx
<Button 
  variant="primary" 
  size="md"
  onClick={handleSubmit}
>
  Submit
</Button>
```

**Features:**
- Color variants matching design system
- Responsive sizing
- Hover and focus states
- Consistent interaction design

#### 3. Status Badge Component
```typescript
interface StatusBadgeProps {
  status: 'success' | 'warning' | 'danger' | 'info';
}
```

**Usage Example:**
```jsx
<StatusBadge status="success">
  Completed
</StatusBadge>
```

**Features:**
- Predefined status colors
- Lightweight and reusable
- Matches design system color palette

### Component Location
All reusable components are located in:
```
src/
└── components/
    └── common/
        ├── Input.tsx
        ├── Button.tsx
        ├── StatusBadge.tsx
        └── index.ts
```

### Best Practices
- Always import from `@/components/common`
- Use appropriate variants
- Extend components as needed
- Maintain consistent prop naming

### Future Component Roadmap
- [ ] Form components
- [ ] Modal/Dialog
- [ ] Dropdown
- [ ] Tooltip
- [ ] Card
- [ ] Pagination

### Contribution Guidelines
1. Follow existing component structure
2. Maintain TypeScript type safety
3. Add comprehensive prop documentation
4. Ensure accessibility
5. Write unit tests for new components

### Performance Considerations
- Components are tree-shakeable
- Minimal runtime overhead
- Optimized for React's rendering cycle

### Customization
Components can be further customized by:
- Passing additional className
- Extending base components
- Using Tailwind's utility classes

### Example of Extensibility
```jsx
// Custom button with additional styling
const CustomButton = (props) => (
  <Button 
    {...props} 
    className={`
      ${props.className} 
      custom-additional-style
    `} 
  />
);
```

### Login Page Architecture

#### Detailed Component Overview
The Login page (`src/pages/auth/Login.tsx`) serves as the application's entry point, embodying our design system's core principles of simplicity, security, and user experience. Leveraging our custom `Input` and `Button` components from `src/components/common/`, the page demonstrates a clean, modular approach to authentication.

**Key Technical Highlights:**
- Utilizes Firebase Authentication (`firebaseAuth.signIn()`)
- Implements role-based routing based on user email
- Integrated password visibility toggle with minimal styling
- Responsive design with Tailwind CSS utility classes
- Error handling with inline validation
- Seamless integration with custom component library

**Authentication Flow:**
1. User enters credentials
2. Firebase authentication validates input
3. Role detection determines dashboard/access point
4. Secure client-side routing prevents unauthorized access

**Security Considerations:**
- No sensitive information stored client-side
- Immediate role-based redirection
- Minimal exposed user information
- Client-side permission enforcement

**Component Interactions:**
- `Input`: Manages form field state and visibility
- `Button`: Provides consistent interaction styling
- `firebaseAuth`: Handles authentication logic
- `UserRole`: Defines access level enumeration

**Performance Optimizations:**
- Lightweight component structure
- Minimal re-renders
- Efficient state management
- No unnecessary prop drilling

---

*Minimalistic, Client-Side Fleet Management Solution* 