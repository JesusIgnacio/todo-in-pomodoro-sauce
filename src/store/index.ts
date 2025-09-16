import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './slices/todoSlice';
import filterReducer from './slices/filterSlice';
import pomodoroReducer from './slices/pomodoroSlice';
import customContextReducer from './slices/customContextSlice';

export const store = configureStore({
  reducer: {
    todos: todoReducer,
    filter: filterReducer,
    pomodoro: pomodoroReducer,
    customContexts: customContextReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
