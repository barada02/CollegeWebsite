// Simple script to test API endpoints
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testApiEndpoints() {
  console.log('Testing API endpoints...\n');
  
  const endpoints = [
    { name: 'Contacts', url: `${API_BASE_URL}/contact` },
    { name: 'Events', url: `${API_BASE_URL}/events` },
    { name: 'Faculty', url: `${API_BASE_URL}/faculty` }
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`Testing ${endpoint.name}...`);
      const response = await axios.get(endpoint.url);
      console.log(`✅ ${endpoint.name}: ${response.status} - ${response.data.length || 0} items`);
    } catch (error) {
      console.log(`❌ ${endpoint.name}: ${error.message}`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Data: ${JSON.stringify(error.response.data)}`);
      }
    }
    console.log('');
  }
}

testApiEndpoints();
