import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

const ToggleButton = styled(motion.button)<{ $isDark: boolean }>`
  position: fixed;
  top: 2rem;
  right: 2rem;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background: ${props => props.$isDark 
    ? 'linear-gradient(135deg, #f39c12, #e67e22)' 
    : 'linear-gradient(135deg, #2c3e50, #34495e)'};
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  z-index: 100;
  backdrop-filter: blur(10px);

  &:hover {
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.4);
  }

  svg {
    font-size: 1.3rem;
  }
`;

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <ToggleButton 
      $isDark={isDark}
      onClick={toggleTheme}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      <motion.div
        key={isDark ? 'sun' : 'moon'}
        initial={{ rotate: -180, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? '☀️' : '🌙'}
      </motion.div>
    </ToggleButton>
  );
};
