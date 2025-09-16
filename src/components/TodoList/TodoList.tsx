import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Droppable } from 'react-beautiful-dnd';
import { useAppSelector } from '../../store/hooks';
import { selectFilteredTodos } from '../../store/selectors/todoSelectors';
import { TodoItem } from '../TodoItem/TodoItem';

const ListContainer = styled.div`
  margin-bottom: 2rem;
`;

const TodoListContainer = styled.ul`
  list-style: none;
  padding: 1rem;
  margin: 0;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f3f4;
`;

const EmptyState = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 2rem;
  color: #7f8c8d;
  font-size: 1.1rem;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f3f4;

  svg {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: #bdc3c7;
  }

  h3 {
    margin: 0 0 0.5rem 0;
    color: #2c3e50;
    font-weight: 600;
  }

  p {
    margin: 0;
    opacity: 0.8;
  }
`;

export const TodoList: React.FC = () => {
  const visibleTodos = useAppSelector(selectFilteredTodos);

  if (visibleTodos.length === 0) {
    return (
      <ListContainer>
        <EmptyState
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
          <h3>No todos yet!</h3>
          <p>Add a task above to get started</p>
        </EmptyState>
      </ListContainer>
    );
  }

  return (
    <ListContainer>
      <Droppable droppableId="todo-list">
        {(provided) => (
          <TodoListContainer
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <AnimatePresence>
              {visibleTodos.map((todo: any, index: number) => (
                <TodoItem key={todo.id} todo={todo} index={index} />
              ))}
            </AnimatePresence>
            {provided.placeholder}
          </TodoListContainer>
        )}
      </Droppable>
    </ListContainer>
  );
};
