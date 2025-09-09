import { Middleware } from '@reduxjs/toolkit';

const STORAGE_KEY = 'todo-app-state';

export const persistenceMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // Save state to localStorage after each action
  try {
    const state = store.getState();
    const persistedState = {
      todos: state.todos,
      filter: state.filter,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persistedState));
  } catch (error) {
    console.warn('Failed to save state to localStorage:', error);
  }
  
  return result;
};

export const loadPersistedState = () => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (error) {
    console.warn('Failed to load state from localStorage:', error);
    return undefined;
  }
};
