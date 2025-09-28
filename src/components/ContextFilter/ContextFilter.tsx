import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setContextFilter } from '../../store/slices/filterSlice';
import { GTDContext } from '../../store/slices/todoSlice';
import { getAllContexts } from '../../utils/gtdContexts';
import { useUser } from '../../contexts/UserContext';
import { useTheme, Theme } from '../../contexts/ThemeContext';

const ContextFilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0;
  
  @media (max-width: 768px) {
    gap: 0.25rem;
  }
`;

const ContextButton = styled(motion.button)<{ 
  $isActive: boolean; 
  $color: string;
  $theme: Theme;
}>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 2px solid ${props => props.$isActive ? props.$color : 'transparent'};
  border-radius: 20px;
  background: ${props => {
    if (props.$isActive) {
      return props.$color + '20';
    }
    return props.$theme.name === 'dark' 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(0, 0, 0, 0.05)';
  }};
  color: ${props => props.$theme.name === 'dark' ? '#ffffff' : '#1f2937'};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: ${props => props.$color + '30'};
    border-color: ${props => props.$color};
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
    
    span {
      display: none;
    }
  }
`;

const AllButton = styled(motion.button)<{ 
  $isActive: boolean;
  $theme: Theme;
}>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 2px solid ${props => props.$isActive ? '#6366f1' : 'transparent'};
  border-radius: 20px;
  background: ${props => {
    if (props.$isActive) {
      return '#6366f120';
    }
    return props.$theme.name === 'dark' 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(0, 0, 0, 0.05)';
  }};
  color: ${props => props.$theme.name === 'dark' ? '#ffffff' : '#1f2937'};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: #6366f130;
    border-color: #6366f1;
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
    
    span {
      display: none;
    }
  }
`;

const ContextFilter: React.FC = () => {
  const dispatch = useAppDispatch();
  const { theme } = useTheme();
  const { isPro } = useUser();
  const selectedContext = useAppSelector(state => state.filter.selectedContext);
  const customContexts = useAppSelector(state => state.customContexts.contexts);
  
  const allContexts = getAllContexts(customContexts, isPro);

  const handleContextChange = (context: GTDContext | 'all') => {
    dispatch(setContextFilter(context));
  };

  return (
    <ContextFilterContainer>
      <AllButton
        $isActive={selectedContext === 'all'}
        $theme={theme}
        onClick={() => handleContextChange('all')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        🌟 <span>All Contexts</span>
      </AllButton>
      
      {allContexts.map((context) => (
        <ContextButton
          key={context.id}
          $isActive={selectedContext === context.id}
          $color={context.color}
          $theme={theme}
          onClick={() => handleContextChange(context.id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={context.description}
        >
          {context.icon} <span>{context.label}</span>
        </ContextButton>
      ))}
    </ContextFilterContainer>
  );
};

export default ContextFilter;
