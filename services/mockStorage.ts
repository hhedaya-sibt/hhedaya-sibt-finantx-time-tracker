import { Employee, Supervisor, WeeklyTimeSheet, AppState } from '../types';
import { INITIAL_EMPLOYEES, INITIAL_SUPERVISORS, DEFAULT_SCRIPT_URL } from '../constants';

const STORAGE_KEY = 'finantx_app_v1';

const getInitialState = (): AppState => ({
  employees: INITIAL_EMPLOYEES,
  supervisors: INITIAL_SUPERVISORS,
  timeSheets: [],
  currentUser: null,
  googleScriptUrl: DEFAULT_SCRIPT_URL,
});

export const loadState = (): AppState => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsedState = JSON.parse(stored);
      
      // CRITICAL FIX: Merge the hardcoded supervisors into the stored state.
      // This ensures that the new list of authorized users (Harry, Sheri, etc.) 
      // overrides any old data saved in the browser, allowing you to log in immediately.
      return {
        ...parsedState,
        supervisors: INITIAL_SUPERVISORS, // Always use the code as source of truth for access
        googleScriptUrl: parsedState.googleScriptUrl || DEFAULT_SCRIPT_URL // Ensure URL exists
      };
    } catch (error) {
      console.error('Failed to load state from local storage:', error);
      return getInitialState();
    }
  }
  return getInitialState();
};

export const saveState = (state: AppState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const clearData = () => {
  localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
}