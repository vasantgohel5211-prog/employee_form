import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Check, AlertCircle } from 'lucide-react';
import { Employee, DEPARTMENTS, AVAILABLE_SKILLS } from '../types';
import { getEmployeeById, saveEmployee } from '../services/employeeService';

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  dateOfJoining?: string;
  shiftTime?: string;
  department?: string;
  skills?: string;
}

// Safe ID generator fallback
const generateId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9);
};

const EmployeeForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<Employee>({
    id: generateId(),
    fullName: '',
    email: '',
    phone: '',
    dateOfJoining: '',
    shiftTime: '',
    isActive: true,
    skills: [],
    department: '',
    address: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode && id) {
      const employee = getEmployeeById(id);
      if (employee) {
        setFormData(employee);
      } else {
        navigate('/not-found');
      }
    } else {
      // Reset form when switching to "New" mode or initial load
      setFormData({
        id: generateId(),
        fullName: '',
        email: '',
        phone: '',
        dateOfJoining: '',
        shiftTime: '',
        isActive: true,
        skills: [],
        department: '',
        address: ''
      });
      setTouched({});
      setErrors({});
    }
  }, [id, isEditMode, navigate]);

  const validate = (data: Employee): FormErrors => {
    const newErrors: FormErrors = {};
    
    if (!data.fullName.trim() || data.fullName.length < 3) {
      newErrors.fullName = 'Full name must be at least 3 characters.';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email.trim() || !emailRegex.test(data.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    
    const phoneRegex = /^\d{10,15}$/;
    if (!data.phone.trim() || !phoneRegex.test(data.phone.replace(/[^0-9]/g, ''))) {
      newErrors.phone = 'Phone must be 10-15 digits.';
    }
    
    if (!data.dateOfJoining) {
      newErrors.dateOfJoining = 'Date of joining is required.';
    }

    if (!data.shiftTime) {
      newErrors.shiftTime = 'Shift time is required.';
    }

    if (!data.department) {
      newErrors.department = 'Please select a department.';
    }

    if (data.skills.length === 0) {
      newErrors.skills = 'Select at least one skill.';
    }

    return newErrors;
  };

  useEffect(() => {
    // Real-time validation for touched fields
    const validationErrors = validate(formData);
    setErrors(validationErrors);
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSkillChange = (skill: string) => {
    setFormData(prev => {
      const currentSkills = prev.skills;
      if (currentSkills.includes(skill)) {
        return { ...prev, skills: currentSkills.filter(s => s !== skill) };
      } else {
        return { ...prev, skills: [...currentSkills, skill] };
      }
    });
    setTouched(prev => ({ ...prev, skills: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      fullName: true, email: true, phone: true, dateOfJoining: true, shiftTime: true, department: true, skills: true
    });

    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    // Simulate API delay
    setTimeout(() => {
      saveEmployee(formData);
      setIsSubmitting(false);
      navigate('/employees');
    }, 500);
  };

  const isValid = Object.keys(errors).length === 0;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {isEditMode ? 'Edit Employee' : 'New Employee'}
          </h1>
          <p className="text-slate-500 mt-1">
            {isEditMode ? 'Update the employee details below.' : 'Fill in the information to onboard a new employee.'}
          </p>
        </div>
        <Link to="/employees" className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to List
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                onBlur={() => handleBlur('fullName')}
                className={`block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border ${touched.fullName && errors.fullName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                placeholder="John Doe"
              />
              {touched.fullName && errors.fullName && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => handleBlur('email')}
                className={`block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border ${touched.email && errors.email ? 'border-red-500' : ''}`}
                placeholder="john@example.com"
              />
              {touched.email && errors.email && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.email}</p>
              )}
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="md:col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={() => handleBlur('phone')}
                className={`block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border ${touched.phone && errors.phone ? 'border-red-500' : ''}`}
                placeholder="1234567890"
              />
              {touched.phone && errors.phone && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.phone}</p>
              )}
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Date of Joining *</label>
              <input
                type="date"
                name="dateOfJoining"
                value={formData.dateOfJoining}
                onChange={handleChange}
                onBlur={() => handleBlur('dateOfJoining')}
                className={`block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border ${touched.dateOfJoining && errors.dateOfJoining ? 'border-red-500' : ''}`}
              />
               {touched.dateOfJoining && errors.dateOfJoining && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.dateOfJoining}</p>
              )}
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Shift Time *</label>
              <input
                type="time"
                name="shiftTime"
                value={formData.shiftTime}
                onChange={handleChange}
                onBlur={() => handleBlur('shiftTime')}
                className={`block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border ${touched.shiftTime && errors.shiftTime ? 'border-red-500' : ''}`}
              />
               {touched.shiftTime && errors.shiftTime && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.shiftTime}</p>
              )}
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Department *</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                onBlur={() => handleBlur('department')}
                className={`block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border ${touched.department && errors.department ? 'border-red-500' : ''}`}
              >
                <option value="">Select Department</option>
                {DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
               {touched.department && errors.department && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.department}</p>
              )}
            </div>

            <div className="flex items-center h-full pt-6">
              <div className="flex items-center h-5">
                <input
                  id="isActive"
                  name="isActive"
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-slate-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="isActive" className="font-medium text-slate-700">Active Employee</label>
                <p className="text-slate-500">Currently working in the organization.</p>
              </div>
            </div>
          </div>

          {/* Skills (Multi-select) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Skills *</label>
            <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 p-4 border rounded-md ${touched.skills && errors.skills ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`}>
              {AVAILABLE_SKILLS.map(skill => (
                <label key={skill} className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-slate-100 rounded transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.skills.includes(skill)}
                    onChange={() => handleSkillChange(skill)}
                    className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                  />
                  <span className="text-sm text-slate-700">{skill}</span>
                </label>
              ))}
            </div>
             {touched.skills && errors.skills && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.skills}</p>
              )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
            <textarea
              name="address"
              rows={3}
              value={formData.address}
              onChange={handleChange}
              className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              placeholder="Full residential address..."
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
             <Link
              to="/employees"
              className="inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                !isValid || isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isSubmitting ? (
                 <>Saving...</>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Employee
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;