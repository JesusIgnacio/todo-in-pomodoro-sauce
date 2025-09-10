import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Draggable } from 'react-beautiful-dnd';
import { useAppDispatch } from '../../store/hooks';
import { toggleTodo, removeTodo } from '../../store/slices/todoSlice';
import { startPomodoro } from '../../store/slices/pomodoroSlice';
import { Todo } from '../../store/slices/todoSlice';

interface TodoItemProps {
  todo: Todo;
  index: number;
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

const ActionButton = styled(motion.button)<{ variant?: 'timer' | 'delete' }>`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 1.2rem;
  min-width: 40px;
  min-height: 40px;

  ${props => props.variant === 'timer' && `
    background: linear-gradient(135deg, #ff6b6b, #ee5a24);
    color: white;
    box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
    
    &:hover {
      box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);
      transform: scale(1.05);
    }
  `}

  ${props => props.variant === 'delete' && `
    &:hover {
      background-color: rgba(231, 76, 60, 0.1);
      transform: scale(1.1);
    }
  `}

  ${props => !props.variant && `
    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
      transform: scale(1.1);
    }
  `}

  &:active {
    transform: scale(0.95);
  }
`;

export const TodoItem: React.FC<TodoItemProps> = ({ todo, index }) => {
  const dispatch = useAppDispatch();

  const handleToggle = () => {
    dispatch(toggleTodo(todo.id));
  };

  const handleDelete = () => {
    dispatch(removeTodo(todo.id));
  };

  const handleStartPomodoro = () => {
    dispatch(startPomodoro({ todoId: todo.id.toString(), todoText: todo.text }));
  };

  return (
    <Draggable draggableId={todo.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            opacity: snapshot.isDragging ? 0.8 : 1,
            transform: snapshot.isDragging 
              ? `${provided.draggableProps.style?.transform} rotate(5deg)`
              : provided.draggableProps.style?.transform,
          }}
        >
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
          {!todo.completed && (
            <ActionButton
              variant="timer"
              onClick={handleStartPomodoro}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Start Pomodoro Timer"
            >
              🍅
            </ActionButton>
          )}
          <ActionButton
            variant="delete"
            onClick={handleDelete}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Delete Todo"
          >
            🗑️
          </ActionButton>
          </TodoItemContainer>
        </div>
      )}
    </Draggable>
  );
};
