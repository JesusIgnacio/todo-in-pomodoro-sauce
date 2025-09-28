import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { mlService, MLProcessingResult, ExtractedTodo } from '../../services/mlService';

export interface ImageProcessingState {
  isProcessing: boolean;
  isInitialized: boolean;
  error: string | null;
  lastResult: MLProcessingResult | null;
  extractedTodos: ExtractedTodo[];
  selectedTodos: string[]; // IDs of todos selected for import
  processingProgress: number;
}

const initialState: ImageProcessingState = {
  isProcessing: false,
  isInitialized: false,
  error: null,
  lastResult: null,
  extractedTodos: [],
  selectedTodos: [],
  processingProgress: 0,
};

// Async thunk for initializing ML service
export const initializeMLService = createAsyncThunk(
  'imageProcessing/initialize',
  async (_, { rejectWithValue }) => {
    try {
      await mlService.initialize();
      return true;
    } catch (error) {
      console.error('Failed to initialize ML Service:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'ML Service initialization failed');
    }
  }
);

// Async thunk for processing image file
export const processImageFile = createAsyncThunk(
  'imageProcessing/processFile',
  async (file: File, { rejectWithValue, dispatch }) => {
    try {
      // Set up progress callback for real-time OCR progress
      mlService.setProgressCallback((progress) => {
        dispatch(setProcessingProgress(progress));
      });
      
      dispatch(setProcessingProgress(10));
      const result = await mlService.extractTodosFromImage(file);
      dispatch(setProcessingProgress(100));
      return result;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to process image');
    }
  }
);

// Async thunk for processing camera capture
export const processCameraCapture = createAsyncThunk(
  'imageProcessing/processCamera',
  async (canvas: HTMLCanvasElement, { rejectWithValue, dispatch }) => {
    try {
      // Set up progress callback for real-time OCR progress
      mlService.setProgressCallback((progress) => {
        dispatch(setProcessingProgress(progress));
      });
      
      dispatch(setProcessingProgress(10));
      const result = await mlService.processImageFromCamera(canvas);
      dispatch(setProcessingProgress(100));
      return result;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to process camera capture');
    }
  }
);

const imageProcessingSlice = createSlice({
  name: 'imageProcessing',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearResults: (state) => {
      state.lastResult = null;
      state.extractedTodos = [];
      state.selectedTodos = [];
      state.processingProgress = 0;
    },
    toggleTodoSelection: (state, action: PayloadAction<string>) => {
      const todoText = action.payload;
      const index = state.selectedTodos.indexOf(todoText);
      if (index > -1) {
        state.selectedTodos.splice(index, 1);
      } else {
        state.selectedTodos.push(todoText);
      }
    },
    selectAllTodos: (state) => {
      state.selectedTodos = state.extractedTodos.map(todo => todo.text);
    },
    deselectAllTodos: (state) => {
      state.selectedTodos = [];
    },
    setProcessingProgress: (state, action: PayloadAction<number>) => {
      state.processingProgress = action.payload;
    },
    updateTodoText: (state, action: PayloadAction<{ originalText: string; newText: string }>) => {
      const { originalText, newText } = action.payload;
      const todo = state.extractedTodos.find(t => t.text === originalText);
      if (todo) {
        todo.text = newText;
        // Update selection if this todo was selected
        const selectionIndex = state.selectedTodos.indexOf(originalText);
        if (selectionIndex > -1) {
          state.selectedTodos[selectionIndex] = newText;
        }
      }
    },
    updateTodoContext: (state, action: PayloadAction<{ todoText: string; context: string }>) => {
      const { todoText, context } = action.payload;
      const todo = state.extractedTodos.find(t => t.text === todoText);
      if (todo) {
        todo.context = context;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialize ML Service
      .addCase(initializeMLService.pending, (state) => {
        state.isProcessing = true;
        state.error = null;
      })
      .addCase(initializeMLService.fulfilled, (state) => {
        state.isProcessing = false;
        state.isInitialized = true;
        state.error = null;
      })
      .addCase(initializeMLService.rejected, (state, action) => {
        state.isProcessing = false;
        state.isInitialized = false; // Don't mark as initialized if it failed
        state.error = action.payload as string || 'ML Service initialization failed';
      })
      // Process Image File
      .addCase(processImageFile.pending, (state) => {
        state.isProcessing = true;
        state.error = null;
        state.processingProgress = 0;
      })
      .addCase(processImageFile.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.lastResult = action.payload;
        state.extractedTodos = action.payload.todos;
        state.selectedTodos = action.payload.todos
          .filter(todo => todo.confidence > 0.6)
          .map(todo => todo.text);
        state.error = null;
        state.processingProgress = 100;
      })
      .addCase(processImageFile.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = action.payload as string;
        state.processingProgress = 0;
      })
      // Process Camera Capture
      .addCase(processCameraCapture.pending, (state) => {
        state.isProcessing = true;
        state.error = null;
        state.processingProgress = 0;
      })
      .addCase(processCameraCapture.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.lastResult = action.payload;
        state.extractedTodos = action.payload.todos;
        state.selectedTodos = action.payload.todos
          .filter(todo => todo.confidence > 0.6)
          .map(todo => todo.text);
        state.error = null;
        state.processingProgress = 100;
      })
      .addCase(processCameraCapture.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = action.payload as string;
        state.processingProgress = 0;
      });
  },
});

export const {
  clearError,
  clearResults,
  toggleTodoSelection,
  selectAllTodos,
  deselectAllTodos,
  setProcessingProgress,
  updateTodoText,
  updateTodoContext,
} = imageProcessingSlice.actions;

export default imageProcessingSlice.reducer;
