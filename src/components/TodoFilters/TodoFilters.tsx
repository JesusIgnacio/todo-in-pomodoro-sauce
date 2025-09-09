import React from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setVisibilityFilter, VisibilityFilter } from '../../store/slices/filterSlice';
import { selectFilter } from '../../store/selectors';

const FiltersContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;

const FilterButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1rem;
  border: 2px solid ${props => props.$active ? '#3498db' : '#e1e8ed'};
  background-color: ${props => props.$active ? '#3498db' : '#ffffff'};
  color: ${props => props.$active ? '#ffffff' : '#2c3e50'};
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #3498db;
    background-color: ${props => props.$active ? '#2980b9' : '#f8f9fa'};
  }
`;

const filterLabels = {
  [VisibilityFilter.SHOW_ALL]: 'All',
  [VisibilityFilter.SHOW_ACTIVE]: 'Active',
  [VisibilityFilter.SHOW_COMPLETED]: 'Completed',
};

export const TodoFilters: React.FC = () => {
  const currentFilter = useAppSelector(selectFilter);
  const dispatch = useAppDispatch();

  const handleFilterChange = (filter: VisibilityFilter) => {
    dispatch(setVisibilityFilter(filter));
  };

  return (
    <FiltersContainer>
      {Object.values(VisibilityFilter).map((filter) => (
        <FilterButton
          key={filter}
          $active={currentFilter === filter}
          onClick={() => handleFilterChange(filter)}
        >
          {filterLabels[filter]}
        </FilterButton>
      ))}
    </FiltersContainer>
  );
};
