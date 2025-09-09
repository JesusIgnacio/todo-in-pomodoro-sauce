import React from 'react';
import styled from 'styled-components';
import { useAppSelector } from '../../store/hooks';
import { selectVisibleTodos } from '../../store/selectors';
import { TodoItem } from '../TodoItem/TodoItem';

const ListContainer = styled.div`
  margin-bottom: 2rem;
`;

const TodoListContainer = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: #7f8c8d;
  font-size: 1.1rem;
`;

export const TodoList: React.FC = () => {
  const visibleTodos = useAppSelector(selectVisibleTodos);

  if (visibleTodos.length === 0) {
    return (
      <ListContainer>
        <EmptyState>
          No todos to display. Add one above to get started!
        </EmptyState>
      </ListContainer>
    );
  }

  return (
    <ListContainer>
      <TodoListContainer>
        {visibleTodos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </TodoListContainer>
    </ListContainer>
  );
};
