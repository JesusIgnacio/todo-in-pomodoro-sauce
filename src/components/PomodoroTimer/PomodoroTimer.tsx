import React, { useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  startPomodoro,
  pausePomodoro,
  resumePomodoro,
  stopPomodoro,
  tick,
  completePomodoro,
  startBreak,
  completeBreak,
  resetPomodoro,
} from '../../store/slices/pomodoroSlice';

const PomodoroContainer = styled(motion.div)`
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(255, 107, 107, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: white;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const TimerTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
`;

const TimerDisplay = styled(motion.div)`
  font-size: 4rem;
  font-weight: 800;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
  margin: 1.5rem 0;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const ActiveTodo = styled(motion.div)`
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 1rem;
  margin: 1rem 0;
  font-size: 1.1rem;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const ProgressBar = styled.div<{ progress: number }>`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  margin: 1.5rem 0;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${props => props.progress}%;
    background: linear-gradient(90deg, #ffffff, #f8f9fa);
    border-radius: 4px;
    transition: width 1s ease;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 1.5rem;
`;

const TimerButton = styled(motion.button)<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 100px;
  
  ${props => {
    switch (props.variant) {
      case 'danger':
        return `
          background: linear-gradient(135deg, #e74c3c, #c0392b);
          color: white;
          box-shadow: 0 4px 15px rgba(231, 76, 60, 0.4);
          
          &:hover {
            box-shadow: 0 6px 20px rgba(231, 76, 60, 0.6);
          }
        `;
      case 'secondary':
        return `
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
          
          &:hover {
            background: rgba(255, 255, 255, 0.3);
          }
        `;
      default:
        return `
          background: linear-gradient(135deg, #2ecc71, #27ae60);
          color: white;
          box-shadow: 0 4px 15px rgba(46, 204, 113, 0.4);
          
          &:hover {
            box-shadow: 0 6px 20px rgba(46, 204, 113, 0.6);
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }
`;

const DropZone = styled(motion.div)<{ isActive: boolean }>`
  border: 2px dashed ${props => props.isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.4)'};
  border-radius: 12px;
  padding: 2rem;
  margin: 1rem 0;
  text-align: center;
  background: ${props => props.isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    border-color: #ffffff;
    background: rgba(255, 255, 255, 0.05);
  }
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
`;

const StatItem = styled.div`
  text-align: center;
  
  .number {
    font-size: 1.5rem;
    font-weight: 700;
    display: block;
  }
  
  .label {
    font-size: 0.9rem;
    opacity: 0.8;
    margin-top: 0.25rem;
  }
`;

export const PomodoroTimer: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    isActive,
    isPaused,
    timeRemaining,
    totalTime,
    activeTodoId,
    activeTodoText,
    isBreak,
    completedPomodoros,
  } = useAppSelector(state => state.pomodoro);

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const progress = ((totalTime - timeRemaining) / totalTime) * 100;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        dispatch(tick());
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, isPaused, dispatch]);

  useEffect(() => {
    if (timeRemaining === 0 && isActive) {
      if (isBreak) {
        dispatch(completeBreak());
        // Could add notification here
      } else {
        dispatch(completePomodoro());
        // Could add notification here
      }
    }
  }, [timeRemaining, isActive, isBreak, dispatch]);

  const handleStart = () => {
    if (isBreak) {
      dispatch(startBreak());
    } else if (isPaused) {
      dispatch(resumePomodoro());
    }
  };

  const handlePause = () => {
    dispatch(pausePomodoro());
  };

  const handleStop = () => {
    dispatch(stopPomodoro());
  };

  const handleReset = () => {
    dispatch(resetPomodoro());
  };

  const getTimerTitle = () => {
    if (isBreak) {
      return completedPomodoros % 4 === 0 ? '🌟 Long Break Time!' : '☕ Short Break Time!';
    }
    if (activeTodoText) {
      return '🍅 Focus Time!';
    }
    return '🍅 Pomodoro Timer';
  };

  const getStatusText = () => {
    if (isBreak) {
      return 'Take a well-deserved break!';
    }
    if (isActive && !isPaused) {
      return 'Stay focused! 💪';
    }
    if (isPaused) {
      return 'Timer paused ⏸️';
    }
    return 'Ready to start a pomodoro session';
  };

  return (
    <PomodoroContainer
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <TimerTitle>{getTimerTitle()}</TimerTitle>
      
      <TimerDisplay
        animate={{ scale: isActive && !isPaused ? [1, 1.02, 1] : 1 }}
        transition={{ duration: 1, repeat: isActive && !isPaused ? Infinity : 0 }}
      >
        {formatTime(timeRemaining)}
      </TimerDisplay>

      <ProgressBar progress={progress} />

      {activeTodoText && !isBreak && (
        <ActiveTodo
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          📝 Working on: {activeTodoText}
        </ActiveTodo>
      )}

      {!activeTodoText && !isBreak && (
        <DropZone
          isActive={false}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</div>
          <div>Drag a todo here to start a focused session</div>
          <div style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '0.5rem' }}>
            Or click a todo's timer button
          </div>
        </DropZone>
      )}

      <div style={{ fontSize: '1rem', margin: '1rem 0', opacity: 0.9 }}>
        {getStatusText()}
      </div>

      <ButtonGroup>
        {!isActive && !isBreak && (
          <TimerButton
            variant="primary"
            disabled={!activeTodoText}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
          >
            ▶️ Start
          </TimerButton>
        )}

        {isActive && !isPaused && (
          <TimerButton
            variant="secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePause}
          >
            ⏸️ Pause
          </TimerButton>
        )}

        {isPaused && (
          <TimerButton
            variant="primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
          >
            ▶️ Resume
          </TimerButton>
        )}

        {isBreak && !isActive && (
          <TimerButton
            variant="primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
          >
            ▶️ Start Break
          </TimerButton>
        )}

        {(isActive || isPaused) && (
          <TimerButton
            variant="danger"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStop}
          >
            ⏹️ Stop
          </TimerButton>
        )}

        <TimerButton
          variant="secondary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
        >
          🔄 Reset
        </TimerButton>
      </ButtonGroup>

      <StatsContainer>
        <StatItem>
          <span className="number">{completedPomodoros}</span>
          <div className="label">Completed</div>
        </StatItem>
        <StatItem>
          <span className="number">{Math.floor(completedPomodoros * 25 / 60)}h</span>
          <div className="label">Focus Time</div>
        </StatItem>
        <StatItem>
          <span className="number">{completedPomodoros > 0 ? Math.floor(completedPomodoros / 4) : 0}</span>
          <div className="label">Cycles</div>
        </StatItem>
      </StatsContainer>
    </PomodoroContainer>
  );
};
