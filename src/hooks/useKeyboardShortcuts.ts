import { useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { setVisibilityFilter, VisibilityFilter } from '../store/slices/filterSlice';

export const useKeyboardShortcuts = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle shortcuts when not typing in an input
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Ctrl/Cmd + key combinations
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case '1':
            event.preventDefault();
            dispatch(setVisibilityFilter(VisibilityFilter.SHOW_ALL));
            break;
          case '2':
            event.preventDefault();
            dispatch(setVisibilityFilter(VisibilityFilter.SHOW_ACTIVE));
            break;
          case '3':
            event.preventDefault();
            dispatch(setVisibilityFilter(VisibilityFilter.SHOW_COMPLETED));
            break;
          case '/':
            event.preventDefault();
            // Focus on the input field
            const input = document.querySelector('input[type="text"]') as HTMLInputElement;
            if (input) {
              input.focus();
            }
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);
};
