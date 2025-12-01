export enum Department {
  SALES = 'Sales',
  OPERATIONS = 'Operations',
  AFFILIATE = 'Affiliate Contractors',
  SIBT_PWR_ADMIN = 'SIBT-PWR Admin'
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  rate: number;
  department: Department;
}

export interface Supervisor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  departments: Department[];
  isAdmin: boolean; // For Super Admin privileges
}

export interface DailyEntry {
  date: string; // ISO Date String YYYY-MM-DD
  hours: number;
}

export interface WeeklyTimeSheet {
  employeeId: string;
  weekStartDate: string; // The Monday of the week
  entries: { [date: string]: number }; // Map date -> hours
  submitted: boolean;
}

export interface AppState {
  employees: Employee[];
  supervisors: Supervisor[];
  timeSheets: WeeklyTimeSheet[];
  currentUser: Supervisor | null;
  googleScriptUrl: string;
}