import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { TodoForm } from '../TodoForm/TodoForm';
import { TodoList } from '../TodoList/TodoList';
import { TodoFilters } from '../TodoFilters/TodoFilters';
import { TodoStats } from '../TodoStats/TodoStats';
import { KeyboardHelp } from '../KeyboardHelp/KeyboardHelp';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import { PomodoroTimer } from '../PomodoroTimer/PomodoroTimer';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';

const AppBackground = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 1rem;
  transition: all 0.3s ease;
`;

const AppContainer = styled(motion.div)`
  max-width: 700px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  
  @media (max-width: 768px) {
    max-width: 100%;
    padding: 0 0.5rem;
  }
`;

const AppTitle = styled(motion.h1)`
  text-align: center;
  color: #ffffff;
  margin-bottom: 3rem;
  font-size: 3rem;
  font-weight: 700;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  letter-spacing: -0.02em;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 2rem;
  }
`;

const App: React.FC = () => {
  useKeyboardShortcuts();

  return (
    <AppBackground>
      <AppContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <AppTitle
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Todo in Pomodoro Sauce
        </AppTitle>
        <PomodoroTimer />
        <TodoForm />
        <TodoFilters />
        <TodoList />
        <TodoStats />
        <KeyboardHelp />
        <ThemeToggle />
      </AppContainer>
    </AppBackground>
  );
};

export default App;
