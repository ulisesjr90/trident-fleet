# Layout Guide

## Page Structure

Every page in the application follows a consistent layout structure:

```tsx
<div className="space-y-6">
  <PageHeader title="Page Title" action={optionalButton} />
  <div className="bg-white rounded-xl shadow-sm p-6">
    {/* Page content */}
  </div>
</div>
```

## Responsive Behavior

### Desktop (≥1024px)
- Sidebar: `w-64` (expanded) / `w-20` (collapsed)
- Main content: Remaining width
- Grid layouts: Up to 4 columns
- Padding: `p-6` (containers)
- Spacing between elements: `space-y-6`

### Tablet (≥768px and <1024px)
- Sidebar: `w-64` (expanded) / `w-20` (collapsed)
- Main content: Remaining width
- Grid layouts: Up to 2 columns
- Padding: `p-4` (containers)
- Spacing between elements: `space-y-6`

### Mobile (<768px)
- Bottom navigation bar: Fixed, `h-16`
- Full width content: `w-full`
- Grid layouts: Single column
- Padding: `p-4` (containers)
- Spacing between elements: `space-y-4`

## Common Components

### PageHeader
```tsx
<div className="flex justify-between items-center">
  <h1 className="text-2xl font-semibold text-gray-900">
    {title}
  </h1>
  {action && <div>{action}</div>}
</div>
```

### Content Cards
```tsx
<div className="bg-white rounded-xl shadow-sm p-6">
  {/* Card content */}
</div>
```

### Navigation Items
```tsx
<NavLink className="
  flex items-center gap-2 md:gap-3 
  px-2 md:px-3 
  py-2
  rounded-lg
  transition-colors
  ${isActive 
    ? 'bg-blue-50 text-blue-600' 
    : 'text-gray-600 hover:bg-gray-100'
  }
">
  <Icon className="w-5 h-5 md:w-6 md:h-6 shrink-0" />
  <span className="text-sm md:text-base truncate">
    {label}
  </span>
</NavLink>
```

## Typography

### Headers
- Page titles: `text-2xl font-semibold text-gray-900`
- Section headers: `text-lg font-medium text-gray-900`
- Card titles: `text-base font-medium text-gray-900`

### Body Text
- Primary text: `text-sm text-gray-600`
- Secondary text: `text-xs text-gray-500`

## Spacing System

### Vertical Spacing
- Between page sections: `space-y-6`
- Between card elements: `space-y-4`
- Between form fields: `space-y-4`
- Between list items: `space-y-1`

### Horizontal Spacing
- Between inline elements: `gap-2` (mobile) / `gap-3` (desktop)
- Grid gaps: `gap-6`
- Icon spacing: `gap-2`

## Colors

### Background Colors
- Page background: `bg-gray-50`
- Card background: `bg-white`
- Hover states: `hover:bg-gray-100`
- Active states: `bg-blue-50`

### Text Colors
- Primary text: `text-gray-900`
- Secondary text: `text-gray-600`
- Tertiary text: `text-gray-500`
- Interactive elements: `text-blue-600`

### Border Colors
- Dividers: `border-gray-200`
- Input borders: `border-gray-300`

## Shadows
- Cards: `shadow-sm`
- Dropdowns/Popovers: `shadow-md`
- Modals: `shadow-lg`

## Border Radius
- Cards and containers: `rounded-xl`
- Buttons and interactive elements: `rounded-lg`
- Small elements (badges, chips): `rounded-full`

## Grid System
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Grid items */}
</div>
```

## Responsive Breakpoints
- Mobile: <768px
- Tablet: ≥768px
- Desktop: ≥1024px
- Large Desktop: ≥1280px

## Animation
- Transitions: `transition-all duration-300`
- Loading states: `animate-pulse`
- Hover effects: `transition-colors`

## Best Practices

1. **Consistency**
   - Use the defined spacing system
   - Follow the typography hierarchy
   - Maintain consistent padding/margins

2. **Responsiveness**
   - Always consider mobile-first
   - Use responsive classes (sm:, md:, lg:)
   - Test all breakpoints

3. **Accessibility**
   - Maintain proper heading hierarchy
   - Ensure sufficient color contrast
   - Include proper ARIA attributes

4. **Performance**
   - Use CSS Grid for layouts
   - Implement lazy loading where appropriate
   - Minimize DOM nesting 