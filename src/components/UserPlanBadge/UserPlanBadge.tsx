import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTheme, Theme } from '../../contexts/ThemeContext';
import { useUser } from '../../contexts/UserContext';

const PlanBadge = styled(motion.div)<{ $theme: Theme; $isPro: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => props.$isPro 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    : props.$theme.name === 'dark' 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(0, 0, 0, 0.1)'};
  color: ${props => props.$isPro 
    ? 'white' 
    : props.$theme.colors.textSecondary};
  border: 1px solid ${props => props.$isPro 
    ? 'transparent'
    : props.$theme.name === 'dark' 
      ? 'rgba(255, 255, 255, 0.2)' 
      : 'rgba(0, 0, 0, 0.2)'};
`;

const UserPlanBadge: React.FC = () => {
  const { theme } = useTheme();
  const { isPro, userPlan } = useUser();

  return (
    <PlanBadge
      $theme={theme}
      $isPro={isPro}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {isPro ? '⭐' : '🆓'} {userPlan.name}
    </PlanBadge>
  );
};

export default UserPlanBadge;
