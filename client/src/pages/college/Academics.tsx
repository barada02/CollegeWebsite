import React, { useState } from 'react';
import { useSchools, useCourses } from '../../hooks/useAcademicData';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorMessage from '../../components/shared/ErrorMessage';

const Academics: React.FC = () => {
  const { data: schools, loading: schoolsLoading, error: schoolsError, refetch: refetchSchools } = useSchools();
  const { data: courses, loading: coursesLoading, error: coursesError, refetch: refetchCourses } = useCourses();
  
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'UG' | 'PG' | 'Diploma' | 'PhD'>('all');
  const [selectedSchool, setSelectedSchool] = useState<string>('all');

  // Filter courses based on selected filters
  const filteredCourses = courses?.filter(course => {
    const levelMatch = selectedLevel === 'all' || course.level === selectedLevel;
    const schoolMatch = selectedSchool === 'all' || course.schoolId === selectedSchool;
    return levelMatch && schoolMatch && course.status === 'active';
  });

  // Get course statistics
  const getStatistics = () => {
    if (!courses) return null;
    
    const stats = {
      total: courses.length,
      UG: courses.filter(c => c.level === 'UG').length,
      PG: courses.filter(c => c.level === 'PG').length,
      admissionOpen: courses.filter(c => c.admissionOpen).length,
    };
    
    return stats;
  };

  const stats = getStatistics();

  if (schoolsLoading || coursesLoading) {
    return <LoadingSpinner size="large" message="Loading academic information..." />;
  }

  if (schoolsError) {
    return <ErrorMessage message={schoolsError} onRetry={refetchSchools} />;
  }

  if (coursesError) {
    return <ErrorMessage message={coursesError} onRetry={refetchCourses} />;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#2c3e50', marginBottom: '10px' }}>Academic Programs</h1>
        <p style={{ fontSize: '1.2rem', color: '#7f8c8d', marginBottom: '30px' }}>
          Discover our comprehensive range of academic programs across {schools?.length} specialized schools
        </p>
        
        {/* Statistics */}
        {stats && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3498db' }}>{stats.total}</div>
              <div style={{ color: '#7f8c8d' }}>Total Programs</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#27ae60' }}>{stats.UG}</div>
              <div style={{ color: '#7f8c8d' }}>Undergraduate</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#e74c3c' }}>{stats.PG}</div>
              <div style={{ color: '#7f8c8d' }}>Postgraduate</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f39c12' }}>{stats.admissionOpen}</div>
              <div style={{ color: '#7f8c8d' }}>Open for Admission</div>
            </div>
          </div>
        )}      </div>

      {/* Schools Section */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2rem', color: '#2c3e50', marginBottom: '20px', textAlign: 'center' }}>Our Schools</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
          {schools?.map((school) => (
            <div 
              key={school._id} 
              style={{ 
                border: '1px solid #ddd', 
                borderRadius: '8px', 
                padding: '20px', 
                backgroundColor: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onClick={() => {
                setSelectedSchool(school._id);
                document.getElementById('courses-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <h3 style={{ color: '#3498db', marginBottom: '10px' }}>{school.name}</h3>
              <p style={{ color: '#7f8c8d', marginBottom: '15px', fontSize: '0.9rem' }}>{school.code}</p>
              <p style={{ color: '#2c3e50', lineHeight: '1.5' }}>{school.description}</p>
              <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                <p style={{ margin: '0', fontSize: '0.9rem', color: '#555' }}>
                  <strong>Dean:</strong> {school.dean}
                </p>
                <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem', color: '#555' }}>
                  <strong>Established:</strong> {school.establishedYear}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Courses Section */}
      <div id="courses-section">
        <h2 style={{ fontSize: '2rem', color: '#2c3e50', marginBottom: '20px', textAlign: 'center' }}>Academic Programs</h2>
        
        {/* Filters */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Program Level:</label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as any)}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd', minWidth: '150px' }}
            >
              <option value="all">All Levels</option>
              <option value="UG">Undergraduate (UG)</option>
              <option value="PG">Postgraduate (PG)</option>
              <option value="Diploma">Diploma</option>
              <option value="PhD">PhD</option>
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>School:</label>
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd', minWidth: '200px' }}
            >
              <option value="all">All Schools</option>
              {schools?.map((school) => (
                <option key={school._id} value={school._id}>
                  {school.name}
                </option>
              ))}
            </select>
          </div>
          
          {(selectedLevel !== 'all' || selectedSchool !== 'all') && (
            <div style={{ display: 'flex', alignItems: 'end' }}>
              <button
                onClick={() => {
                  setSelectedLevel('all');
                  setSelectedSchool('all');
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Results Info */}
        <p style={{ textAlign: 'center', color: '#7f8c8d', marginBottom: '20px' }}>
          Showing {filteredCourses?.length || 0} of {courses?.length || 0} programs
          {selectedLevel !== 'all' && ` (${selectedLevel} level)`}
          {selectedSchool !== 'all' && ` from ${schools?.find(s => s._id === selectedSchool)?.name}`}
        </p>

        {/* Courses Grid */}
        {filteredCourses && filteredCourses.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
            {filteredCourses.map((course) => (
              <div 
                key={course._id}
                style={{ 
                  border: '1px solid #ddd', 
                  borderRadius: '8px', 
                  padding: '20px', 
                  backgroundColor: '#fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                  <h3 style={{ color: '#2c3e50', margin: '0', flex: '1' }}>{course.name}</h3>
                  <span 
                    style={{ 
                      backgroundColor: course.level === 'UG' ? '#27ae60' : '#e74c3c',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {course.level}
                  </span>
                </div>
                
                <p style={{ color: '#7f8c8d', marginBottom: '15px', fontSize: '0.9rem' }}>
                  {course.code} • {course.duration.years} years
                </p>
                
                <p style={{ color: '#2c3e50', lineHeight: '1.5', marginBottom: '15px' }}>
                  {course.description}
                </p>
                
                <div style={{ display: 'flex', gap: '15px', fontSize: '0.9rem', color: '#555' }}>
                  <div>
                    <strong>Intake:</strong> {course.intake}
                  </div>
                  <div>
                    <strong>Credits:</strong> {course.totalCredits}
                  </div>
                  {course.admissionOpen && (
                    <div style={{ color: '#27ae60', fontWeight: 'bold' }}>
                      ✓ Admission Open
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#7f8c8d' }}>
            <h3>No programs found</h3>
            <p>Try adjusting your filters to see more results.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Academics;
