import React from 'react';
import styled from 'styled-components';
import { useAppSelector } from '../../store/hooks';
import { selectTodoStats } from '../../store/selectors';

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-top: 1rem;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #7f8c8d;
  margin-top: 0.25rem;
`;

export const TodoStats: React.FC = () => {
  const stats = useAppSelector(selectTodoStats);

  if (stats.total === 0) {
    return null;
  }

  return (
    <StatsContainer>
      <StatItem>
        <StatNumber>{stats.total}</StatNumber>
        <StatLabel>Total</StatLabel>
      </StatItem>
      <StatItem>
        <StatNumber>{stats.active}</StatNumber>
        <StatLabel>Active</StatLabel>
      </StatItem>
      <StatItem>
        <StatNumber>{stats.completed}</StatNumber>
        <StatLabel>Completed</StatLabel>
      </StatItem>
    </StatsContainer>
  );
};
