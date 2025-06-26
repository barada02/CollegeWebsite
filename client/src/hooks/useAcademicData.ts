import { useState, useEffect } from 'react';
import { schoolsApi, departmentsApi, coursesApi, facultyApi, apiUtils } from '../services/academicApi';
import type { Course, Faculty } from '../services/academicApi';

// Generic hook for async data fetching
function useAsyncData<T>(
  fetchFunction: () => Promise<{ data: T }>,
  deps: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchFunction();
        // Extract the actual data from the API response structure { success: true, data: [...] }
        setData((response.data as any).data);
      } catch (err) {
        setError(apiUtils.handleError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, deps);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchFunction();
      setData((response.data as any).data);
    } catch (err) {
      setError(apiUtils.handleError(err));
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
}

// Schools hooks
export const useSchools = () => {
  return useAsyncData(() => schoolsApi.getAll());
};

export const useSchool = (id: string) => {
  return useAsyncData(() => schoolsApi.getById(id), [id]);
};

export const useSchoolWithDepartments = (id: string) => {
  return useAsyncData(() => schoolsApi.getWithDepartments(id), [id]);
};

// Departments hooks
export const useDepartments = () => {
  return useAsyncData(() => departmentsApi.getAll());
};

export const useDepartment = (id: string) => {
  return useAsyncData(() => departmentsApi.getById(id), [id]);
};

export const useDepartmentsBySchool = (schoolId: string) => {
  return useAsyncData(() => departmentsApi.getBySchool(schoolId), [schoolId]);
};

export const useDepartmentWithCourses = (id: string) => {
  return useAsyncData(() => departmentsApi.getWithCourses(id), [id]);
};

export const useDepartmentWithFaculty = (id: string) => {
  return useAsyncData(() => departmentsApi.getWithFaculty(id), [id]);
};

// Courses hooks
export const useCourses = () => {
  return useAsyncData(() => coursesApi.getAll());
};

export const useCourse = (id: string) => {
  return useAsyncData(() => coursesApi.getById(id), [id]);
};

export const useCoursesByDepartment = (departmentId: string) => {
  return useAsyncData(() => coursesApi.getByDepartment(departmentId), [departmentId]);
};

export const useCoursesBySchool = (schoolId: string) => {
  return useAsyncData(() => coursesApi.getBySchool(schoolId), [schoolId]);
};

export const useCoursesByLevel = (level: 'UG' | 'PG' | 'Diploma' | 'PhD') => {
  return useAsyncData(() => coursesApi.getByLevel(level), [level]);
};

// Faculty hooks
export const useFaculty = () => {
  return useAsyncData(() => facultyApi.getAll());
};

export const useFacultyMember = (id: string) => {
  return useAsyncData(() => facultyApi.getById(id), [id]);
};

export const useFacultyByDepartment = (departmentId: string) => {
  return useAsyncData(() => facultyApi.getByDepartment(departmentId), [departmentId]);
};

export const useFacultyBySchool = (schoolId: string) => {
  return useAsyncData(() => facultyApi.getBySchool(schoolId), [schoolId]);
};

// Search hooks
export const useSearchCourses = (query: string) => {
  const [data, setData] = useState<Course[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setData(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await coursesApi.search(searchQuery);
      setData(response.data);
    } catch (err) {
      setError(apiUtils.handleError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      search(query);
    } else {
      setData(null);
    }
  }, [query]);

  return { data, loading, error, search };
};

export const useSearchFaculty = (query: string) => {
  const [data, setData] = useState<Faculty[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setData(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await facultyApi.search(searchQuery);
      setData(response.data);
    } catch (err) {
      setError(apiUtils.handleError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      search(query);
    } else {
      setData(null);
    }
  }, [query]);

  return { data, loading, error, search };
};
