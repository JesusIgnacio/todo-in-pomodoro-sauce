import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Theme {
  name: 'light' | 'dark';
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    shadow: string;
    success: string;
    danger: string;
    warning: string;
    gradient: string;
  };
}

const lightTheme: Theme = {
  name: 'light',
  colors: {
    primary: '#3498db',
    secondary: '#2980b9',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    surface: '#ffffff',
    text: '#2c3e50',
    textSecondary: '#7f8c8d',
    border: '#f1f3f4',
    shadow: 'rgba(0, 0, 0, 0.08)',
    success: '#27ae60',
    danger: '#ff6b6b',
    warning: '#ffd93d',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
};

const darkTheme: Theme = {
  name: 'dark',
  colors: {
    primary: '#4a9eff',
    secondary: '#357abd',
    background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
    surface: '#34495e',
    text: '#ecf0f1',
    textSecondary: '#bdc3c7',
    border: '#4a5568',
    shadow: 'rgba(0, 0, 0, 0.3)',
    success: '#2ecc71',
    danger: '#e74c3c',
    warning: '#f39c12',
    gradient: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
  },
};

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : false;
  });
  const [isLoaded, setIsLoaded] = useState(false);

  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }
    setIsLoaded(true);
  }, [isDark]);

  // Prevent flash of unstyled content
  if (!isLoaded) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '1.2rem'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};
