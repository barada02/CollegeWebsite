#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('\n========================================');
console.log('   Academic Data Seeding Script');
console.log('   Excellence University Database');
console.log('========================================\n');

// Check if we're in the right directory
const currentDir = process.cwd();
const serverDir = path.resolve(__dirname);

console.log(`📁 Current directory: ${currentDir}`);
console.log(`📁 Server directory: ${serverDir}`);

// Change to server directory
process.chdir(serverDir);

try {
  // Check if .env file exists
  if (!fs.existsSync('.env')) {
    console.log('⚠️  Warning: .env file not found!');
    console.log('📝 Creating a sample .env file...\n');
    
    const envContent = `# Database Configuration
MONGODB_URI=mongodb://localhost:27017/excellenceuniversity
PORT=5000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Admin Configuration
ADMIN_EMAIL=admin@excellenceuniversity.edu
ADMIN_PASSWORD=admin123`;

    fs.writeFileSync('.env', envContent);
    console.log('✅ Sample .env file created. Please update MongoDB URI if needed.\n');
  }

  // Install dependencies if node_modules doesn't exist
  if (!fs.existsSync('node_modules')) {
    console.log('📦 Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });
    console.log('');
  }

  // Compile TypeScript
  console.log('🔨 Compiling TypeScript...');
  execSync('npm run build', { stdio: 'inherit' });

  // Run the seeding script
  console.log('\n🌱 Starting database seeding...');
  console.log('========================================');
  execSync('node dist/scripts/seedAcademicData.js', { stdio: 'inherit' });

  console.log('\n========================================');
  console.log('✅ Database seeding completed successfully!');
  console.log('\n🎯 You can now:');
  console.log('1. Start the server with: npm run dev');
  console.log('2. Test APIs using the documentation');
  console.log('3. Access the academic data via endpoints');
  console.log('========================================\n');

} catch (error) {
  console.error('\n========================================');
  console.error('❌ Database seeding failed!');
  console.error('Error:', error.message);
  console.error('========================================\n');
  process.exit(1);
}
