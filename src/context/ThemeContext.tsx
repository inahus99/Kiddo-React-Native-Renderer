import React, { createContext, useContext, useMemo } from 'react';
import type { ThemeConfig } from '@/types';

const DEFAULT_THEME: ThemeConfig = {
  primary: '#FF6B35',
  secondary: '#2EC4B6',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  text: '#1A1A2E',
  textSecondary: '#6B7280',
  accent: '#FFD166',
  border: '#E5E7EB',
};

type ThemeContextValue = {
  theme: ThemeConfig;
};

const ThemeContext = createContext<ThemeContextValue>({ theme: DEFAULT_THEME });

type Props = {
  theme: ThemeConfig;
  children: React.ReactNode;
};

export function ThemeProvider({ theme, children }: Props) {
  // Memoize so object reference is stable unless theme values change,
  // preventing unnecessary re-renders in all consuming components
  const value = useMemo<ThemeContextValue>(() => ({ theme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
