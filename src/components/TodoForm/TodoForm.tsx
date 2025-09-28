import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera } from 'react-feather';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addTodo, GTDContext } from '../../store/slices/todoSlice';
import { getAllContexts } from '../../utils/gtdContexts';
import { useUser } from '../../contexts/UserContext';
import { ImageTodoExtractor } from '../ImageTodoExtractor';

const FormContainer = styled(motion.form)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f3f4;
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
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
  flex: 1;

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

const CameraButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #9b59b6, #8e44ad);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(155, 89, 182, 0.3);
  min-height: 56px;
  min-width: 160px;

  &:hover {
    background: linear-gradient(135deg, #8e44ad, #9b59b6);
    box-shadow: 0 6px 16px rgba(155, 89, 182, 0.4);
    transform: translateY(-1px);
  }

  svg {
    font-size: 1.1rem;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 1rem;
    min-width: auto;
  }
`;

const ContextSelect = styled.select`
  padding: 1rem;
  border: 2px solid #e1e8ed;
  border-radius: 12px;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s ease;
  background-color: #fafbfc;
  color: #2c3e50;
  min-height: 56px;
  min-width: 200px;
  cursor: pointer;

  &:focus {
    border-color: #3498db;
    background-color: #ffffff;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }
  
  @media (max-width: 768px) {
    font-size: 16px;
    min-width: auto;
    width: 100%;
  }
`;

export const TodoForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isPro } = useUser();
  const customContexts = useAppSelector(state => state.customContexts.contexts);
  const [text, setText] = useState('');
  const [selectedContext, setSelectedContext] = useState<GTDContext>('inbox');
  const [showImageExtractor, setShowImageExtractor] = useState(false);
  
  const allContexts = getAllContexts(customContexts, isPro);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedValue = text.trim();
    
    if (trimmedValue) {
      dispatch(addTodo({ text: trimmedValue, context: selectedContext }));
      setText('');
      setSelectedContext('inbox');
    }
  };

  return (
    <>
      <FormContainer
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FormRow>
          <InputContainer>
            <InputIcon>
              ✏️
            </InputIcon>
            <TodoInput
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What needs to be done?"
              autoFocus
            />
          </InputContainer>
          <ContextSelect
            value={selectedContext}
            onChange={(e) => setSelectedContext(e.target.value as GTDContext)}
          >
            {allContexts.map((context: any) => (
              <option key={context.id} value={context.id}>
                {context.icon} {context.label}
              </option>
            ))}
          </ContextSelect>
        </FormRow>
        <ButtonGroup>
          <AddButton
            type="submit"
            disabled={!text.trim()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            ➕ Add Todo
          </AddButton>
          <CameraButton
            type="button"
            onClick={() => setShowImageExtractor(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Camera size={20} />
            From Image
          </CameraButton>
        </ButtonGroup>
      </FormContainer>
      
      <AnimatePresence>
        {showImageExtractor && (
          <ImageTodoExtractor onClose={() => setShowImageExtractor(false)} />
        )}
      </AnimatePresence>
    </>
  );
};
