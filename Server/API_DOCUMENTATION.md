# College Website API Documentation

## 📋 **Overview**

This API serves the College Website application with endpoints for managing about information, events, authentication, and general data.

### Base URL: `http://localhost:5000`

---

## 🚀 **Getting Started**

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation & Setup
```bash
# Clone the repository
git clone <repository-url>

# Navigate to server directory
cd Server

# Install dependencies
npm install

# Create .env file with the following variables:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/college-website
NODE_ENV=development

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## 🔐 **Authentication**

### Base Route: `/api/auth`

#### 1. Register Admin User
```
POST /api/auth/register-admin
```

**Request Body:**
```json
{
  "name": "Admin Name",
  "email": "admin@university.edu",
  "password": "securepassword123"
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/auth/register-admin \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Admin",
    "email": "admin@university.edu",
    "password": "password123"
  }'
```

---

#### 2. Login
```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "admin@university.edu",
  "password": "securepassword123"
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@university.edu",
    "password": "password123"
  }'
```

---

#### 3. Get All Users
```
GET /api/auth/users
```

**Example:**
```bash
curl -X GET http://localhost:5000/api/auth/users
```

---

## 📖 **About Section**

### Base Route: `/api/about`

#### 1. Get About Information (Public)
```
GET /api/about/
```

**Example:**
```bash
curl -X GET http://localhost:5000/api/about/
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "mission": "To provide world-class education...",
    "vision": "To be a leading institution...",
    "values": "Excellence, Integrity, Innovation...",
    "history": "Founded in 1985...",
    "stats": {
      "students": 15000,
      "faculty": 500,
      "programs": 50,
      "yearsOfExcellence": 39
    },
    "achievements": [...],
    "leadership": [...],
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

#### 2. Update About Information (Admin)
```
PUT /api/about/
```

**Request Body:**
```json
{
  "mission": "Updated mission statement",
  "vision": "Updated vision statement",
  "values": "Updated values",
  "history": "Updated history",
  "stats": {
    "students": 16000,
    "faculty": 520,
    "programs": 55,
    "yearsOfExcellence": 40
  }
}
```

**Example:**
```bash
curl -X PUT http://localhost:5000/api/about/ \
  -H "Content-Type: application/json" \
  -d '{
    "mission": "Updated mission statement",
    "vision": "Updated vision statement",
    "values": "Updated values",
    "history": "Updated history"
  }'
```

---

#### 3. Update Statistics Only (Admin)
```
PUT /api/about/stats
```

**Request Body:**
```json
{
  "students": 16000,
  "faculty": 520,
  "programs": 55,
  "yearsOfExcellence": 40
}
```

**Example:**
```bash
curl -X PUT http://localhost:5000/api/about/stats \
  -H "Content-Type: application/json" \
  -d '{
    "students": 16000,
    "faculty": 520,
    "programs": 55,
    "yearsOfExcellence": 40
  }'
```

---

#### 4. Add Achievement (Admin)
```
POST /api/about/achievements
```

**Request Body:**
```json
{
  "title": "New Achievement",
  "description": "Description of the achievement",
  "year": 2024,
  "date": "2024-06-25" // Optional
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/about/achievements \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Excellence Award 2024",
    "description": "Received national recognition for academic excellence",
    "year": 2024
  }'
```

---

#### 5. Add Leadership Member (Admin)
```
POST /api/about/leadership
```

**Request Body:**
```json
{
  "name": "Dr. John Doe",
  "position": "Dean of Engineering",
  "bio": "Dr. Doe has 15 years of experience in engineering education",
  "email": "john.doe@university.edu", // Optional
  "image": "https://example.com/image.jpg" // Optional
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/about/leadership \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Jane Smith",
    "position": "Vice President of Academic Affairs",
    "bio": "Dr. Smith brings over 20 years of experience in higher education.",
    "email": "jane.smith@university.edu"
  }'
```

---

#### 6. Initialize About Data (Development Only)
```
POST /api/about/initialize
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/about/initialize
```

---

## 📅 **Events**

### Base Route: `/api/events`

#### 1. Get All Events (Public)
```
GET /api/events/
```

**Query Parameters:**
- `page` (optional): Page number for pagination
- `limit` (optional): Number of events per page
- `status` (optional): Filter by event status

**Example:**
```bash
curl -X GET http://localhost:5000/api/events/
curl -X GET "http://localhost:5000/api/events/?page=1&limit=10"
```

---

#### 2. Get Event by ID (Public)
```
GET /api/events/:id
```

**Example:**
```bash
curl -X GET http://localhost:5000/api/events/60d5ec49f1b2c2b1f8e4e1a1
```

---

#### 3. Create Event (Admin)
```
POST /api/events/
```

**Request Body:**
```json
{
  "title": "Annual Science Fair",
  "description": "Join us for our annual science fair showcasing student innovations",
  "date": "2024-03-15",
  "time": "9:00 AM",
  "location": "Main Auditorium",
  "category": "Academic",
  "maxAttendees": 200
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/events/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Career Development Workshop",
    "description": "Learn essential career skills and networking strategies",
    "date": "2024-04-10",
    "time": "2:00 PM",
    "location": "Conference Hall"
  }'
```

---

#### 4. Update Event (Admin)
```
PUT /api/events/:id
```

**Request Body:** (Same as create, all fields optional for update)
```json
{
  "title": "Updated Event Title",
  "description": "Updated description",
  "location": "Updated Location"
}
```

**Example:**
```bash
curl -X PUT http://localhost:5000/api/events/60d5ec49f1b2c2b1f8e4e1a1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Science Fair",
    "location": "New Auditorium"
  }'
```

---

#### 5. Delete Event (Admin)
```
DELETE /api/events/:id
```

**Example:**
```bash
curl -X DELETE http://localhost:5000/api/events/60d5ec49f1b2c2b1f8e4e1a1
```

---

## 📊 **Data Management**

### Base Route: `/api/data`

#### 1. Get All Data (Public)
```
GET /api/data/
```

**Example:**
```bash
curl -X GET http://localhost:5000/api/data/
```

---

#### 2. Create Data (Admin)
```
POST /api/data/
```

**Request Body:**
```json
{
  "title": "Data Title",
  "description": "Data description"
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/data/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Important Announcement",
    "description": "This is an important announcement for all students"
  }'
```

---

## 📋 **Data Models**

### About Model
```typescript
{
  _id: ObjectId,
  mission: string,
  vision: string,
  values: string,
  history: string,
  stats: {
    students: number,
    faculty: number,
    programs: number,
    yearsOfExcellence: number
  },
  achievements: [{
    title: string,
    description: string,
    year: number,
    date?: Date
  }],
  leadership: [{
    name: string,
    position: string,
    bio: string,
    image?: string,
    email?: string
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Event Model
```typescript
{
  _id: ObjectId,
  title: string,
  description: string,
  date: Date,
  time?: string,
  location?: string,
  category?: string,
  maxAttendees?: number,
  currentAttendees?: number,
  status?: string,
  createdAt: Date,
  updatedAt: Date
}
```

### User Model
```typescript
{
  _id: ObjectId,
  name: string,
  email: string,
  password: string, // Hashed
  role: string, // 'admin', 'user'
  createdAt: Date
}
```

---

## 🚨 **Error Handling**

### Standard Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (in development)"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## 🧪 **Testing Workflow**

### Quick Start Testing
```bash
# 1. Start the server
cd Server
npm run dev

# 2. Initialize about data
curl -X POST http://localhost:5000/api/about/initialize

# 3. Test basic endpoints
curl -X GET http://localhost:5000/api/about/
curl -X GET http://localhost:5000/api/events/
curl -X GET http://localhost:5000/api/data/

# 4. Test creating an event
curl -X POST http://localhost:5000/api/events/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Event",
    "description": "This is a test event",
    "date": "2024-12-25",
    "location": "Test Location"
  }'
```

---

## 🔧 **Environment Variables**

Create a `.env` file in the Server directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/college-website
NODE_ENV=development
JWT_SECRET=your-secret-key-here
CORS_ORIGIN=http://localhost:3000
```

---

## 📝 **Development Notes**

- Authentication middleware is currently commented out for development
- All admin endpoints will require authentication when implemented
- The `/initialize` endpoints should be removed in production
- CORS is configured for development (all origins allowed)
- All endpoints return JSON responses
- Validation is implemented using express-validator

---

## 🤝 **Contributing**

When adding new endpoints:

1. Create the model in `/src/models/`
2. Create the controller in `/src/controllers/`
3. Create the routes in `/src/routes/`
4. Add routes to `/src/index.ts`
5. Update this documentation
6. Add tests if applicable

---

## 📞 **Support**

For questions or issues, please contact the development team or create an issue in the project repository.
