import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PomodoroState {
  isActive: boolean;
  isPaused: boolean;
  timeRemaining: number; // in seconds
  totalTime: number; // in seconds (25 minutes = 1500 seconds)
  activeTodoId: string | null;
  activeTodoText: string | null;
  isBreak: boolean;
  completedPomodoros: number;
}

const POMODORO_TIME = 25 * 60; // 25 minutes in seconds
const SHORT_BREAK_TIME = 5 * 60; // 5 minutes in seconds
const LONG_BREAK_TIME = 15 * 60; // 15 minutes in seconds

const initialState: PomodoroState = {
  isActive: false,
  isPaused: false,
  timeRemaining: POMODORO_TIME,
  totalTime: POMODORO_TIME,
  activeTodoId: null,
  activeTodoText: null,
  isBreak: false,
  completedPomodoros: 0,
};

const pomodoroSlice = createSlice({
  name: 'pomodoro',
  initialState,
  reducers: {
    startPomodoro: (state, action: PayloadAction<{ todoId: string; todoText: string }>) => {
      state.isActive = true;
      state.isPaused = false;
      state.activeTodoId = action.payload.todoId;
      state.activeTodoText = action.payload.todoText;
      state.timeRemaining = POMODORO_TIME;
      state.totalTime = POMODORO_TIME;
      state.isBreak = false;
    },
    pausePomodoro: (state) => {
      state.isPaused = true;
    },
    resumePomodoro: (state) => {
      state.isPaused = false;
    },
    stopPomodoro: (state) => {
      state.isActive = false;
      state.isPaused = false;
      state.activeTodoId = null;
      state.activeTodoText = null;
      state.timeRemaining = POMODORO_TIME;
      state.totalTime = POMODORO_TIME;
      state.isBreak = false;
    },
    tick: (state) => {
      if (state.isActive && !state.isPaused && state.timeRemaining > 0) {
        state.timeRemaining -= 1;
      }
    },
    completePomodoro: (state) => {
      state.completedPomodoros += 1;
      state.isActive = false;
      state.isPaused = false;
      
      // Determine break type
      const isLongBreak = state.completedPomodoros % 4 === 0;
      const breakTime = isLongBreak ? LONG_BREAK_TIME : SHORT_BREAK_TIME;
      
      state.timeRemaining = breakTime;
      state.totalTime = breakTime;
      state.isBreak = true;
    },
    startBreak: (state) => {
      state.isActive = true;
      state.isPaused = false;
    },
    completeBreak: (state) => {
      state.isActive = false;
      state.isPaused = false;
      state.isBreak = false;
      state.timeRemaining = POMODORO_TIME;
      state.totalTime = POMODORO_TIME;
      state.activeTodoId = null;
      state.activeTodoText = null;
    },
    resetPomodoro: () => {
      return initialState;
    },
  },
});

export const {
  startPomodoro,
  pausePomodoro,
  resumePomodoro,
  stopPomodoro,
  tick,
  completePomodoro,
  startBreak,
  completeBreak,
  resetPomodoro,
} = pomodoroSlice.actions;

export default pomodoroSlice.reducer;
