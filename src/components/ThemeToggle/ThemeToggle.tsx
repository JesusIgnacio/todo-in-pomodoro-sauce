import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../hooks/useTheme';

const ToggleButton = styled.button<{ $isDark: boolean }>`
  position: fixed;
  top: 2rem;
  right: 2rem;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: ${props => props.$isDark ? '#f39c12' : '#2c3e50'};
  color: white;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
  z-index: 100;

  &:hover {
    transform: scale(1.1);
    background-color: ${props => props.$isDark ? '#e67e22' : '#34495e'};
  }
`;

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <ToggleButton 
      $isDark={isDark}
      onClick={toggleTheme}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? '☀️' : '🌙'}
    </ToggleButton>
  );
};
