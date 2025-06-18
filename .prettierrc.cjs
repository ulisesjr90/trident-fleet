module.exports = {
  // Indentation
  tabWidth: 2,
  useTabs: false,

  // Quotes
  singleQuote: true,
  jsxSingleQuote: true,

  // Semicolons
  semi: true,

  // Trailing Commas
  trailingComma: 'es5',

  // Line Breaks and Spacing
  printWidth: 100,
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',

  // Line Breaks
  proseWrap: 'preserve',
  htmlWhitespaceSensitivity: 'css',
  endOfLine: 'auto',

  // Specific Language Configurations
  overrides: [
    {
      files: '*.json',
      options: {
        singleQuote: false,
      },
    },
    {
      files: '*.yml',
      options: {
        singleQuote: false,
      },
    },
  ],
}; 