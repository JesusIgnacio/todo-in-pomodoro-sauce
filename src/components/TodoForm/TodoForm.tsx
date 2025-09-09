import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch } from '../../store/hooks';
import { addTodo } from '../../store/slices/todoSlice';

const FormContainer = styled.form`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const TodoInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #3498db;
  }

  &::placeholder {
    color: #95a5a6;
  }
`;

const AddButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #2980b9;
  }

  &:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }
`;

export const TodoForm: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedValue = inputValue.trim();
    
    if (trimmedValue) {
      dispatch(addTodo(trimmedValue));
      setInputValue('');
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <TodoInput
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="What needs to be done?"
        autoFocus
      />
      <AddButton type="submit" disabled={!inputValue.trim()}>
        Add Todo
      </AddButton>
    </FormContainer>
  );
};
