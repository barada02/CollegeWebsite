import axios from 'axios';

// Configure base URL - update this to match your backend URL
const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types for API responses
export interface School {
  _id: string;
  name: string;
  code: string;
  description: string;
  dean: string;
  contact: {
    email: string;
    phone: string;
    office: string;
  };
  establishedYear: number;
  accreditation: string[];
  image?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  _id: string;
  schoolId: string;
  name: string;
  code: string;
  description: string;
  head: string;
  contact: {
    email: string;
    phone: string;
    office: string;
  };
  facilities: string[];
  achievements: string[];
  image?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  _id: string;
  departmentId: string;
  schoolId: string;
  name: string;
  shortName: string;
  code: string;
  level: 'UG' | 'PG' | 'Diploma' | 'PhD';
  degree: string;
  specialization?: string;
  duration: {
    years: number;
    semesters: number;
  };
  totalCredits: number;
  eligibility: {
    academicRequirement: string;
    entranceExam?: string[];
    minimumPercentage: number;
    ageLimit?: {
      min: number;
      max: number;
    };
  };
  feeStructure: {
    admissionFee: number;
    semesterFee: number;
    totalFee: number;
    scholarships?: string[];
  };
  careerProspects: string[];
  placementStats: Array<{
    year: number;
    percentage: number;
    averagePackage: number;
    highestPackage: number;
    majorRecruiters: string[];
  }>;
  accreditation: string[];
  description: string;
  objectives: string[];
  outcomes: string[];
  intake: number;
  status: 'active' | 'inactive' | 'upcoming';
  admissionOpen: boolean;
}

export interface Faculty {
  _id: string;
  departmentId: string;
  schoolId: string;
  name: string;
  designation: string;
  qualification: string[];
  experience: number;
  email: string;
  phone: string;
  office: string;
  specialization: string[];
  researchInterests: string[];
  publications?: Array<{
    title: string;
    journal: string;
    year: number;
    url?: string;
  }>;
  awards?: string[];
  biography: string;
  image?: string;
  status: 'active' | 'inactive';
}

// Schools API
export const schoolsApi = {
  getAll: () => api.get<School[]>('/schools'),
  getById: (id: string) => api.get<School>(`/schools/${id}`),
  getWithDepartments: (id: string) => api.get<School & { departments: Department[] }>(`/schools/${id}/departments`),
};

// Departments API
export const departmentsApi = {
  getAll: () => api.get<Department[]>('/departments'),
  getById: (id: string) => api.get<Department>(`/departments/${id}`),
  getBySchool: (schoolId: string) => api.get<Department[]>(`/departments/school/${schoolId}`),
  getWithCourses: (id: string) => api.get<Department & { courses: Course[] }>(`/departments/${id}/courses`),
  getWithFaculty: (id: string) => api.get<Department & { faculty: Faculty[] }>(`/departments/${id}/faculty`),
};

// Courses API
export const coursesApi = {
  getAll: () => api.get<Course[]>('/courses'),
  getById: (id: string) => api.get<Course>(`/courses/${id}`),
  getByDepartment: (departmentId: string) => api.get<Course[]>(`/courses/department/${departmentId}`),
  getBySchool: (schoolId: string) => api.get<Course[]>(`/courses/school/${schoolId}`),
  getByLevel: (level: 'UG' | 'PG' | 'Diploma' | 'PhD') => api.get<Course[]>(`/courses?level=${level}`),
  search: (query: string) => api.get<Course[]>(`/courses/search?query=${encodeURIComponent(query)}`),
};

// Faculty API
export const facultyApi = {
  getAll: () => api.get<Faculty[]>('/faculty'),
  getById: (id: string) => api.get<Faculty>(`/faculty/${id}`),
  getByDepartment: (departmentId: string) => api.get<Faculty[]>(`/faculty/department/${departmentId}`),
  getBySchool: (schoolId: string) => api.get<Faculty[]>(`/faculty/school/${schoolId}`),
  search: (query: string) => api.get<Faculty[]>(`/faculty/search?query=${encodeURIComponent(query)}`),
};

// General API utilities
export const apiUtils = {
  handleError: (error: any) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data);
      return error.response.data.message || 'An error occurred';
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error:', error.request);
      return 'Network error. Please check your connection.';
    } else {
      // Something else happened
      console.error('Error:', error.message);
      return error.message;
    }
  },
};

export default api;
