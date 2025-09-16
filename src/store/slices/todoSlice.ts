import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type GTDContext = 
  | 'inbox'
  | 'calls'
  | 'computer'
  | 'errands'
  | 'home'
  | 'office'
  | 'waiting-for'
  | 'someday-maybe'
  | string; // Allow custom contexts

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  context: GTDContext;
}

export interface TodoState {
  todos: Todo[];
  nextId: number;
}

const initialState: TodoState = {
  todos: [],
  nextId: 1,
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<{ text: string; context: GTDContext }>) => {
      state.todos.push({
        id: state.nextId,
        text: action.payload.text,
        completed: false,
        context: action.payload.context,
      });
      state.nextId += 1;
    },
    toggleTodo: (state, action: PayloadAction<number>) => {
      const todo = state.todos.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    removeTodo: (state, action: PayloadAction<number>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
    },
    updateTodoContext: (state, action: PayloadAction<{ id: number; context: GTDContext }>) => {
      const todo = state.todos.find(todo => todo.id === action.payload.id);
      if (todo) {
        todo.context = action.payload.context;
      }
    },
  },
});

export const { addTodo, toggleTodo, removeTodo, updateTodoContext } = todoSlice.actions;
export default todoSlice.reducer;
