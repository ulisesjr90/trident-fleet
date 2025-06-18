# Trident Fleet App Style Guide

## Colors

### Primary Colors
- Primary Blue: `#0066CC`
- Accent Gold: `#FFD700`
- Success Green: `#22C55E`
- Warning Orange: `#F59E0B`
- Error Red: `#EF4444`

### Dark Mode Colors
- Background: `#1f2937` (for cards and sections)
- Text: `#FFFFFF`
- Secondary Text: `#9CA3AF`
- Border: `#374151`

### Light Mode Colors
- Background: `#FFFFFF`
- Text: `#333333`
- Secondary Text: `#6B7280`
- Border: `#E5E7EB`

## Typography

### Font Sizes
- Base: `16px`
- Small: `14px`
- Large: `18px`
- Extra Large: `24px`
- Headings:
  - H1: `24px`
  - H2: `20px`
  - H3: `18px`
  - H4: `16px`

### Font Weights
- Regular: `400`
- Medium: `500`
- Semibold: `600`
- Bold: `700`

## Components

### Cards
```tsx
// Base card styling
<div className="bg-white dark:bg-[#1f2937] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
```

### Buttons
```tsx
// Primary button
<Button variant="primary">
// Accent button
<Button variant="accent">
// Danger button
<Button variant="danger">
// Outline button
<Button variant="outline">
```

### Input Fields
```tsx
// Base input styling
<Input className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
```

### Badges
```tsx
// Status badges
<Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
<Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
<Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
<Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
```

## Status Badge Standards

### Vehicle Status
```tsx
// Available
<Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
  Available
</Badge>

// With Customer
<Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
  With Customer
</Badge>

// Prospecting
<Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
  Prospecting
</Badge>

// Maintenance
<Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
  Maintenance
</Badge>

// Unavailable
<Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
  Unavailable
</Badge>

// Archived
<Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
  Archived
</Badge>
```

### Status Color Meanings
- **Green** (`bg-green-100`/`text-green-800`): Available - Vehicle is ready for use
- **Blue** (`bg-blue-100`/`text-blue-800`): With Customer - Vehicle is currently assigned to a customer
- **Purple** (`bg-purple-100`/`text-purple-800`): Prospecting - Vehicle is under consideration for assignment
- **Yellow** (`bg-yellow-100`/`text-yellow-800`): Maintenance - Vehicle is in service or repair
- **Red** (`bg-red-100`/`text-red-800`): Unavailable - Vehicle is not ready for use
- **Gray** (`bg-gray-100`/`text-gray-800`): Archived - Vehicle is no longer in active use

### Dark Mode Colors
- **Green**: `dark:bg-green-900`/`dark:text-green-300`
- **Blue**: `dark:bg-blue-900`/`dark:text-blue-300`
- **Purple**: `dark:bg-purple-900`/`dark:text-purple-300`
- **Yellow**: `dark:bg-yellow-900`/`dark:text-yellow-300`
- **Red**: `dark:bg-red-900`/`dark:text-red-300`
- **Gray**: `dark:bg-gray-700`/`dark:text-gray-300`

### Usage Guidelines
1. Always use the predefined color combinations for consistency
2. Include both light and dark mode variants
3. Use semantic color meanings (e.g., green for available, red for unavailable)
4. Maintain sufficient contrast for accessibility
5. Keep badge text concise and clear
6. Use uppercase for status text
7. Include appropriate ARIA labels for screen readers

## Layout

### Container
```tsx
// Page container
<div className="container px-4 py-6">
```

### Grid System
```tsx
// Responsive grid
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
```

### Spacing
- Extra Small: `4px` (gap-1)
- Small: `8px` (gap-2)
- Medium: `16px` (gap-4)
- Large: `24px` (gap-6)
- Extra Large: `32px` (gap-8)

## Mobile Layout

### Header
```tsx
<MobileLayout
  header={{
    title: 'Page Title',
    showBackButton: true
  }}
  userRole={userRole}
  currentPath={pathname}
>
```

### Bottom Navigation
- Fixed position at bottom
- Icons with labels
- Active state indicator
- Role-based menu items

## Transitions

### Duration
- Fast: `150ms`
- Normal: `200ms`
- Slow: `300ms`

### Timing Functions
- Default: `ease-in-out`
- Hover: `ease-out`
- Active: `ease-in`

## Icons
- Using Lucide React icons
- Standard size: `20px` (w-5 h-5)
- Small size: `16px` (w-4 h-4)
- Large size: `24px` (w-6 h-6)

## Best Practices

1. **Dark Mode**
   - Always include dark mode variants
   - Use semantic color names
   - Test both modes thoroughly

2. **Responsive Design**
   - Mobile-first approach
   - Use responsive utility classes
   - Test on multiple screen sizes

3. **Accessibility**
   - Maintain sufficient color contrast
   - Use semantic HTML elements
   - Include proper ARIA labels

4. **Performance**
   - Minimize custom CSS
   - Use Tailwind's utility classes
   - Optimize transitions and animations

5. **Consistency**
   - Follow established patterns
   - Reuse existing components
   - Maintain consistent spacing

## Component Examples

### Card with Header
```tsx
<Card className="bg-white dark:bg-[#1f2937]">
  <div className="p-4">
    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
      Card Title
    </h2>
    {/* Card content */}
  </div>
</Card>
```

### Stat Card
```tsx
<div className="rounded-lg border bg-white p-4 dark:border-gray-800 dark:bg-[#1f2937]">
  <div className="flex items-center gap-2">
    <h3 className="text-sm font-medium text-[#333333] dark:text-white">
      Stat Title
    </h3>
  </div>
  <p className="mt-2 text-2xl font-bold text-[#333333] dark:text-white">
    Stat Value
  </p>
</div>
```

### Form Field
```tsx
<div>
  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
    Label
  </label>
  <Input
    className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
    placeholder="Placeholder text"
  />
</div>
``` 