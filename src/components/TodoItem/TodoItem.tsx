import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAppDispatch } from '../../store/hooks';
import { toggleTodo, removeTodo } from '../../store/slices/todoSlice';
import { Todo } from '../../store/slices/todoSlice';

interface TodoItemProps {
  todo: Todo;
}

const TodoItemContainer = styled(motion.li)<{ $completed: boolean }>`
  display: flex;
  align-items: center;
  padding: 1.25rem;
  margin-bottom: 0.5rem;
  border-radius: 12px;
  background-color: ${props => props.$completed ? '#f8f9fa' : '#ffffff'};
  border: 1px solid ${props => props.$completed ? '#e9ecef' : '#f1f3f4'};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background-color: ${props => props.$completed ? '#e9ecef' : '#f8f9fa'};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }
`;

const CheckboxContainer = styled.div<{ $completed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-right: 1rem;
  border-radius: 50%;
  border: 2px solid ${props => props.$completed ? '#27ae60' : '#bdc3c7'};
  background-color: ${props => props.$completed ? '#27ae60' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #27ae60;
    background-color: ${props => props.$completed ? '#27ae60' : 'rgba(39, 174, 96, 0.1)'};
  }

  svg {
    color: white;
    font-size: 14px;
  }
`;

const TodoText = styled.span<{ $completed: boolean }>`
  flex: 1;
  font-size: 1rem;
  color: ${props => props.$completed ? '#7f8c8d' : '#2c3e50'};
  text-decoration: ${props => props.$completed ? 'line-through' : 'none'};
  transition: all 0.2s ease;
`;

const DeleteButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s ease;

  ${TodoItemContainer}:hover & {
    opacity: 1;
  }

  &:hover {
    background-color: #ff5252;
    transform: scale(1.05);
  }

  svg {
    font-size: 16px;
  }
`;

export const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const dispatch = useAppDispatch();

  const handleToggle = () => {
    dispatch(toggleTodo(todo.id));
  };

  const handleDelete = () => {
    dispatch(removeTodo(todo.id));
  };

  return (
    <TodoItemContainer
      $completed={todo.completed}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      layout
    >
      <CheckboxContainer $completed={todo.completed} onClick={handleToggle}>
        {todo.completed ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            ✓
          </motion.div>
        ) : (
          <span style={{ opacity: 0.3 }}>○</span>
        )}
      </CheckboxContainer>
      <TodoText $completed={todo.completed} onClick={handleToggle}>
        {todo.text}
      </TodoText>
      <DeleteButton
        onClick={handleDelete}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        🗑️
      </DeleteButton>
    </TodoItemContainer>
  );
};
