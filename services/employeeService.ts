import { Employee, DEPARTMENTS, AVAILABLE_SKILLS } from '../types';

const STORAGE_KEY = 'employee_app_data_v1';

const DUMMY_DATA: Employee[] = [
  {
    id: '1',
    fullName: 'Alice Johnson',
    email: 'alice.j@example.com',
    phone: '5551234567',
    dateOfJoining: '2023-01-15',
    shiftTime: '09:00',
    isActive: true,
    skills: ['React', 'TypeScript', 'UI/UX'],
    department: 'Engineering',
    address: '123 Tech Lane, Silicon Valley'
  },
  {
    id: '2',
    fullName: 'Bob Smith',
    email: 'bob.smith@example.com',
    phone: '5559876543',
    dateOfJoining: '2022-11-01',
    shiftTime: '08:30',
    isActive: true,
    skills: ['Accounting', 'SQL'],
    department: 'Finance',
    address: '456 Money Blvd, Wall St'
  },
  {
    id: '3',
    fullName: 'Charlie Davis',
    email: 'charlie.d@example.com',
    phone: '5555555555',
    dateOfJoining: '2023-03-10',
    shiftTime: '10:00',
    isActive: false,
    skills: ['Communication', 'Management'],
    department: 'Human Resources',
    address: '789 People Way, Community City'
  }
];

export const getEmployees = (): Employee[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    // Initialize with dummy data if empty
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DUMMY_DATA));
    return DUMMY_DATA;
  }
  return JSON.parse(stored);
};

export const getEmployeeById = (id: string): Employee | undefined => {
  const employees = getEmployees();
  return employees.find(e => e.id === id);
};

export const saveEmployee = (employee: Employee): void => {
  const employees = getEmployees();
  const existingIndex = employees.findIndex(e => e.id === employee.id);

  if (existingIndex >= 0) {
    employees[existingIndex] = employee;
  } else {
    employees.push(employee);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
};

export const deleteEmployee = (id: string): void => {
  const employees = getEmployees();
  const filtered = employees.filter(e => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};
