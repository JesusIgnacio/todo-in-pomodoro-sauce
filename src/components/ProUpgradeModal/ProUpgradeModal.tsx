import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme, Theme } from '../../contexts/ThemeContext';
import { useUser } from '../../contexts/UserContext';

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: string;
}

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled(motion.div)<{ $theme: Theme }>`
  background: ${props => props.$theme.name === 'dark' 
    ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' 
    : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'};
  border-radius: 20px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid ${props => props.$theme.name === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)'};
  text-align: center;
`;

const ProBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const ModalTitle = styled.h2<{ $theme: Theme }>`
  color: ${props => props.$theme.colors.text};
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  font-weight: 700;
`;

const ModalDescription = styled.p<{ $theme: Theme }>`
  color: ${props => props.$theme.colors.textSecondary};
  margin: 0 0 1.5rem 0;
  line-height: 1.6;
`;

const FeatureList = styled.ul<{ $theme: Theme }>`
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
  text-align: left;
`;

const FeatureItem = styled.li<{ $theme: Theme }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  color: ${props => props.$theme.colors.text};
  
  &::before {
    content: '✨';
    font-size: 1.2rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const UpgradeButton = styled(motion.button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  font-size: 1rem;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
`;

const CloseButton = styled(motion.button)<{ $theme: Theme }>`
  background: transparent;
  color: ${props => props.$theme.colors.textSecondary};
  border: 1px solid ${props => props.$theme.name === 'dark' 
    ? 'rgba(255, 255, 255, 0.2)' 
    : 'rgba(0, 0, 0, 0.2)'};
  padding: 0.75rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  font-size: 1rem;
`;

const ProUpgradeModal: React.FC<ProUpgradeModalProps> = ({ isOpen, onClose, feature }) => {
  const { theme } = useTheme();
  const { upgradeToPro, userPlan } = useUser();

  const handleUpgrade = () => {
    upgradeToPro();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <ModalContent
            $theme={theme}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ProBadge>
              ⭐ PRO FEATURE
            </ProBadge>
            
            <ModalTitle $theme={theme}>
              Unlock {feature}
            </ModalTitle>
            
            <ModalDescription $theme={theme}>
              This feature is part of our Pro plan. Upgrade to unlock advanced productivity features and take your GTD workflow to the next level.
            </ModalDescription>

            <FeatureList $theme={theme}>
              {userPlan.type === 'free' && (
                <>
                  <FeatureItem $theme={theme}>Custom GTD contexts</FeatureItem>
                  <FeatureItem $theme={theme}>Context color customization</FeatureItem>
                  <FeatureItem $theme={theme}>Advanced context management</FeatureItem>
                  <FeatureItem $theme={theme}>Priority support</FeatureItem>
                </>
              )}
            </FeatureList>

            <ButtonGroup>
              <UpgradeButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleUpgrade}
              >
                Upgrade to Pro
              </UpgradeButton>
              <CloseButton
                $theme={theme}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
              >
                Maybe Later
              </CloseButton>
            </ButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default ProUpgradeModal;
