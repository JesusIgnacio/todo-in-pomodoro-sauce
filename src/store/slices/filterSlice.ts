import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum VisibilityFilter {
  SHOW_ALL = 'SHOW_ALL',
  SHOW_ACTIVE = 'SHOW_ACTIVE',
  SHOW_COMPLETED = 'SHOW_COMPLETED',
}

export interface FilterState {
  currentFilter: VisibilityFilter;
}

const initialState: FilterState = {
  currentFilter: VisibilityFilter.SHOW_ALL,
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setVisibilityFilter: (state, action: PayloadAction<VisibilityFilter>) => {
      state.currentFilter = action.payload;
    },
  },
});

export const { setVisibilityFilter } = filterSlice.actions;
export default filterSlice.reducer;
