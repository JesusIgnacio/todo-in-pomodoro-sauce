import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from './App';
import todoSlice from '../../store/slices/todoSlice';
import filterSlice from '../../store/slices/filterSlice';

const createTestStore = () => {
  return configureStore({
    reducer: {
      todos: todoSlice,
      filter: filterSlice,
    },
  });
};

const renderWithProvider = (component: React.ReactElement) => {
  const store = createTestStore();
  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};

describe('App Component', () => {
  test('renders the main title', () => {
    renderWithProvider(<App />);
    expect(screen.getByText('Todo in Pomodoro Sauce')).toBeInTheDocument();
  });

  test('allows adding a new todo', () => {
    renderWithProvider(<App />);
    
    const input = screen.getByPlaceholderText('What needs to be done?');
    const addButton = screen.getByText('Add Todo');
    
    fireEvent.change(input, { target: { value: 'Test todo' } });
    fireEvent.click(addButton);
    
    expect(screen.getByText('Test todo')).toBeInTheDocument();
  });

  test('shows empty state when no todos', () => {
    renderWithProvider(<App />);
    expect(screen.getByText('No todos to display. Add one above to get started!')).toBeInTheDocument();
  });

  test('can toggle todo completion', () => {
    renderWithProvider(<App />);
    
    // Add a todo first
    const input = screen.getByPlaceholderText('What needs to be done?');
    const addButton = screen.getByText('Add Todo');
    
    fireEvent.change(input, { target: { value: 'Test todo' } });
    fireEvent.click(addButton);
    
    // Toggle completion
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(checkbox).toBeChecked();
  });

  test('can delete a todo', () => {
    renderWithProvider(<App />);
    
    // Add a todo first
    const input = screen.getByPlaceholderText('What needs to be done?');
    const addButton = screen.getByText('Add Todo');
    
    fireEvent.change(input, { target: { value: 'Test todo' } });
    fireEvent.click(addButton);
    
    // Delete the todo
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);
    
    expect(screen.queryByText('Test todo')).not.toBeInTheDocument();
  });

  test('filters work correctly', () => {
    renderWithProvider(<App />);
    
    // Add completed and active todos
    const input = screen.getByPlaceholderText('What needs to be done?');
    const addButton = screen.getByText('Add Todo');
    
    fireEvent.change(input, { target: { value: 'Active todo' } });
    fireEvent.click(addButton);
    
    fireEvent.change(input, { target: { value: 'Completed todo' } });
    fireEvent.click(addButton);
    
    // Complete the second todo
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]);
    
    // Test Active filter
    const activeFilter = screen.getByRole('button', { name: 'Active' });
    fireEvent.click(activeFilter);
    
    expect(screen.getByText('Active todo')).toBeInTheDocument();
    expect(screen.queryByText('Completed todo')).not.toBeInTheDocument();
    
    // Test Completed filter
    const completedFilter = screen.getByRole('button', { name: 'Completed' });
    fireEvent.click(completedFilter);
    
    expect(screen.queryByText('Active todo')).not.toBeInTheDocument();
    expect(screen.getByText('Completed todo')).toBeInTheDocument();
  });
});
