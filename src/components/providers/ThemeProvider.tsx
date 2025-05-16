'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => Promise<void>;
};

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: async () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize theme from Firestore
  useEffect(() => {
    const initializeTheme = async () => {
      if (!session?.user?.id) return;

      try {
        const userPrefsRef = doc(db, 'user_preferences', session.user.id);
        const userPrefsDoc = await getDoc(userPrefsRef);
        
        if (userPrefsDoc.exists()) {
          const prefs = userPrefsDoc.data();
          const darkMode = prefs.darkMode || false;
          setIsDarkMode(darkMode);
          if (darkMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
      }
    };

    if (mounted) {
      initializeTheme();
    }
  }, [session, mounted]);

  const toggleTheme = async () => {
    if (!session?.user?.id) return;

    const newTheme = !isDarkMode;
    
    try {
      // Optimistically update UI
      setIsDarkMode(newTheme);
      if (newTheme) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      // Save to Firestore
      const userPrefsRef = doc(db, 'user_preferences', session.user.id);
      await setDoc(userPrefsRef, {
        userId: session.user.id,
        darkMode: newTheme,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      console.error('Error saving theme preference:', error);
      // Revert UI changes if save failed
      setIsDarkMode(!newTheme);
      if (!newTheme) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  // Prevent flash of wrong theme
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext); 