import React from 'react';
import styled from 'styled-components';
import { TodoForm } from '../TodoForm/TodoForm';
import { TodoList } from '../TodoList/TodoList';
import { TodoFilters } from '../TodoFilters/TodoFilters';
import { TodoStats } from '../TodoStats/TodoStats';
import { KeyboardHelp } from '../KeyboardHelp/KeyboardHelp';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';

const AppContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
`;

const AppTitle = styled.h1`
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  font-weight: 300;
`;

const App: React.FC = () => {
  useKeyboardShortcuts();

  return (
    <AppContainer>
      <AppTitle>Todo in Pomodoro Sauce</AppTitle>
      <TodoForm />
      <TodoFilters />
      <TodoList />
      <TodoStats />
      <KeyboardHelp />
      <ThemeToggle />
    </AppContainer>
  );
};

export default App;
