import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAppSelector } from '../../store/hooks';
import { selectTodoStats } from '../../store/selectors';

const StatsContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  margin-top: 1rem;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
`;

const StatItem = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem 1rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
  }

  svg {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: rgba(255, 255, 255, 0.9);
  }
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const statsConfig = [
  { key: 'total', label: 'Total', icon: '📋', color: '#ffffff' },
  { key: 'active', label: 'Active', icon: '⭕', color: '#ffd93d' },
  { key: 'completed', label: 'Completed', icon: '✅', color: '#6bcf7f' },
];

export const TodoStats: React.FC = () => {
  const stats = useAppSelector(selectTodoStats);

  if (stats.total === 0) {
    return null;
  }

  return (
    <StatsContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {statsConfig.map(({ key, label, icon, color }, index) => (
        <StatItem
          key={key}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
          whileHover={{ scale: 1.05 }}
        >
          <span style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color }}>{icon}</span>
          <StatNumber>{stats[key as keyof typeof stats]}</StatNumber>
          <StatLabel>{label}</StatLabel>
        </StatItem>
      ))}
    </StatsContainer>
  );
};
