# React College Website Setup Guide

## 1. Initial Setup Commands

```bash
# Create React app with TypeScript
npx create-react-app college-frontend --template typescript
cd college-frontend

# Install required dependencies
npm install axios react-router-dom
npm install @types/react-router-dom --save-dev

# Optional: Install styling libraries
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## 2. Project Structure

```
college-frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Layout.tsx
│   │   ├── ui/
│   │   │   ├── EventCard.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── Button.tsx
│   │   │   └── Modal.tsx
│   │   └── forms/
│   │       ├── LoginForm.tsx
│   │       └── EventForm.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Events.tsx
│   │   ├── EventDetails.tsx
│   │   ├── Login.tsx
│   │   └── Dashboard.tsx
│   ├── services/
│   │   ├── api.ts
│   │   └── auth.ts
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── hooks/
│   │   ├── useAuth.tsx
│   │   └── useApi.tsx
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── constants.ts
│   │   └── helpers.ts
│   ├── styles/
│   │   └── globals.css
│   ├── App.tsx
│   ├── App.css
│   └── index.tsx
├── package.json
└── tsconfig.json
```

## 3. Implementation Order

### Phase 1: Basic Setup
1. Setup React Router
2. Create basic layout components (Header, Footer)
3. Setup API service layer
4. Create authentication context

### Phase 2: Public Pages
1. Home page with hero section and featured events
2. Events listing page with filtering
3. Event details page
4. Basic navigation and routing

### Phase 3: Authentication
1. Login page and form
2. Protected routes
3. JWT token management
4. Auth state management

### Phase 4: Admin Features
1. Admin dashboard
2. Event management (CRUD)
3. Data management
4. File upload functionality

### Phase 5: Polish & Features
1. Responsive design
2. Loading states and error handling
3. Form validation
4. SEO optimization

## 4. Key React Concepts to Use

### React Router Setup
```tsx
// App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}
```

### State Management with Context
```tsx
// context/AuthContext.tsx
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
```

### Custom Hooks
```tsx
// hooks/useApi.tsx
export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch events logic
  
  return { events, loading, error, refetch };
};
```

## 5. API Integration

### Base API Service
```tsx
// services/api.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

## 6. Styling Options

### Option 1: Tailwind CSS (Recommended)
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Option 2: Styled Components
```bash
npm install styled-components
npm install @types/styled-components --save-dev
```

### Option 3: Material-UI
```bash
npm install @mui/material @emotion/react @emotion/styled
```

## 7. Development Workflow

1. Start the backend server first:
   ```bash
   cd Server
   npm run dev
   ```

2. Start the React development server:
   ```bash
   cd college-frontend
   npm start
   ```

3. Access the application at `http://localhost:3000`

## 8. Environment Variables

Create `.env` file in React project root:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_APP_NAME=College Website
```

## 9. Testing Strategy

- Use React Testing Library for component tests
- Test API integration with mock services
- Test authentication flow
- Test responsive design

## 10. Deployment Considerations

- Build for production: `npm run build`
- Configure environment variables for production
- Setup proper CORS on backend for production URL
- Consider hosting on Netlify, Vercel, or similar platforms

This guide provides a comprehensive roadmap for building your React-based college website while maintaining compatibility with your existing Express.js backend.
