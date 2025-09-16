import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { VisibilityFilter } from '../slices/filterSlice';
import { Todo } from '../slices/todoSlice';

export const selectTodos = (state: RootState) => state.todos.todos;
export const selectFilter = (state: RootState) => state.filter.currentFilter;
export const selectContextFilter = (state: RootState) => state.filter.selectedContext;

export const selectFilteredTodos = createSelector(
  [selectTodos, selectFilter, selectContextFilter],
  (todos, filter, contextFilter) => {
    let filteredTodos = todos;

    // Filter by completion status
    switch (filter) {
      case VisibilityFilter.SHOW_ACTIVE:
        filteredTodos = filteredTodos.filter((todo: Todo) => !todo.completed);
        break;
      case VisibilityFilter.SHOW_COMPLETED:
        filteredTodos = filteredTodos.filter((todo: Todo) => todo.completed);
        break;
      default:
        break;
    }

    // Filter by context
    if (contextFilter !== 'all') {
      filteredTodos = filteredTodos.filter((todo: Todo) => todo.context === contextFilter);
    }

    return filteredTodos;
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
