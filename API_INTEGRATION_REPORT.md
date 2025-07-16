# API Documentation & Integration Report

## 🔗 API Architecture Overview

### API Design Philosophy
- **RESTful Architecture**: Standard HTTP methods and status codes
- **Resource-Based URLs**: Intuitive endpoint structure
- **JSON Communication**: Consistent request/response format
- **Stateless Design**: JWT-based authentication for scalability
- **Versioned APIs**: Future-proof API evolution

### Base Configuration
- **Base URL**: `http://localhost:5000`
- **API Prefix**: `/api`
- **Content Type**: `application/json`
- **Authentication**: Bearer Token (JWT)

## 📋 API Endpoint Categories

### 1. Authentication Endpoints
**Base Route**: `/api/auth`

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@college.edu",
  "password": "securepassword"
}
```

**Response**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "605c72ef1532b",
    "name": "Admin User",
    "email": "admin@college.edu",
    "role": "admin"
  }
}
```

#### Register (Admin Only)
```http
POST /api/auth/register
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Admin",
  "email": "newadmin@college.edu", 
  "password": "securepassword",
  "role": "admin"
}
```

#### Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

### 2. About Section API
**Base Route**: `/api/about`

#### Get About Information (Public)
```http
GET /api/about/
```

**Response**:
```json
{
  "success": true,
  "data": {
    "_id": "605c72ef1532b",
    "mission": "To provide world-class education and foster innovation",
    "vision": "To be a leading institution in higher education",
    "values": "Excellence, Integrity, Innovation, Inclusivity",
    "history": "Founded in 1985, our college has been...",
    "stats": {
      "students": 15000,
      "faculty": 500,
      "programs": 50,
      "yearsOfExcellence": 39
    },
    "achievements": [
      {
        "_id": "605c72ef1532c",
        "title": "NAAC A+ Accreditation",
        "description": "Received highest grade from NAAC",
        "year": 2023
      }
    ],
    "leadership": [
      {
        "_id": "605c72ef1532d",
        "name": "Dr. John Doe",
        "position": "Principal",
        "bio": "Distinguished educator with 25+ years experience",
        "email": "principal@college.edu"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Update About Information (Admin)
```http
PUT /api/about/
Authorization: Bearer <token>
Content-Type: application/json

{
  "mission": "Updated mission statement",
  "vision": "Updated vision statement",
  "values": "Updated core values",
  "history": "Updated college history"
}
```

#### Update Statistics (Admin)
```http
PUT /api/about/stats
Authorization: Bearer <token>
Content-Type: application/json

{
  "students": 15500,
  "faculty": 520,
  "programs": 55,
  "yearsOfExcellence": 40
}
```

#### Add Achievement (Admin)
```http
POST /api/about/achievements
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "New Achievement",
  "description": "Description of achievement",
  "year": 2024
}
```

#### Add Leadership Member (Admin)
```http
POST /api/about/leadership
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Dr. Jane Smith",
  "position": "Vice Principal",
  "bio": "Academic leader with expertise in...",
  "email": "vp@college.edu"
}
```

### 3. Academic System APIs

#### Schools API
**Base Route**: `/api/schools`

##### Get All Schools (Public)
```http
GET /api/schools
```

##### Get School by ID (Public)
```http
GET /api/schools/:id
```

##### Create School (Admin)
```http
POST /api/schools
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "School of Computer Science",
  "description": "Leading school in computer science education",
  "dean": "Dr. Computer Science Dean",
  "established": "1990-01-01"
}
```

#### Departments API
**Base Route**: `/api/departments`

##### Get All Departments (Public)
```http
GET /api/departments
```

##### Get Departments by School (Public)
```http
GET /api/departments/school/:schoolId
```

##### Create Department (Admin)
```http
POST /api/departments
Authorization: Bearer <token>
Content-Type: application/json

{
  "schoolId": "605c72ef1532b",
  "name": "Computer Science Engineering",
  "shortName": "CSE",
  "description": "Computer Science and Engineering department",
  "head": "Dr. CSE Head",
  "established": "1995-01-01"
}
```

#### Courses API
**Base Route**: `/api/courses`

##### Get All Courses (Public)
```http
GET /api/courses
```

##### Search Courses (Public)
```http
GET /api/courses/search?query=computer&level=UG
```

##### Filter Courses (Public)
```http
GET /api/courses?level=UG&admissionOpen=true&department=605c72ef1532b
```

##### Get Course by ID (Public)
```http
GET /api/courses/:id
```

##### Create Course (Admin)
```http
POST /api/courses
Authorization: Bearer <token>
Content-Type: application/json

{
  "departmentId": "605c72ef1532b",
  "schoolId": "605c72ef1532c",
  "name": "Bachelor of Technology in Computer Science",
  "code": "BTCS",
  "level": "UG",
  "duration": {
    "years": 4,
    "semesters": 8
  },
  "eligibility": {
    "academicRequirement": "12th grade with PCM",
    "entranceExam": ["JEE Main", "State CET"],
    "minimumPercentage": 75
  },
  "feeStructure": {
    "admissionFee": 25000,
    "semesterFee": 60000,
    "totalFee": 505000
  },
  "description": "Comprehensive computer science program",
  "intake": 120,
  "status": "active",
  "admissionOpen": true
}
```

#### Faculty API
**Base Route**: `/api/faculty`

##### Get All Faculty (Public)
```http
GET /api/faculty
```

##### Get Faculty by Department (Public)
```http
GET /api/faculty/department/:departmentId
```

##### Get Faculty by ID (Public)
```http
GET /api/faculty/:id
```

##### Create Faculty (Admin)
```http
POST /api/faculty
Authorization: Bearer <token>
Content-Type: application/json

{
  "departmentId": "605c72ef1532b",
  "schoolId": "605c72ef1532c",
  "name": "Dr. John Faculty",
  "designation": "Professor",
  "qualification": ["PhD Computer Science", "M.Tech CSE"],
  "experience": 15,
  "email": "john.faculty@college.edu",
  "specialization": ["Machine Learning", "Data Science"],
  "researchInterests": ["AI", "Deep Learning"],
  "publications": [
    {
      "title": "Advanced Machine Learning Techniques",
      "journal": "IEEE Transactions on AI",
      "year": 2023,
      "url": "https://doi.org/example"
    }
  ]
}
```

### 4. Contact Management API
**Base Route**: `/api/contact`

#### Submit Contact Form (Public)
```http
POST /api/contact/
Content-Type: application/json

{
  "name": "John Student",
  "email": "john@email.com",
  "phone": "+1234567890",
  "subject": "Admission Inquiry",
  "message": "I would like to know about admission process...",
  "type": "admission"
}
```

#### Get All Contacts (Admin)
```http
GET /api/contact/
Authorization: Bearer <token>
```

#### Update Contact Status (Admin)
```http
PUT /api/contact/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "resolved",
  "response": "Thank you for your inquiry. Here are the details..."
}
```

### 5. Events Management API
**Base Route**: `/api/events`

#### Get All Events (Public)
```http
GET /api/events
```

#### Get Upcoming Events (Public)
```http
GET /api/events?status=upcoming
```

#### Create Event (Admin)
```http
POST /api/events
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Annual Tech Fest",
  "description": "Three-day technical festival with workshops and competitions",
  "date": "2024-03-15T09:00:00.000Z",
  "location": "Main Campus",
  "category": "technical",
  "maxAttendees": 500,
  "organizer": "Technical Society",
  "registrationRequired": true
}
```

## 🔐 Authentication & Authorization

### JWT Token Structure
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "userId": "605c72ef1532b",
    "email": "admin@college.edu",
    "role": "admin",
    "iat": 1640995200,
    "exp": 1641081600
  }
}
```

### Authorization Levels
- **Public**: No authentication required
- **Admin**: Requires valid JWT token with admin role
- **Super Admin**: Highest level access for system management

### Protected Endpoints
All `POST`, `PUT`, `DELETE` operations require authentication:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📊 Response Format Standards

### Success Response Format
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Optional success message",
  "pagination": { /* pagination info if applicable */ }
}
```

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"],
  "statusCode": 400
}
```

### Pagination Format
```json
{
  "success": true,
  "data": [/* array of items */],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "limit": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## 🚨 HTTP Status Codes

### Success Codes
- **200 OK**: Successful GET, PUT requests
- **201 Created**: Successful POST requests
- **204 No Content**: Successful DELETE requests

### Client Error Codes
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource already exists
- **422 Unprocessable Entity**: Validation errors

### Server Error Codes
- **500 Internal Server Error**: Unexpected server error
- **503 Service Unavailable**: Database connection issues

## 🔍 Query Parameters & Filtering

### Common Query Parameters
```http
# Pagination
GET /api/courses?page=2&limit=10

# Filtering
GET /api/courses?level=UG&status=active

# Sorting
GET /api/faculty?sort=name&order=asc

# Search
GET /api/courses/search?query=computer+science

# Multiple filters
GET /api/faculty?department=605c72ef1532b&active=true&sort=experience&order=desc
```

### Advanced Filtering
```http
# Date range filtering
GET /api/events?startDate=2024-01-01&endDate=2024-12-31

# Numeric range filtering
GET /api/courses?minFee=50000&maxFee=100000

# Array field filtering
GET /api/faculty?specialization=Machine Learning,AI
```

## 🧪 API Testing Examples

### Using cURL

#### Test Authentication
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@college.edu",
    "password": "password123"
  }'

# Use token for protected endpoint
curl -X GET http://localhost:5000/api/contact/ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Test Public Endpoints
```bash
# Get all schools
curl -X GET http://localhost:5000/api/schools

# Search courses
curl -X GET "http://localhost:5000/api/courses/search?query=computer&level=UG"

# Get faculty by department
curl -X GET http://localhost:5000/api/faculty/department/605c72ef1532b
```

#### Test CRUD Operations
```bash
# Create new course
curl -X POST http://localhost:5000/api/courses \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Master of Computer Applications",
    "code": "MCA",
    "level": "PG",
    "departmentId": "605c72ef1532b",
    "schoolId": "605c72ef1532c"
  }'
```

### Testing with Postman

#### Collection Structure
```
College Website API
├── Authentication
│   ├── Login
│   ├── Register
│   └── Get Profile
├── About Section
│   ├── Get About Info
│   ├── Update About Info
│   └── Add Achievement
├── Academic System
│   ├── Schools
│   │   ├── Get All Schools
│   │   ├── Create School
│   │   └── Update School
│   ├── Departments
│   └── Courses
├── Faculty Management
└── Contact Management
```

#### Environment Variables
```json
{
  "baseURL": "http://localhost:5000/api",
  "authToken": "{{token}}",
  "adminEmail": "admin@college.edu",
  "adminPassword": "password123"
}
```

## 📋 Data Validation Rules

### Input Validation
```javascript
// Example validation rules for course creation
const courseValidation = [
  body('name')
    .notEmpty()
    .withMessage('Course name is required')
    .isLength({ max: 200 })
    .withMessage('Course name too long'),
  
  body('code')
    .notEmpty()
    .withMessage('Course code is required')
    .matches(/^[A-Z]{2,4}\d{3}$/)
    .withMessage('Invalid course code format'),
  
  body('level')
    .isIn(['UG', 'PG', 'PhD', 'Diploma'])
    .withMessage('Invalid course level'),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('Invalid email format'),
    
  body('duration.years')
    .isInt({ min: 1, max: 10 })
    .withMessage('Duration must be between 1-10 years')
];
```

### Response Validation
- All responses include `success` boolean field
- Data validation errors return detailed error arrays
- Consistent error message format across all endpoints
- Proper HTTP status codes for different scenarios

## 🔧 Rate Limiting & Performance

### Rate Limiting (Planned)
```javascript
// Example rate limiting configuration
const rateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
};
```

### Caching Strategy (Planned)
- **Public Data**: Cache frequently accessed public endpoints
- **Search Results**: Cache search query results
- **Static Content**: Cache college information and about data
- **TTL Strategy**: Different cache durations for different data types

## 🚀 API Evolution & Versioning

### Version Strategy
- **Current**: v1 (implicit in base URL)
- **Future**: `/api/v2/` for breaking changes
- **Backward Compatibility**: Maintain v1 support during transition

### Breaking Changes Protocol
1. Announce deprecation timeline
2. Implement new version alongside existing
3. Provide migration documentation
4. Gradually sunset old version

## 📈 Monitoring & Analytics

### API Metrics (Planned)
- **Response Times**: Average and percentile response times
- **Error Rates**: Error frequency by endpoint
- **Usage Patterns**: Most accessed endpoints
- **Authentication**: Login success/failure rates

### Logging Strategy
- **Request Logging**: All API requests with timestamps
- **Error Logging**: Detailed error information
- **Performance Logging**: Slow query identification
- **Security Logging**: Authentication attempts and failures

This comprehensive API documentation provides a complete reference for integrating with the college website management system, ensuring consistent and efficient data exchange between frontend and backend systems.
