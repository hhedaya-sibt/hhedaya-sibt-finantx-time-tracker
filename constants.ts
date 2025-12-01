import { Department, Employee, Supervisor } from './types';

export const DEPARTMENTS = [
  Department.SALES,
  Department.OPERATIONS,
  Department.AFFILIATE,
  Department.SIBT_PWR_ADMIN,
];

export const INITIAL_SUPERVISORS: Supervisor[] = [
  {
    id: 'sup-1',
    firstName: 'Super',
    lastName: 'Admin',
    email: 'admin@finantx.com',
    departments: DEPARTMENTS, // Access to all
    isAdmin: true,
  },
  {
    id: 'sup-2',
    firstName: 'Joel',
    lastName: 'Vorbeck',
    email: 'joel@finantx.com',
    departments: [Department.AFFILIATE, Department.OPERATIONS],
    isAdmin: false,
  },
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    firstName: 'Daniel',
    lastName: 'Robles',
    email: 'daniel@example.com',
    rate: 25.00,
    department: Department.AFFILIATE,
  },
  {
    id: 'emp-2',
    firstName: 'Sarah',
    lastName: 'Smith',
    email: 'sarah@example.com',
    rate: 30.00,
    department: Department.SALES,
  },
];

export const GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/1o1k_JAUwhKO85oGX3BJux9NO5X6NeKbfIYOw6pogYjA/edit?usp=sharing";
export const SUBMISSION_EMAIL = "employeehours@plansvcs.com";
