import React from 'react';
import { useSchools } from '../../hooks/useAcademicData';

const Academics: React.FC = () => {
  console.log('🎓 Academics component loaded successfully!');
  
  // Test Schools API first
  const { data: schools, loading: schoolsLoading, error: schoolsError } = useSchools();
  
  console.log('📊 Schools API Status:');
  console.log('  - Loading:', schoolsLoading);
  console.log('  - Error:', schoolsError);
  console.log('  - Data:', schools);
  console.log('  - Data type:', typeof schools);
  console.log('  - Data is array:', Array.isArray(schools));
  console.log('  - Data length:', schools?.length);
  console.log('  - Raw data structure:', JSON.stringify(schools, null, 2));
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>Hello Academics!</h1>
      <p>This is the Academics page - now testing Schools API!</p>
      <p>Current time: {new Date().toLocaleTimeString()}</p>
      
      <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h3>Schools API Test:</h3>
        <p><strong>Loading:</strong> {schoolsLoading ? 'Yes' : 'No'}</p>
        <p><strong>Error:</strong> {schoolsError || 'None'}</p>
        <p><strong>Schools count:</strong> {schools?.length || 0}</p>
        
        {schools && schools.length > 0 && (
          <div style={{ marginTop: '10px' }}>
            <h4>First School:</h4>
            <p>Name: {schools[0].name}</p>
            <p>Code: {schools[0].code}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Academics;
