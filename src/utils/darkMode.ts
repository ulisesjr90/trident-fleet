export const toggleDarkMode = () => {
  const htmlElement = document.documentElement;
  
  if (htmlElement.classList.contains('dark')) {
    htmlElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  } else {
    htmlElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }
};

export const initDarkMode = () => {
  const htmlElement = document.documentElement;

  // Always default to light mode
    htmlElement.classList.remove('dark');
  localStorage.setItem('theme', 'light');
};

// Call this in your app's entry point
initDarkMode(); 