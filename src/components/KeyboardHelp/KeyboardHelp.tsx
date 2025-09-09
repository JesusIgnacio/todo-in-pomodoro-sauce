import React, { useState } from 'react';
import styled from 'styled-components';

const HelpButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: #3498db;
  color: white;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;

  &:hover {
    background-color: #2980b9;
    transform: scale(1.1);
  }
`;

const HelpModal = styled.div<{ $show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${props => props.$show ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const HelpContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
`;

const HelpTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: #2c3e50;
`;

const ShortcutList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ShortcutItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #ecf0f1;

  &:last-child {
    border-bottom: none;
  }
`;

const ShortcutKey = styled.kbd`
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 3px;
  padding: 0.2rem 0.4rem;
  font-family: monospace;
  font-size: 0.875rem;
`;

const CloseButton = styled.button`
  background-color: #95a5a6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
  width: 100%;

  &:hover {
    background-color: #7f8c8d;
  }
`;

export const KeyboardHelp: React.FC = () => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <>
      <HelpButton onClick={() => setShowHelp(true)} title="Keyboard shortcuts">
        ?
      </HelpButton>
      <HelpModal $show={showHelp} onClick={() => setShowHelp(false)}>
        <HelpContent onClick={(e) => e.stopPropagation()}>
          <HelpTitle>Keyboard Shortcuts</HelpTitle>
          <ShortcutList>
            <ShortcutItem>
              <span>Focus input</span>
              <ShortcutKey>Ctrl + /</ShortcutKey>
            </ShortcutItem>
            <ShortcutItem>
              <span>Show all todos</span>
              <ShortcutKey>Ctrl + 1</ShortcutKey>
            </ShortcutItem>
            <ShortcutItem>
              <span>Show active todos</span>
              <ShortcutKey>Ctrl + 2</ShortcutKey>
            </ShortcutItem>
            <ShortcutItem>
              <span>Show completed todos</span>
              <ShortcutKey>Ctrl + 3</ShortcutKey>
            </ShortcutItem>
          </ShortcutList>
          <CloseButton onClick={() => setShowHelp(false)}>
            Close
          </CloseButton>
        </HelpContent>
      </HelpModal>
    </>
  );
};
