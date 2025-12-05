import { Department, Employee, Supervisor } from './types';

export const DEPARTMENTS = [
  Department.SALES,
  Department.OPERATIONS,
  Department.AFFILIATE,
  Department.SIBT_PWR_ADMIN,
  Department.CORRESPONDENCE,
];

export const INITIAL_SUPERVISORS: Supervisor[] = [
  {
    id: 'sup-1',
    firstName: 'Harry',
    lastName: 'Hedaya',
    email: 'hhedaya@senditbytext.com',
    departments: DEPARTMENTS, 
    isAdmin: true,
  },
  {
    id: 'sup-2',
    firstName: 'Sabrena',
    lastName: 'Eye',
    email: 'seye@cardshield.me',
    departments: [Department.CORRESPONDENCE],
    isAdmin: true,
  },
  {
    id: 'sup-3',
    firstName: 'Joel',
    lastName: 'Vorbeck',
    email: 'jvorbeck@cardshield.me',
    departments: [Department.SALES, Department.OPERATIONS, Department.SIBT_PWR_ADMIN, Department.AFFILIATE],
    isAdmin: true,
  },
  {
    id: 'sup-4',
    firstName: 'Abe',
    lastName: 'Tozier',
    email: 'atozier@cardshield.me',
    departments: [Department.OPERATIONS, Department.AFFILIATE],
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
export const DEFAULT_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzb1pv0hs87aDPtbRmITg67OVb4A7li7nS79rMTw3LCZphL-Un9V5rpv_6_tfOS6bNI/exec";