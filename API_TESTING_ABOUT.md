# About Section API Testing Guide

## Available Endpoints

### Base URL: `http://localhost:5000/api/about`

---

## 🔧 **Setup and Testing**

### 1. Start the Server
```bash
cd Server
npm run dev
```

### 2. Initialize About Data (Run this first)
```bash
POST http://localhost:5000/api/about/initialize
```

---

## 📋 **API Endpoints**

### 1. **Get About Information** (Public)
```
GET /api/about/
```

**Example using curl:**
```bash
curl -X GET http://localhost:5000/api/about/
```

**Expected Response:**
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

### 2. **Update About Information** (Admin)
```
PUT /api/about/
```

**Example using curl:**
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

### 3. **Update Statistics Only** (Admin)
```
PUT /api/about/stats
```

**Example using curl:**
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

### 4. **Add Achievement** (Admin)
```
POST /api/about/achievements
```

**Example using curl:**
```bash
curl -X POST http://localhost:5000/api/about/achievements \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Achievement",
    "description": "Description of the achievement",
    "year": 2024,
    "date": "2024-06-25"
  }'
```

---

### 5. **Add Leadership Member** (Admin)
```
POST /api/about/leadership
```

**Example using curl:**
```bash
curl -X POST http://localhost:5000/api/about/leadership \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. John Doe",
    "position": "Dean of Engineering",
    "bio": "Dr. Doe has 15 years of experience in engineering education",
    "email": "john.doe@university.edu"
  }'
```

---

## 🧪 **Testing Steps**

1. **Start the server:**
   ```bash
   cd Server
   npm run dev
   ```

2. **Initialize the about data:**
   ```bash
   curl -X POST http://localhost:5000/api/about/initialize
   ```

3. **Test getting the data:**
   ```bash
   curl -X GET http://localhost:5000/api/about/
   ```

4. **Test updating stats:**
   ```bash
   curl -X PUT http://localhost:5000/api/about/stats \
     -H "Content-Type: application/json" \
     -d '{"students": 16000, "faculty": 520, "programs": 55, "yearsOfExcellence": 40}'
   ```

5. **Verify the update:**
   ```bash
   curl -X GET http://localhost:5000/api/about/
   ```

---

## 📝 **Data Structure**

### About Model Schema:
```typescript
{
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

---

## ⚠️ **Notes**

- Authentication middleware is commented out for now (will be implemented later)
- The `/initialize` endpoint should only be used for development
- All admin endpoints (PUT, POST) will require authentication when implemented
- Error responses follow the pattern: `{ "success": false, "message": "error message" }`
