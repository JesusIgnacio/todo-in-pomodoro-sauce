import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setVisibilityFilter, VisibilityFilter } from '../../store/slices/filterSlice';
import { selectFilter } from '../../store/selectors';

const FiltersContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f3f4;
  
  @media (max-width: 768px) {
    gap: 0.5rem;
    padding: 0.75rem;
  }
`;

const FilterButton = styled(motion.button)<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: 2px solid ${props => props.$active ? '#3498db' : 'transparent'};
  background-color: ${props => props.$active ? '#3498db' : '#f8f9fa'};
  color: ${props => props.$active ? '#ffffff' : '#2c3e50'};
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  white-space: nowrap;

  &:hover {
    background-color: ${props => props.$active ? '#2980b9' : '#e9ecef'};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  svg {
    font-size: 1rem;
  }
  
  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
    
    span {
      display: none;
    }
  }
`;

const filterConfig = {
  [VisibilityFilter.SHOW_ALL]: { label: 'All', icon: '📋' },
  [VisibilityFilter.SHOW_ACTIVE]: { label: 'Active', icon: '⭕' },
  [VisibilityFilter.SHOW_COMPLETED]: { label: 'Completed', icon: '✅' },
};

export const TodoFilters: React.FC = () => {
  const currentFilter = useAppSelector(selectFilter);
  const dispatch = useAppDispatch();

  const handleFilterChange = (filter: VisibilityFilter) => {
    dispatch(setVisibilityFilter(filter));
  };

  return (
    <FiltersContainer
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      {Object.values(VisibilityFilter).map((filter) => {
        const { label, icon } = filterConfig[filter];
        return (
          <FilterButton
            key={filter}
            $active={currentFilter === filter}
            onClick={() => handleFilterChange(filter)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>{icon}</span>
            <span>{label}</span>
          </FilterButton>
        );
      })}
    </FiltersContainer>
  );
};
