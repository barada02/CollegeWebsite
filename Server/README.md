# Aurora University College Website - Backend API

This is the backend API server for Aurora University's college website, built with Node.js, Express, TypeScript, and MongoDB.

## Project Structure

```
Server/
├── src/
│   ├── config/
│   │   ├── auth.ts          # Authentication configuration
│   │   └── db.ts            # MongoDB connection setup
│   ├── controllers/
│   │   ├── aboutController.ts     # About page data management
│   │   ├── authController.ts      # Authentication logic
│   │   ├── contactController.ts   # Contact form handling
│   │   ├── courseController.ts    # Academic courses management
│   │   ├── dataController.ts      # General data operations
│   │   ├── departmentController.ts # Department management
│   │   ├── eventController.ts     # Events management
│   │   ├── facultyController.ts   # Faculty information
│   │   └── schoolController.ts    # Schools/colleges management
│   ├── middleware/
│   │   ├── adminAuth.ts     # Admin authentication middleware
│   │   ├── auth.ts          # General authentication middleware
│   │   └── errorHandler.ts # Global error handling
│   ├── models/
│   │   ├── About.ts         # About page data model
│   │   ├── Contact.ts       # Contact information model
│   │   ├── Course.ts        # Academic course model
│   │   ├── Data.ts          # General data model
│   │   ├── Department.ts    # Department model
│   │   ├── Event.ts         # Event model
│   │   ├── Faculty.ts       # Faculty member model
│   │   ├── School.ts        # School/college model
│   │   └── User.ts          # User authentication model
│   ├── routes/
│   │   ├── about.ts         # About page routes
│   │   ├── auth.ts          # Authentication routes
│   │   ├── contact.ts       # Contact form routes
│   │   ├── courses.ts       # Academic courses routes
│   │   ├── data.ts          # General data routes
│   │   ├── departments.ts   # Department routes
│   │   ├── events.ts        # Events routes
│   │   ├── faculty.ts       # Faculty routes
│   │   └── schools.ts       # Schools routes
│   ├── scripts/
│   │   ├── package.json     # Scripts package configuration
│   │   └── seedAcademicData.ts # Database seeding script
│   └── index.ts             # Main server entry point
├── API_DOCUMENTATION.md     # Comprehensive API documentation
├── SEEDING_GUIDE.md        # Database seeding instructions
├── package.json            # Project dependencies and scripts
├── seed-database.bat       # Windows batch script for seeding
├── seed-database.js        # Database seeding utility
├── tsconfig.json           # TypeScript configuration
└── README.md               # This file
```

## Features

- **RESTful API**: Complete CRUD operations for all university data
- **Session-based Authentication**: Secure admin authentication using express-session
- **MongoDB Integration**: Mongoose ODM for database operations
- **TypeScript**: Full type safety throughout the backend
- **Input Validation**: Request validation and sanitization
- **Error Handling**: Comprehensive error handling middleware
- **CORS Support**: Cross-origin resource sharing configuration
- **Database Seeding**: Automated data population scripts

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/check` - Check authentication status

### About Page
- `GET /api/about` - Get about page data
- `PUT /api/about` - Update about page data (Admin)

### Academic Data
- `GET /api/schools` - Get all schools/colleges
- `GET /api/departments` - Get all departments
- `GET /api/courses` - Get all courses
- `GET /api/faculty` - Get faculty members

### Events & Contact
- `GET /api/events` - Get events
- `POST /api/contact` - Submit contact form
- `GET /api/contacts` - Get contact submissions (Admin)

## Environment Variables

Create a `.env` file in the server root:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/aurora_university
DB_NAME=aurora_university

# Server
PORT=5000
NODE_ENV=development

# Session
SESSION_SECRET=your_session_secret_here

# Admin Credentials
ADMIN_EMAIL=admin@aurorauni.edu
ADMIN_PASSWORD=admin123
```

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start MongoDB:**
   ```bash
   # Make sure MongoDB is running locally or update MONGODB_URI
   ```

4. **Seed the database:**
   ```bash
   npm run seed
   # Or use the batch script: ./seed-database.bat
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

6. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

## Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm run seed` - Seed database with sample data
- `npm run lint` - Run ESLint (if configured)

## Database Models

### About
- Mission, vision, values
- University statistics
- Leadership information
- History and achievements

### Academic
- Schools/Colleges with programs
- Departments with course offerings
- Faculty with profiles and expertise
- Course details and prerequisites

### Events & Contact
- University events and announcements
- Contact form submissions
- Administrative contact information

## Authentication

The API uses session-based authentication with the following features:
- Secure session management with express-session
- Admin-only routes protected by middleware
- Session persistence across requests
- Automatic session cleanup

## Error Handling

- Standardized error responses
- Input validation with meaningful messages
- MongoDB error handling
- Development vs production error details

## CORS Configuration

- Configured for frontend domain
- Supports credentials for session management
- Appropriate headers for API access

## Documentation

- See `API_DOCUMENTATION.md` for detailed endpoint documentation
- See `SEEDING_GUIDE.md` for database setup instructions
- Each controller includes JSDoc comments for API methods

## Technologies Used

- **Node.js** with Express.js framework
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **Express-session** for authentication
- **CORS** for cross-origin requests
- **dotenv** for environment configuration
- **Nodemon** for development hot-reload

## Contributing

1. Follow TypeScript and ESLint conventions
2. Add appropriate error handling for new endpoints
3. Update API documentation for new routes
4. Include input validation for all endpoints
5. Write JSDoc comments for new controllers

## License

© 2024 Aurora University. All rights reserved.
