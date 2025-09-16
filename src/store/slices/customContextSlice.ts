import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CustomContext {
  id: string;
  label: string;
  icon: string;
  color: string;
  description: string;
}

export interface CustomContextState {
  contexts: CustomContext[];
}

const initialState: CustomContextState = {
  contexts: [],
};

const customContextSlice = createSlice({
  name: 'customContexts',
  initialState,
  reducers: {
    addCustomContext: (state, action: PayloadAction<CustomContext>) => {
      state.contexts.push(action.payload);
    },
    removeCustomContext: (state, action: PayloadAction<string>) => {
      state.contexts = state.contexts.filter(context => context.id !== action.payload);
    },
    updateCustomContext: (state, action: PayloadAction<CustomContext>) => {
      const index = state.contexts.findIndex(context => context.id === action.payload.id);
      if (index !== -1) {
        state.contexts[index] = action.payload;
      }
    },
    loadCustomContexts: (state, action: PayloadAction<CustomContext[]>) => {
      state.contexts = action.payload;
    },
  },
});

export const { 
  addCustomContext, 
  removeCustomContext, 
  updateCustomContext, 
  loadCustomContexts 
} = customContextSlice.actions;

export default customContextSlice.reducer;
