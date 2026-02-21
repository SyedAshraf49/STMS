import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

type Theme = 'light' | 'dark';
type ColorTheme = 'classic' | 'ocean' | 'forest' | 'sunset';
const colorThemeOrder: ColorTheme[] = ['classic', 'ocean', 'forest', 'sunset'];

interface ThemeContextType {
  theme: Theme;
  colorTheme: ColorTheme;
  toggleTheme: () => void;
  toggleColorTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    // Also check user's system preference
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return savedTheme || (userPrefersDark ? 'dark' : 'light');
  });

  const [colorTheme, setColorTheme] = useState<ColorTheme>(() => {
    const savedColorTheme = localStorage.getItem('colorTheme') as ColorTheme;
    return savedColorTheme || 'classic';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('theme-custom', 'theme-ocean', 'theme-forest', 'theme-sunset');
    if (colorTheme !== 'classic') {
      root.classList.add('theme-custom', `theme-${colorTheme}`);
    }
    localStorage.setItem('colorTheme', colorTheme);
  }, [colorTheme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const toggleColorTheme = () => {
    setColorTheme(prevColorTheme => {
      const currentIndex = colorThemeOrder.indexOf(prevColorTheme);
      const nextIndex = (currentIndex + 1) % colorThemeOrder.length;
      return colorThemeOrder[nextIndex];
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, colorTheme, toggleTheme, toggleColorTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
