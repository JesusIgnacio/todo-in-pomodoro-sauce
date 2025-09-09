import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './index';
import { VisibilityFilter } from './slices/filterSlice';
import { Todo } from './slices/todoSlice';

export const selectTodos = (state: RootState) => state.todos.todos;
export const selectFilter = (state: RootState) => state.filter.currentFilter;

export const selectVisibleTodos = createSelector(
  [selectTodos, selectFilter],
  (todos, filter) => {
    switch (filter) {
      case VisibilityFilter.SHOW_ALL:
        return todos;
      case VisibilityFilter.SHOW_ACTIVE:
        return todos.filter((todo: Todo) => !todo.completed);
      case VisibilityFilter.SHOW_COMPLETED:
        return todos.filter((todo: Todo) => todo.completed);
      default:
        return todos;
    }
  }
);

export const selectTodoStats = createSelector(
  [selectTodos],
  (todos) => ({
    total: todos.length,
    completed: todos.filter((todo: Todo) => todo.completed).length,
    active: todos.filter((todo: Todo) => !todo.completed).length,
  })
);
