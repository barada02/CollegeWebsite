import { useState, useEffect, useCallback } from 'react';
import { facultyAPI } from '../services/facultyApi';
import type { IFaculty, FacultyCreateData, FacultyUpdateData, FacultyFilters, FacultyResponse } from '../services/facultyApi';

interface UseFacultyDataReturn {
  faculty: IFaculty[];
  loading: boolean;
  error: string | null;
  total: number;
  currentPage: number;
  totalPages: number;
  
  // Functions
  fetchFaculty: (filters?: FacultyFilters) => Promise<void>;
  createFaculty: (data: FacultyCreateData) => Promise<IFaculty>;
  updateFaculty: (id: string, data: FacultyUpdateData) => Promise<IFaculty>;
  deleteFaculty: (id: string) => Promise<void>;
  getFacultyById: (id: string) => Promise<IFaculty>;
  searchFaculty: (query: string) => Promise<void>;
  clearError: () => void;
  refreshData: () => Promise<void>;
}

export const useFacultyData = (initialFilters?: FacultyFilters): UseFacultyDataReturn => {
  const [faculty, setFaculty] = useState<IFaculty[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentFilters, setCurrentFilters] = useState<FacultyFilters>(initialFilters || {});

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Fetch faculty with filters
  const fetchFaculty = useCallback(async (filters: FacultyFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const combinedFilters = { ...currentFilters, ...filters };
      setCurrentFilters(combinedFilters);
      
      const response: FacultyResponse = await facultyAPI.getFaculty(combinedFilters);
      
      setFaculty(response.faculty);
      setTotal(response.total);
      setCurrentPage(response.page);
      setTotalPages(response.totalPages);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch faculty';
      setError(errorMessage);
      console.error('Error fetching faculty:', err);
      
      // Set empty array as fallback
      setFaculty([]);
      setTotal(0);
      setCurrentPage(1);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [currentFilters]);

  // Create new faculty
  const createFaculty = useCallback(async (data: FacultyCreateData): Promise<IFaculty> => {
    try {
      setLoading(true);
      setError(null);
      
      const newFaculty = await facultyAPI.createFaculty(data);
      
      // Refresh the faculty list after creation
      await fetchFaculty(currentFilters);
      
      return newFaculty;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create faculty';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchFaculty, currentFilters]);

  // Update faculty
  const updateFaculty = useCallback(async (id: string, data: FacultyUpdateData): Promise<IFaculty> => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedFaculty = await facultyAPI.updateFaculty(id, data);
      
      // Update the faculty in the current list
      setFaculty(prev => prev.map(f => f._id === id ? updatedFaculty : f));
      
      return updatedFaculty;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update faculty';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete faculty
  const deleteFaculty = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      await facultyAPI.deleteFaculty(id);
      
      // Remove the faculty from the current list
      setFaculty(prev => prev.filter(f => f._id !== id));
      setTotal(prev => prev - 1);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete faculty';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get faculty by ID
  const getFacultyById = useCallback(async (id: string): Promise<IFaculty> => {
    try {
      setError(null);
      return await facultyAPI.getFacultyById(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch faculty details';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Search faculty
  const searchFaculty = useCallback(async (query: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      if (!query.trim()) {
        // If search is empty, fetch all faculty
        await fetchFaculty(currentFilters);
        return;
      }
      
      const searchResults = await facultyAPI.searchFaculty(query);
      setFaculty(searchResults);
      setTotal(searchResults.length);
      setCurrentPage(1);
      setTotalPages(1);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search faculty';
      setError(errorMessage);
      console.error('Error searching faculty:', err);
      
      // Set empty array as fallback
      setFaculty([]);
      setTotal(0);
      setCurrentPage(1);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [fetchFaculty, currentFilters]);

  // Refresh data function
  const refreshData = useCallback(async (): Promise<void> => {
    await fetchFaculty(currentFilters);
  }, [fetchFaculty, currentFilters]);

  // Initial load
  useEffect(() => {
    // For admin interface, fetch all faculty (both active and inactive)
    const adminFilters = { 
      ...initialFilters,
      status: 'all' // Special value to get all faculty regardless of status
    };
    fetchFaculty(adminFilters);
  }, []); // Only run on mount

  return {
    faculty,
    loading,
    error,
    total,
    currentPage,
    totalPages,
    fetchFaculty,
    createFaculty,
    updateFaculty,
    deleteFaculty,
    getFacultyById,
    searchFaculty,
    clearError,
    refreshData,
  };
};

// Hook for getting schools and departments for form dropdowns
interface UseAcademicStructureReturn {
  schools: Array<{ _id: string; name: string; departments: Array<{ _id: string; name: string }> }>;
  departments: Array<{ _id: string; name: string; schoolId: string }>;
  loading: boolean;
  error: string | null;
  getSchoolById: (id: string) => { _id: string; name: string; departments: Array<{ _id: string; name: string }> } | undefined;
  getDepartmentById: (id: string) => { _id: string; name: string; schoolId: string } | undefined;
  getDepartmentsBySchool: (schoolId: string) => Array<{ _id: string; name: string }>;
}

export const useAcademicStructure = (): UseAcademicStructureReturn => {
  const [schools, setSchools] = useState<Array<{ _id: string; name: string; departments: Array<{ _id: string; name: string }> }>>([]);
  const [departments, setDepartments] = useState<Array<{ _id: string; name: string; schoolId: string }>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Get school by ID
  const getSchoolById = useCallback((id: string) => {
    return schools.find(school => school._id === id);
  }, [schools]);

  // Get department by ID
  const getDepartmentById = useCallback((id: string) => {
    return departments.find(dept => dept._id === id);
  }, [departments]);

  // Get departments by school
  const getDepartmentsBySchool = useCallback((schoolId: string) => {
    return departments.filter(dept => dept.schoolId === schoolId);
  }, [departments]);

  // Fetch academic structure data
  useEffect(() => {
    const fetchAcademicData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch schools and departments separately
        const [schoolsResponse, departmentsResponse] = await Promise.all([
          fetch('http://localhost:5000/api/schools?status=all'),
          fetch('http://localhost:5000/api/departments?status=all')
        ]);
        
        if (!schoolsResponse.ok || !departmentsResponse.ok) {
          throw new Error('Failed to fetch academic structure');
        }
        
        const [schoolsData, departmentsData] = await Promise.all([
          schoolsResponse.json(),
          departmentsResponse.json()
        ]);
        
        console.log('Schools API response:', schoolsData);
        console.log('Departments API response:', departmentsData);
        
        if (schoolsData.success && schoolsData.data && departmentsData.success && departmentsData.data) {
          // Set schools directly (no need to nest departments)
          setSchools(schoolsData.data.map((school: any) => ({
            ...school,
            departments: [] // We don't need to nest departments in schools
          })));
          
          // Set departments with proper schoolId reference
          const formattedDepartments = departmentsData.data.map((dept: any) => ({
            _id: dept._id,
            name: dept.name,
            schoolId: dept.schoolId
          }));
          
          console.log('Formatted departments:', formattedDepartments);
          setDepartments(formattedDepartments);
        } else {
          throw new Error('Invalid response format');
        }
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load academic structure';
        setError(errorMessage);
        console.error('Error fetching academic structure:', err);
        
        // Set empty arrays as fallback to prevent undefined errors
        setSchools([]);
        setDepartments([]);
        
        // For development, set some mock data if API is not available
        if (errorMessage.includes('Failed to fetch')) {
          const mockSchools = [
            {
              _id: 'school1',
              name: 'School of Engineering',
              departments: [
                { _id: 'dept1', name: 'Computer Science' },
                { _id: 'dept2', name: 'Electrical Engineering' }
              ]
            },
            {
              _id: 'school2',
              name: 'School of Business',
              departments: [
                { _id: 'dept3', name: 'Business Administration' },
                { _id: 'dept4', name: 'Marketing' }
              ]
            }
          ];
          
          const mockDepartments = [
            { _id: 'dept1', name: 'Computer Science', schoolId: 'school1' },
            { _id: 'dept2', name: 'Electrical Engineering', schoolId: 'school1' },
            { _id: 'dept3', name: 'Business Administration', schoolId: 'school2' },
            { _id: 'dept4', name: 'Marketing', schoolId: 'school2' }
          ];
          
          setSchools(mockSchools);
          setDepartments(mockDepartments);
          setError(null); // Clear error since we're providing mock data
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAcademicData();
  }, []);

  return {
    schools,
    departments,
    loading,
    error,
    getSchoolById,
    getDepartmentById,
    getDepartmentsBySchool,
  };
};

export default useFacultyData;
