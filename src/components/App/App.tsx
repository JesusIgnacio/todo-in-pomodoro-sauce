import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { TodoForm } from '../TodoForm/TodoForm';
import { TodoList } from '../TodoList/TodoList';
import { TodoFilters } from '../TodoFilters/TodoFilters';
import ContextFilter from '../ContextFilter/ContextFilter';
import CustomContextManager from '../CustomContextManager/CustomContextManager';
import { TodoStats } from '../TodoStats/TodoStats';
import { KeyboardHelp } from '../KeyboardHelp/KeyboardHelp';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import { PomodoroTimer } from '../PomodoroTimer/PomodoroTimer';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { startPomodoro } from '../../store/slices/pomodoroSlice';
import { useTheme } from '../../contexts/ThemeContext';

const AppBackground = styled.div<{ $theme: any }>`
  min-height: 100vh;
  background: ${props => props.$theme.colors.background};
  padding: 2rem 1rem;
  transition: all 0.3s ease;
`;

const AppContainer = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  
  @media (max-width: 768px) {
    max-width: 100%;
    padding: 0 0.5rem;
  }
`;

const MainLayout = styled.div`
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  
  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const TodoSection = styled.div`
  flex: 0 0 60%;
  
  @media (max-width: 1024px) {
    flex: none;
    width: 100%;
  }
`;

const PomodoroSection = styled.div`
  flex: 0 0 40%;
  position: sticky;
  top: 2rem;
  
  @media (max-width: 1024px) {
    flex: none;
    width: 100%;
    position: static;
    order: -1; /* Show timer first on mobile */
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
  const dispatch = useAppDispatch();
  const { theme } = useTheme();
  const todos = useAppSelector(state => state.todos.todos);

  const handleDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;

    if (!destination) return;

    // If dropped on pomodoro timer
    if (destination.droppableId === 'pomodoro-timer') {
      const todo = todos.find(t => t.id.toString() === draggableId);
      if (todo && !todo.completed) {
        dispatch(startPomodoro({ todoId: todo.id.toString(), todoText: todo.text }));
      }
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <AppBackground $theme={theme}>
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
        <MainLayout>
          <TodoSection>
            <TodoForm />
            <TodoFilters />
            <ContextFilter />
            <CustomContextManager />
            <TodoList />
            <TodoStats />
          </TodoSection>
          <PomodoroSection>
            <PomodoroTimer />
          </PomodoroSection>
        </MainLayout>
        <KeyboardHelp />
        <ThemeToggle />
      </AppContainer>
    </AppBackground>
    </DragDropContext>
  );
};

export default App;
