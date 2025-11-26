export interface Employee {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfJoining: string; // ISO Date string YYYY-MM-DD
  shiftTime: string; // HH:mm
  isActive: boolean;
  skills: string[];
  department: string;
  address?: string;
}

export interface EmployeeServiceState {
  employees: Employee[];
}

export const DEPARTMENTS = ['Engineering', 'Human Resources', 'Finance', 'Marketing', 'Sales', 'Operations'];
export const AVAILABLE_SKILLS = ['JavaScript', 'TypeScript', 'React', 'Angular', 'Python', 'Java', 'C#', 'SQL', 'DevOps', 'UI/UX'];
