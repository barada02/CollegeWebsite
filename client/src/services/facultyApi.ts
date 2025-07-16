// Configure base URL - update this to match your backend URL
const API_BASE_URL = 'http://localhost:5000/api';

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

export interface FacultyCreateData {
  departmentId: string;
  schoolId: string;
  name: string;
  designation: string;
  qualification: string[];
  experience: number;
  email: string;
  phone?: string;
  office?: string;
  specialization: string[];
  researchInterests: string[];
  publications: IPublication[];
  awards: string[];
  biography: string;
  image?: string;
  cv?: string;
  status: 'active' | 'inactive';
}

export interface FacultyUpdateData extends Partial<FacultyCreateData> {}

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

class FacultyAPI {
  private baseURL: string;

  constructor() {
    this.baseURL = `${API_BASE_URL}/faculty`;
  }

  // Get all faculty with optional filters
  async getFaculty(filters: FacultyFilters = {}): Promise<FacultyResponse> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const url = queryParams.toString() 
      ? `${this.baseURL}?${queryParams.toString()}`
      : this.baseURL;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch faculty: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Handle the backend response format
    if (data.success && data.data) {
      return {
        faculty: data.data.faculty || [],
        total: data.data.pagination?.totalItems || 0,
        page: data.data.pagination?.currentPage || 1,
        totalPages: data.data.pagination?.totalPages || 1
      };
    } else {
      // Fallback format
      return {
        faculty: [],
        total: 0,
        page: 1,
        totalPages: 1
      };
    }
  }

  // Get single faculty by ID
  async getFacultyById(id: string): Promise<IFaculty> {
    const response = await fetch(`${this.baseURL}/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch faculty: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.success && data.data) {
      return data.data;
    } else {
      throw new Error('Faculty not found');
    }
  }

  // Create new faculty
  async createFaculty(facultyData: FacultyCreateData): Promise<IFaculty> {
    const response = await fetch(this.baseURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(facultyData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Failed to create faculty: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.success && data.data) {
      return data.data;
    } else {
      throw new Error(data.message || 'Failed to create faculty');
    }
  }

  // Update faculty
  async updateFaculty(id: string, facultyData: FacultyUpdateData): Promise<IFaculty> {
    const response = await fetch(`${this.baseURL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(facultyData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Failed to update faculty: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.success && data.data) {
      return data.data;
    } else {
      throw new Error(data.message || 'Failed to update faculty');
    }
  }

  // Delete faculty
  async deleteFaculty(id: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Failed to delete faculty: ${response.statusText}`);
    }
  }

  // Get faculty by department
  async getFacultyByDepartment(departmentId: string): Promise<IFaculty[]> {
    const response = await fetch(`${this.baseURL}/department/${departmentId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch faculty by department: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.success && data.data) {
      return data.data.faculty || [];
    } else {
      return [];
    }
  }

  // Get faculty by school
  async getFacultyBySchool(schoolId: string): Promise<IFaculty[]> {
    const response = await fetch(`${this.baseURL}/school/${schoolId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch faculty by school: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.success && data.data) {
      return data.data.faculty || [];
    } else {
      return [];
    }
  }

  // Search faculty
  async searchFaculty(query: string): Promise<IFaculty[]> {
    const response = await fetch(`${this.baseURL}/search?q=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error(`Failed to search faculty: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.success && data.data) {
      return data.data.faculty || [];
    } else {
      return [];
    }
  }
}

// Create and export the API instance
export const facultyAPI = new FacultyAPI();
export default facultyAPI;
