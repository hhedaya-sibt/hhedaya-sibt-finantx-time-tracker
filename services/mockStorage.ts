import { Employee, Supervisor, WeeklyTimeSheet, AppState } from '../types';
import { INITIAL_EMPLOYEES, INITIAL_SUPERVISORS } from '../constants';

const STORAGE_KEY = 'finantx_app_v1';

const getInitialState = (): AppState => ({
  employees: INITIAL_EMPLOYEES,
  supervisors: INITIAL_SUPERVISORS,
  timeSheets: [],
  currentUser: null,
});

export const loadState = (): AppState => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
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
