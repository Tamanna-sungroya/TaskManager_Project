import React, { useEffect, useState } from 'react';

const ThemeToggle = () => {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return (
    <button
      aria-label="Toggle dark mode"
      className={`relative w-14 h-8 rounded-full transition-colors duration-300 focus:outline-none ${dark ? 'bg-gradient-to-r from-green-300 to-blue-400' : 'bg-gray-300'}`}
      onClick={() => setDark((d) => !d)}
    >
      <span
        className={`absolute left-1 top-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 ${dark ? 'translate-x-6' : ''}`}
      />
    </button>
  );
};

export default ThemeToggle;
