export const typography = {
  // Header font - used for all headings and important text
  header: 'font-semibold text-gray-900 dark:text-white text-lg',
  // Body font - used for all regular text content
  body: 'font-normal text-gray-600 dark:text-gray-300 text-sm',
} as const;

// Helper function to get typography class
export function getTypographyClass(type: 'header' | 'body') {
  return typography[type];
} 