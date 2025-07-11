# Academic System API Documentation

This document provides comprehensive information about the Academic System APIs including Schools, Departments, Courses, and Faculty management.

## Base URL
```
http://localhost:5000/api
```

## Response Format
All APIs return responses in the following format:
```json
{
  "success": boolean,
  "message": "string (optional)",
  "data": "object/array (optional)",
  "error": "string (optional)"
}
```

---

## Schools API

### Get All Schools
**GET** `/schools`

**Query Parameters:**
- `status` (optional): Filter by status ('active' | 'inactive')

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "ObjectId",
      "name": "School of Engineering",
      "code": "SOE",
      "description": "Leading engineering education...",
      "dean": "Dr. John Smith",
      "contact": {
        "email": "dean.soe@university.edu",
        "phone": "+1-555-1234",
        "office": "Admin Building, Room 101"
      },
      "establishedYear": 1985,
      "accreditation": ["AICTE", "NBA"],
      "image": "url/to/image",
      "status": "active",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get School by ID
**GET** `/schools/:id`

**Response:** School object with departments array

### Create School (Admin)
**POST** `/schools`

**Request Body:**
```json
{
  "name": "School of Management",
  "code": "SOM",
  "description": "Excellence in management education...",
  "dean": "Dr. Jane Doe",
  "contact": {
    "email": "dean.som@university.edu",
    "phone": "+1-555-5678",
    "office": "Admin Building, Room 201"
  },
  "establishedYear": 1990,
  "accreditation": ["AICTE", "NAAC"],
  "image": "url/to/image",
  "status": "active"
}
```

### Update School (Admin)
**PUT** `/schools/:id`

### Delete School (Admin)
**DELETE** `/schools/:id`

### Get School Statistics (Admin)
**GET** `/schools/:id/stats`

---

## Departments API

### Get All Departments
**GET** `/departments`

**Query Parameters:**
- `schoolId` (optional): Filter by school
- `status` (optional): Filter by status

### Get Departments by School
**GET** `/departments/school/:schoolId`

### Get Department by ID
**GET** `/departments/:id`

**Response:** Department object with courses and faculty arrays

### Create Department (Admin)
**POST** `/departments`

**Request Body:**
```json
{
  "schoolId": "ObjectId",
  "name": "Computer Science & Engineering",
  "code": "CSE",
  "description": "Leading computer science education...",
  "head": "Dr. Alice Johnson",
  "contact": {
    "email": "hod.cse@university.edu",
    "phone": "+1-555-9012",
    "office": "Engineering Block, Room 301"
  },
  "facilities": ["Modern Labs", "Research Centers"],
  "achievements": ["Best Department Award 2023"],
  "image": "url/to/image",
  "status": "active"
}
```

### Update Department (Admin)
**PUT** `/departments/:id`

### Delete Department (Admin)
**DELETE** `/departments/:id`

### Get Department Statistics (Admin)
**GET** `/departments/:id/stats`

---

## Courses API

### Get All Courses
**GET** `/courses`

**Query Parameters:**
- `level` (optional): Filter by level ('UG' | 'PG' | 'Diploma' | 'PhD')
- `degree` (optional): Filter by degree ('B.Tech' | 'M.Tech' | 'MCA' | 'MBA' | 'BBA' | 'Diploma')
- `departmentId` (optional): Filter by department
- `schoolId` (optional): Filter by school
- `status` (optional): Filter by status
- `admissionOpen` (optional): Filter by admission status
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

### Get Courses by Level
**GET** `/courses/level/:level`

**Parameters:**
- `level`: 'UG' | 'PG' | 'Diploma' | 'PhD'

### Get Courses by Department
**GET** `/courses/department/:departmentId`

### Get Course by ID
**GET** `/courses/:id`

**Response:** Complete course object with populated department and school

### Search Courses
**GET** `/courses/search`

**Query Parameters:**
- `query` (required): Search term
- `level` (optional): Filter by level
- `degree` (optional): Filter by degree

### Create Course (Admin)
**POST** `/courses`

**Request Body:**
```json
{
  "departmentId": "ObjectId",
  "schoolId": "ObjectId",
  "name": "Bachelor of Technology in Computer Science & Engineering",
  "shortName": "B.Tech CSE",
  "code": "BTECHCSE",
  "level": "UG",
  "degree": "B.Tech",
  "specialization": "Artificial Intelligence",
  "duration": {
    "years": 4,
    "semesters": 8
  },
  "totalCredits": 160,
  "eligibility": {
    "academicRequirement": "10+2 with PCM",
    "entranceExam": ["JEE Main", "JEE Advanced"],
    "minimumPercentage": 75,
    "ageLimit": {
      "min": 17,
      "max": 25
    }
  },
  "feeStructure": {
    "admissionFee": 50000,
    "semesterFee": 80000,
    "totalFee": 690000,
    "scholarships": ["Merit Scholarship", "Need-based Aid"]
  },
  "curriculum": [
    {
      "semester": 1,
      "subjects": [
        {
          "code": "CS101",
          "name": "Introduction to Programming",
          "credits": 4,
          "type": "core"
        }
      ]
    }
  ],
  "careerProspects": ["Software Engineer", "Data Scientist"],
  "placementStats": [
    {
      "year": 2023,
      "percentage": 95,
      "averagePackage": 800000,
      "highestPackage": 4500000,
      "majorRecruiters": ["Google", "Microsoft", "Amazon"]
    }
  ],
  "accreditation": ["AICTE", "NBA"],
  "description": "Comprehensive computer science program...",
  "objectives": ["Develop programming skills", "Problem solving"],
  "outcomes": ["Industry-ready graduates"],
  "image": "url/to/image",
  "brochure": "url/to/brochure",
  "intake": 120,
  "status": "active",
  "admissionOpen": true
}
```

### Update Course (Admin)
**PUT** `/courses/:id`

### Delete Course (Admin)
**DELETE** `/courses/:id`

---

## Faculty API

### Get All Faculty
**GET** `/faculty`

**Query Parameters:**
- `departmentId` (optional): Filter by department
- `schoolId` (optional): Filter by school
- `designation` (optional): Filter by designation
- `status` (optional): Filter by status
- `page` (optional): Page number
- `limit` (optional): Items per page

### Get Faculty by Department
**GET** `/faculty/department/:departmentId`

### Get Faculty by ID
**GET** `/faculty/:id`

### Search Faculty
**GET** `/faculty/search`

**Query Parameters:**
- `query` (required): Search term
- `designation` (optional): Filter by designation
- `departmentId` (optional): Filter by department

### Get Faculty Statistics
**GET** `/faculty/stats`

### Create Faculty (Admin)
**POST** `/faculty`

**Request Body:**
```json
{
  "departmentId": "ObjectId",
  "schoolId": "ObjectId",
  "name": "Dr. Robert Wilson",
  "designation": "Professor",
  "qualification": ["Ph.D. Computer Science", "M.Tech CSE"],
  "experience": 15,
  "email": "robert.wilson@university.edu",
  "phone": "+1-555-3456",
  "office": "Engineering Block, Room 405",
  "specialization": ["Machine Learning", "Data Mining"],
  "researchInterests": ["AI", "Deep Learning"],
  "publications": [
    {
      "title": "Advanced Machine Learning Techniques",
      "journal": "IEEE Transactions on AI",
      "year": 2023,
      "url": "https://doi.org/example"
    }
  ],
  "awards": ["Best Researcher Award 2022"],
  "biography": "Dr. Wilson is a renowned expert in machine learning...",
  "image": "url/to/image",
  "cv": "url/to/cv",
  "status": "active"
}
```

### Update Faculty (Admin)
**PUT** `/faculty/:id`

### Delete Faculty (Admin)
**DELETE** `/faculty/:id`

---

## Error Codes

- **400**: Bad Request - Missing required fields or invalid data
- **404**: Not Found - Resource not found
- **409**: Conflict - Duplicate data (e.g., course code already exists)
- **500**: Internal Server Error - Server error

## Authentication

Admin routes are protected and require authentication. Add the following header:
```
Authorization: Bearer <your-jwt-token>
```

## Rate Limiting

API calls are limited to 100 requests per minute per IP address.

## Data Validation

All input data is validated on the server side. Ensure:
- Required fields are provided
- Email addresses are valid
- Numeric values are within specified ranges
- Enum values match allowed options

## Example Usage

### Creating a Complete Academic Structure

1. **Create School:**
```bash
POST /api/schools
```

2. **Create Department:**
```bash
POST /api/departments
```

3. **Create Course:**
```bash
POST /api/courses
```

4. **Add Faculty:**
```bash
POST /api/faculty
```

### Public Queries

1. **Get all UG courses:**
```bash
GET /api/courses?level=UG
```

2. **Search for AI courses:**
```bash
GET /api/courses/search?query=artificial intelligence
```

3. **Get faculty in CSE department:**
```bash
GET /api/faculty/department/:cse-department-id
```
