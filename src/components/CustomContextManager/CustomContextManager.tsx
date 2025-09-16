import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { 
  addCustomContext, 
  removeCustomContext, 
  loadCustomContexts,
  CustomContext 
} from '../../store/slices/customContextSlice';
import { useTheme, Theme } from '../../contexts/ThemeContext';
import { generateContextId } from '../../utils/gtdContexts';

const ManagerContainer = styled(motion.div)<{ $theme: Theme }>`
  background: ${props => props.$theme.name === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(255, 255, 255, 0.9)'};
  border-radius: 16px;
  padding: 1.5rem;
  margin: 1rem 0;
  backdrop-filter: blur(10px);
  border: 1px solid ${props => props.$theme.name === 'dark' 
    ? 'rgba(255, 255, 255, 0.2)' 
    : 'rgba(0, 0, 0, 0.1)'};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  min-height: 80px;
  display: block;
  width: 100%;
`;

const ManagerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ManagerTitle = styled.h3<{ $theme: Theme }>`
  margin: 0;
  color: ${props => props.$theme.name === 'dark' ? '#ffffff' : '#1f2937'};
  font-size: 1.1rem;
  font-weight: 600;
`;

const AddButton = styled(motion.button)<{ $theme: Theme }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #3B82F6, #1D4ED8);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: linear-gradient(135deg, #1D4ED8, #3B82F6);
    transform: translateY(-1px);
  }
`;

const ContextForm = styled(motion.form)<{ $theme: Theme }>`
  display: grid;
  grid-template-columns: 1fr 80px 120px auto;
  gap: 0.75rem;
  align-items: end;
  padding: 1rem;
  background: ${props => props.$theme.name === 'dark' 
    ? 'rgba(0, 0, 0, 0.2)' 
    : 'rgba(0, 0, 0, 0.05)'};
  border-radius: 12px;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
`;

const FormInput = styled.input<{ $theme: Theme }>`
  padding: 0.75rem;
  border: 2px solid ${props => props.$theme.name === 'dark' 
    ? 'rgba(255, 255, 255, 0.2)' 
    : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 8px;
  background: ${props => props.$theme.name === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : '#ffffff'};
  color: ${props => props.$theme.name === 'dark' ? '#ffffff' : '#1f2937'};
  font-size: 0.875rem;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: #3B82F6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: ${props => props.$theme.name === 'dark' 
      ? 'rgba(255, 255, 255, 0.5)' 
      : 'rgba(0, 0, 0, 0.5)'};
  }
`;

const EmojiInput = styled(FormInput)`
  text-align: center;
  font-size: 1.2rem;
`;

const ColorInput = styled.input`
  width: 100%;
  height: 42px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  outline: none;
`;

const FormButton = styled(motion.button)`
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #10B981, #059669);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: linear-gradient(135deg, #059669, #10B981);
  }

  &:disabled {
    background: #9CA3AF;
    cursor: not-allowed;
  }
`;

const ContextList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ContextItem = styled(motion.div)<{ $theme: Theme }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: ${props => props.$theme.name === 'dark' 
    ? 'rgba(255, 255, 255, 0.05)' 
    : 'rgba(0, 0, 0, 0.02)'};
  border-radius: 8px;
  border: 1px solid ${props => props.$theme.name === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.05)'};
`;

const ContextInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
`;

const ContextTag = styled.span<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  background: ${props => props.$color + '20'};
  color: ${props => props.$color};
  border: 1px solid ${props => props.$color + '40'};
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
`;

const ContextDescription = styled.span<{ $theme: Theme }>`
  color: ${props => props.$theme.name === 'dark' 
    ? 'rgba(255, 255, 255, 0.7)' 
    : 'rgba(0, 0, 0, 0.6)'};
  font-size: 0.875rem;
`;

const DeleteButton = styled(motion.button)`
  padding: 0.5rem;
  background: transparent;
  color: #EF4444;
  border: 1px solid #EF4444;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:hover {
    background: #EF4444;
    color: white;
  }
`;

const CustomContextManager: React.FC = () => {
  const dispatch = useAppDispatch();
  const { theme } = useTheme();
  const customContexts = useAppSelector(state => state.customContexts.contexts);
  
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    label: '',
    icon: '🏷️',
    color: '#3B82F6',
    description: ''
  });

  // Load custom contexts from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('customContexts');
    if (saved) {
      try {
        const contexts = JSON.parse(saved);
        dispatch(loadCustomContexts(contexts));
      } catch (error) {
        console.error('Failed to load custom contexts:', error);
      }
    }
  }, [dispatch]);

  // Save to localStorage whenever contexts change
  useEffect(() => {
    localStorage.setItem('customContexts', JSON.stringify(customContexts));
  }, [customContexts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.label.trim()) return;

    const newContext: CustomContext = {
      id: generateContextId(formData.label),
      label: formData.label.trim(),
      icon: formData.icon,
      color: formData.color,
      description: formData.description.trim()
    };

    dispatch(addCustomContext(newContext));
    
    // Reset form
    setFormData({
      label: '',
      icon: '🏷️',
      color: '#3B82F6',
      description: ''
    });
    setIsFormVisible(false);
  };

  const handleDelete = (contextId: string) => {
    dispatch(removeCustomContext(contextId));
  };

  console.log('CustomContextManager rendering, customContexts:', customContexts);
  
  return (
    <ManagerContainer
      $theme={theme}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ManagerHeader>
        <ManagerTitle $theme={theme}>
          🎨 Custom Contexts ({customContexts.length})
        </ManagerTitle>
        <AddButton
          $theme={theme}
          onClick={() => setIsFormVisible(!isFormVisible)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ zIndex: 10, position: 'relative' }}
        >
          {isFormVisible ? '✕ Cancel' : '+ Add Context'}
        </AddButton>
      </ManagerHeader>

      <AnimatePresence>
        {isFormVisible && (
          <ContextForm
            $theme={theme}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FormInput
              $theme={theme}
              type="text"
              placeholder="Context name (e.g., @Shopping)"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              required
            />
            <EmojiInput
              $theme={theme}
              type="text"
              placeholder="🏷️"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              maxLength={2}
            />
            <ColorInput
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            />
            <FormButton
              type="submit"
              disabled={!formData.label.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Create
            </FormButton>
          </ContextForm>
        )}
      </AnimatePresence>

      {customContexts.length > 0 && (
        <ContextList>
          <AnimatePresence>
            {customContexts.map((context) => (
              <ContextItem
                key={context.id}
                $theme={theme}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <ContextInfo>
                  <ContextTag $color={context.color}>
                    {context.icon} {context.label}
                  </ContextTag>
                  {context.description && (
                    <ContextDescription $theme={theme}>
                      {context.description}
                    </ContextDescription>
                  )}
                </ContextInfo>
                <DeleteButton
                  onClick={() => handleDelete(context.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  🗑️
                </DeleteButton>
              </ContextItem>
            ))}
          </AnimatePresence>
        </ContextList>
      )}
    </ManagerContainer>
  );
};

export default CustomContextManager;
