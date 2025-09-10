import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './slices/todoSlice';
import filterReducer from './slices/filterSlice';
import pomodoroReducer from './slices/pomodoroSlice';

export const store = configureStore({
  reducer: {
    todos: todoReducer,
    filter: filterReducer,
    pomodoro: pomodoroReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
