# 🌱 Academic Data Seeding Guide

This guide explains how to populate your Excellence University database with sample academic data including Schools, Departments, Courses, and Faculty.

## 📋 What Gets Seeded

### 🏫 Schools (3)
- **School of Engineering (SOE)** - Established 1985
- **School of Management (SOM)** - Established 1992  
- **School of Informatics (SOI)** - Established 1998

### 🏢 Departments (6)
- **Engineering:** CSE, Mechanical, Electrical, IT
- **Management:** Business Administration
- **Informatics:** Computer Applications

### 📚 Courses (8)
- **UG Programs:** B.Tech CSE, B.Tech CSE (AI/ML), B.Tech Mechanical, BBA
- **PG Programs:** M.Tech CSE, MBA, MCA

### 👨‍🏫 Faculty (6)
- Department heads and professors with complete profiles
- Research interests, publications, and achievements

## 🚀 How to Run the Seeding Script

### Method 1: Using Batch File (Windows - Easiest)
```bash
# Navigate to Server directory
cd Server

# Run the batch file
seed-database.bat
```

### Method 2: Using Node.js Script
```bash
# Navigate to Server directory
cd Server

# Run the Node.js script
node seed-database.js
```

### Method 3: Using NPM Commands
```bash
# Navigate to Server directory
cd Server

# Install dependencies (if not already installed)
npm install

# Option A: Direct TypeScript execution
npm run seed

# Option B: Build then execute
npm run seed:prod
```

### Method 4: Manual TypeScript Execution
```bash
# Navigate to Server directory
cd Server

# Install dependencies
npm install

# Compile TypeScript
npm run build

# Run the compiled script
node dist/scripts/seedAcademicData.js
```

## ⚙️ Prerequisites

### 1. MongoDB Running
Make sure MongoDB is running on your system:
```bash
# Start MongoDB (Windows)
mongod

# Or if using MongoDB service
net start MongoDB
```

### 2. Environment File
The script will create a sample `.env` file if it doesn't exist:
```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/excellenceuniversity
PORT=5000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Admin Configuration
ADMIN_EMAIL=admin@excellenceuniversity.edu
ADMIN_PASSWORD=admin123
```

**Important:** Update the `MONGODB_URI` if your MongoDB is running on a different host/port.

### 3. Node.js and NPM
Ensure you have Node.js and NPM installed:
```bash
node --version
npm --version
```

## 📊 Sample Data Overview

### Schools Data
Each school includes:
- Name, code, description
- Dean information
- Contact details (email, phone, office)
- Establishment year
- Accreditation details
- Status (active/inactive)

### Departments Data
Each department includes:
- School association
- Department head
- Contact information
- Facilities list
- Achievements
- Faculty references

### Courses Data
Each course includes:
- Complete academic details
- Duration and credits
- Eligibility criteria
- Fee structure
- Career prospects
- Placement statistics
- Curriculum structure (sample semesters)
- Admission status

### Faculty Data
Each faculty member includes:
- Personal and contact information
- Qualifications and experience
- Specialization areas
- Research interests
- Publications list
- Awards and achievements
- Biography

## 🔄 Re-seeding the Database

The script clears existing data before inserting new data:
```javascript
await School.deleteMany({});     // Clears all schools
await Department.deleteMany({}); // Clears all departments
await Course.deleteMany({});     // Clears all courses
await Faculty.deleteMany({});    // Clears all faculty
```

**Warning:** This will delete all existing academic data. Make sure to backup important data before re-seeding.

## 🧪 Testing the Seeded Data

After seeding, you can test the APIs:

### 1. Start the Server
```bash
npm run dev
```

### 2. Test API Endpoints
```bash
# Get all schools
GET http://localhost:5000/api/schools

# Get school with departments
GET http://localhost:5000/api/schools/{school-id}

# Get all courses
GET http://localhost:5000/api/courses

# Get UG courses only
GET http://localhost:5000/api/courses?level=UG

# Get faculty by department
GET http://localhost:5000/api/faculty/department/{department-id}

# Search courses
GET http://localhost:5000/api/courses/search?query=computer science
```

## 📈 Expected Output

When seeding is successful, you'll see:
```
🌱 Starting database seeding...
📊 Connecting to database...
🏫 Seeding Schools...
✅ Successfully created 3 schools
🏢 Seeding Departments...
✅ Successfully created 6 departments
📚 Seeding Courses...
✅ Successfully created 8 courses
👨‍🏫 Seeding Faculty...
✅ Successfully created 6 faculty members

🎉 Database seeding completed successfully!
📈 Summary:
   - Schools: 3
   - Departments: 6
   - Courses: 8
   - Faculty: 6
```

## 🐛 Troubleshooting

### Common Issues:

1. **MongoDB Connection Error**
   ```
   Error: connect ECONNREFUSED 127.0.0.1:27017
   ```
   - Ensure MongoDB is running
   - Check MongoDB URI in .env file

2. **TypeScript Compilation Errors**
   ```
   Error: TypeScript compilation failed
   ```
   - Run `npm install` to install dependencies
   - Check for syntax errors in TypeScript files

3. **Permission Errors (Windows)**
   ```
   Access denied or execution policy error
   ```
   - Run Command Prompt as Administrator
   - Or use PowerShell with: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

4. **Port Already in Use**
   ```
   Error: Port 5000 is already in use
   ```
   - Change PORT in .env file
   - Or stop the conflicting process

## 📝 Customizing Sample Data

To modify the sample data:

1. Edit `src/scripts/seedAcademicData.ts`
2. Modify the sample data arrays:
   - `sampleSchools`
   - `sampleDepartments` 
   - `sampleCourses`
   - `sampleFaculty`
3. Run the seeding script again

## 🔐 Security Notes

- The sample data includes placeholder contact information
- Change default admin credentials before production
- Update JWT secret in production
- Review and update faculty email addresses
- Ensure proper access controls are implemented

## 📚 Next Steps

After seeding:
1. Start the development server: `npm run dev`
2. Test the academic APIs
3. Implement frontend components to display this data
4. Add admin dashboard to manage the academic data
5. Implement authentication and authorization
