import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(
    localStorage.getItem('theme') as 'light' | 'dark' || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  );

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove old classes
    root.classList.remove('light', 'dark');
    
    // Add new theme class
    root.classList.add(theme);
    
    // Save to local storage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="flex items-center gap-3">
      <button 
        type="button"
        onClick={toggleTheme} 
        className="
          relative
          inline-flex
          h-6
          w-11
          flex-shrink-0
          cursor-pointer
          rounded-full
          border-2
          border-transparent
          transition-colors
          duration-200
          ease-in-out
          focus:outline-none
          focus:ring-2
          focus:ring-trident-blue-500
          focus:ring-offset-2
          bg-gray-200
          dark:bg-gray-700
        "
        role="switch"
        aria-checked={theme === 'dark'}
      >
        <span className="sr-only">Toggle theme</span>
        <span
          aria-hidden="true"
          className={`
            pointer-events-none
            inline-block
            h-5
            w-5
            transform
            rounded-full
            bg-white
            shadow
            ring-0
            transition
            duration-200
            ease-in-out
            ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}
          `}
        />
      </button>
      <div className="flex items-center gap-2">
        <Sun className={`w-4 h-4 ${theme === 'light' ? 'text-trident-yellow-500' : 'text-gray-400'}`} />
        <Moon className={`w-4 h-4 ${theme === 'dark' ? 'text-trident-blue-300' : 'text-gray-400'}`} />
      </div>
    </div>
  );
}; 