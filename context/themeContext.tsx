import React, { createContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme?: () => void;
  forcedTheme?: (t: string) => void;
  autoTheme?: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({ theme: 'light' });

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemTheme = useColorScheme(); // Ottiene il tema del dispositivo
  const [theme, setTheme] = useState<Theme>(systemTheme || 'light');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };
  const forcedTheme = (t: string) => {
    setTheme(t as Theme);
  }
  const autoTheme = () => {
    setTheme(systemTheme as Theme);
  }

  useEffect(() => {
    if (systemTheme) {
      setTheme(systemTheme as Theme);
    }
    console.log('systemTheme', systemTheme);
  }, [systemTheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, forcedTheme, autoTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};