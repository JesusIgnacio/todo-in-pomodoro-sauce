import { configureStore, combineReducers } from '@reduxjs/toolkit';
import todoSlice from './slices/todoSlice';
import filterSlice from './slices/filterSlice';
import { loadPersistedState } from './middleware/persistenceMiddleware';

const rootReducer = combineReducers({
  todos: todoSlice,
  filter: filterSlice,
});

const preloadedState = loadPersistedState();

export const store = configureStore({
  reducer: rootReducer,
  preloadedState,
});

// Add persistence after store creation
store.subscribe(() => {
  try {
    const state = store.getState();
    const persistedState = {
      todos: state.todos,
      filter: state.filter,
    };
    localStorage.setItem('todo-app-state', JSON.stringify(persistedState));
  } catch (error) {
    console.warn('Failed to save state to localStorage:', error);
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
