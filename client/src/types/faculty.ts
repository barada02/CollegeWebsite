// Faculty related types
export interface IFaculty {
  _id?: string;
  departmentId: string;
  schoolId: string;
  
  // Personal Info
  name: string;
  designation: string;
  qualification: string[];
  experience: number;
  
  // Contact
  email: string;
  phone?: string;
  office?: string;
  
  // Academic Details
  specialization: string[];
  researchInterests: string[];
  publications: IPublication[];
  
  // Additional Info
  awards: string[];
  biography: string;
  image?: string;
  cv?: string;
  
  status: 'active' | 'inactive';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPublication {
  title: string;
  journal: string;
  year: number;
  url?: string;
}

export type FacultyCreateData = Omit<IFaculty, '_id' | 'createdAt' | 'updatedAt'>;
export type FacultyUpdateData = Partial<FacultyCreateData>;

export interface FacultyResponse {
  faculty: IFaculty[];
  total: number;
  page: number;
  totalPages: number;
}

export interface FacultyFilters {
  department?: string;
  school?: string;
  designation?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// Academic Structure types
export interface ISchool {
  _id: string;
  name: string;
  code: string;
  description: string;
  dean: string;
  departments: IDepartment[];
}

export interface IDepartment {
  _id: string;
  name: string;
  code: string;
  description: string;
  head: string;
  schoolId: string;
}

export interface ICourse {
  _id: string;
  name: string;
  code: string;
  description: string;
  credits: number;
  departmentId: string;
}

// Form and UI related types
export interface FormErrors {
  [key: string]: string;
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// Filter and search types
export interface SearchFilters {
  query?: string;
  department?: string;
  school?: string;
  status?: string;
  designation?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LoadingProps {
  loading: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export interface ErrorProps {
  error: string | null;
  onRetry?: () => void;
  onClose?: () => void;
}

// Modal and form types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface FormProps<T> {
  data?: T;
  onSubmit: (data: T) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  errors?: FormErrors;
}

// Designation constants
export const FACULTY_DESIGNATIONS = [
  'Professor',
  'Associate Professor',
  'Assistant Professor',
  'Lecturer',
  'Senior Lecturer',
  'Visiting Faculty',
  'Adjunct Professor',
  'Professor Emeritus'
] as const;

export type FacultyDesignationType = typeof FACULTY_DESIGNATIONS[number];

// Status constants
export const FACULTY_STATUSES = ['active', 'inactive'] as const;
export type FacultyStatusType = typeof FACULTY_STATUSES[number];
