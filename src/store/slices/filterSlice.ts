import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GTDContext } from './todoSlice';

export enum VisibilityFilter {
  SHOW_ALL = 'SHOW_ALL',
  SHOW_ACTIVE = 'SHOW_ACTIVE',
  SHOW_COMPLETED = 'SHOW_COMPLETED',
}

export interface FilterState {
  currentFilter: VisibilityFilter;
  selectedContext: GTDContext | 'all';
}

const initialState: FilterState = {
  currentFilter: VisibilityFilter.SHOW_ALL,
  selectedContext: 'all',
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setVisibilityFilter: (state, action: PayloadAction<VisibilityFilter>) => {
      state.currentFilter = action.payload;
    },
    setContextFilter: (state, action: PayloadAction<GTDContext | 'all'>) => {
      state.selectedContext = action.payload;
    },
  },
});

export const { setVisibilityFilter, setContextFilter } = filterSlice.actions;
export default filterSlice.reducer;
