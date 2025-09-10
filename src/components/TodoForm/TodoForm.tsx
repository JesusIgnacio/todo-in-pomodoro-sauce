import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAppDispatch } from '../../store/hooks';
import { addTodo } from '../../store/slices/todoSlice';

const FormContainer = styled(motion.form)`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f3f4;
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
`;

const InputContainer = styled.div`
  position: relative;
  flex: 1;
`;

const TodoInput = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #e1e8ed;
  border-radius: 12px;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s ease;
  background-color: #fafbfc;
  color: #2c3e50;
  min-height: 56px;
  box-sizing: border-box;

  &:focus {
    border-color: #3498db;
    background-color: #ffffff;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }

  &::placeholder {
    color: #7f8c8d;
  }
  
  @media (max-width: 768px) {
    font-size: 16px; /* Prevents zoom on iOS */
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #7f8c8d;
  font-size: 1.1rem;
  pointer-events: none;
  z-index: 1;
`;

const AddButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
  min-height: 56px;

  &:hover {
    background: linear-gradient(135deg, #2980b9, #3498db);
    box-shadow: 0 6px 16px rgba(52, 152, 219, 0.4);
    transform: translateY(-1px);
  }

  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }

  svg {
    font-size: 1.1rem;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 1rem;
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
    <FormContainer
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <InputContainer>
        <InputIcon>
          ✏️
        </InputIcon>
        <TodoInput
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="What needs to be done?"
          autoFocus
        />
      </InputContainer>
      <AddButton
        type="submit"
        disabled={!inputValue.trim()}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        ➕ Add Todo
      </AddButton>
    </FormContainer>
  );
};
