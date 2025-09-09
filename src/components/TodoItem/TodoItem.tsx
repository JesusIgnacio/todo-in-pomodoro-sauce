import React from 'react';
import styled from 'styled-components';
import { useAppDispatch } from '../../store/hooks';
import { toggleTodo, removeTodo } from '../../store/slices/todoSlice';
import { Todo } from '../../store/slices/todoSlice';

interface TodoItemProps {
  todo: Todo;
}

const TodoItemContainer = styled.li<{ $completed: boolean }>`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #ecf0f1;
  background-color: ${props => props.$completed ? '#f8f9fa' : '#ffffff'};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${props => props.$completed ? '#e9ecef' : '#f8f9fa'};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const Checkbox = styled.input`
  margin-right: 1rem;
  transform: scale(1.2);
  cursor: pointer;
`;

const TodoText = styled.span<{ $completed: boolean }>`
  flex: 1;
  font-size: 1rem;
  color: ${props => props.$completed ? '#7f8c8d' : '#2c3e50'};
  text-decoration: ${props => props.$completed ? 'line-through' : 'none'};
  transition: all 0.2s ease;
`;

const DeleteButton = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s ease;

  ${TodoItemContainer}:hover & {
    opacity: 1;
  }

  &:hover {
    background-color: #c0392b;
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
    <TodoItemContainer $completed={todo.completed}>
      <Checkbox
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
      />
      <TodoText $completed={todo.completed}>
        {todo.text}
      </TodoText>
      <DeleteButton onClick={handleDelete}>
        Delete
      </DeleteButton>
    </TodoItemContainer>
  );
};
