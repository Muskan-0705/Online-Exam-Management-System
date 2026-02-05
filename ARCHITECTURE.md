# System Architecture

## Overview

This document describes the architecture, design patterns, and technical decisions for the Online Examination Management System.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  React Application (Vite)                            │   │
│  │  - Pages, Components, Services                       │   │
│  │  - State Management (Context API)                    │   │
│  │  - Routing (React Router v7)                         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           │
                    HTTP/REST API
                           │
┌─────────────────────────────────────────────────────────────┐
│                   API LAYER (Backend)                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Express.js Server                                   │   │
│  │  - Routes (Auth, Exams, Questions, etc)             │   │
│  │  - Middleware (JWT, CORS, Role-based)               │   │
│  │  - Controllers/Route Handlers                        │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           │
                    CRUD Operations
                           │
┌─────────────────────────────────────────────────────────────┐
│                   DATA LAYER                                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Mongoose ODM                                        │   │
│  │  - Models: User, Exam, Question, Submission, etc   │   │
│  └──────────────────────────────────────────────────────┘   │
│                           │                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  MongoDB Atlas (Cloud Database)                      │   │
│  │  - Collections: users, exams, questions, etc        │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Design Patterns

### 1. MVC Architecture (Modified)

The backend follows a modified MVC pattern:

```
Routes → Middleware → Logic → Models → Database
```

**Example Flow:**
```
POST /auth/login
    ↓
auth.js route
    ↓
authMiddleware (optional)
    ↓
Login logic (bcrypt compare)
    ↓
User model.findOne()
    ↓
MongoDB returns user
    ↓
Generate JWT token
    ↓
Return response with token
```

### 2. Middleware Pattern

Used for cross-cutting concerns:

```javascript
// Authentication middleware
app.use('/protected-route', authMiddleware);

// Role-based middleware
app.use('/admin-route', authMiddleware, roleMiddleware('Admin'));
```

### 3. Service Layer Pattern

API calls abstracted in frontend services:

```javascript
// api.js - Centralized API calls
export const authAPI = {
  login: (identifier, password) => 
    api.post('/auth/login', { identifier, password }),
  signup: (data) => 
    api.post('/auth/signup', data)
};

// Usage in components
const response = await authAPI.login(email, password);
```

### 4. Context API for State Management

Global authentication state:

```javascript
// AuthContext.jsx
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

## Data Flow

### Authentication Flow

```
1. User enters credentials
    ↓
2. Frontend validates input
    ↓
3. POST /auth/login with credentials
    ↓
4. Backend finds user by email/rollNo
    ↓
5. Compares password with bcrypt
    ↓
6. Generates JWT token
    ↓
7. Returns token + user data
    ↓
8. Frontend stores token in localStorage
    ↓
9. Token added to all subsequent requests
```

### Exam Taking Flow

```
1. Student views available exams
    ↓
2. Clicks "Start Exam"
    ↓
3. Frontend loads exam questions
    ↓
4. Student answers questions
    ↓
5. Student clicks "Submit"
    ↓
6. POST /submit/:examId with answers
    ↓
7. Backend validates submission
    ↓
8. Creates Submission document
    ↓
9. If auto-grading: Evaluates answers
    ↓
10. Returns result to student
    ↓
11. Updates dashboard
```

---

## Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  rollNo: String (unique, sparse),
  password: String (hashed),
  role: String (Admin|Student|Teacher),
  course: String,
  semester: String,
  isActive: Boolean,
  lastLoginIP: String,
  lastLoginTime: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Exam Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  duration: Number (minutes),
  totalMarks: Number,
  passingMarks: Number,
  createdBy: ObjectId (Teacher),
  questions: [ObjectId],
  startTime: Date,
  endTime: Date,
  isPublished: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Question Collection
```javascript
{
  _id: ObjectId,
  exam: ObjectId,
  title: String,
  description: String,
  type: String (MCQ|ShortAnswer|Essay),
  options: [String] (for MCQ),
  correctAnswer: String|Number,
  marks: Number,
  createdBy: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

### Submission Collection
```javascript
{
  _id: ObjectId,
  exam: ObjectId,
  student: ObjectId,
  answers: [
    {
      question: ObjectId,
      studentAnswer: String,
      isCorrect: Boolean,
      marksObtained: Number
    }
  ],
  totalMarksObtained: Number,
  status: String (Pending|Graded),
  submittedAt: Date,
  gradedBy: ObjectId (Teacher),
  gradedAt: Date,
  feedback: String
}
```

---

## Security Architecture

### Authentication & Authorization

```
1. JWT Tokens
   - Generated on login
   - Contains: user ID, role, expiry
   - Stored in localStorage (frontend)
   - Sent with every request in Authorization header

2. Password Security
   - Hashed with bcryptjs (10 rounds)
   - Never stored in plain text
   - Compared during login

3. Role-Based Access Control (RBAC)
   - Middleware checks user role
   - Admin: Full system access
   - Teacher: Exam & question management
   - Student: Take exams, view results

4. CORS Protection
   - Configured for specific origins
   - Prevents unauthorized cross-origin requests
```

### Data Protection

```
- Passwords: bcryptjs hashing
- Sensitive data: JWT tokens
- Database: MongoDB Atlas with IP whitelist
- API: HTTPS recommended for production
- Environment variables: Never in version control
```

---

## API Architecture

### RESTful Design

```
Resource-oriented endpoints:

GET    /exams              - List all exams
GET    /exams/:id          - Get specific exam
POST   /exams              - Create exam
PUT    /exams/:id          - Update exam
DELETE /exams/:id          - Delete exam

GET    /users              - List users (Admin)
POST   /users/create       - Create user (Admin)
DELETE /users/:id          - Delete user (Admin)
```

### Request/Response Format

```javascript
// Request
{
  "method": "POST",
  "path": "/auth/login",
  "headers": {
    "Content-Type": "application/json",
    "Authorization": "Bearer <token>"
  },
  "body": {
    "identifier": "user@exam.com",
    "password": "password123"
  }
}

// Response (Success)
{
  "token": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@exam.com",
    "role": "Student"
  }
}

// Response (Error)
{
  "message": "Invalid credentials",
  "error": "error_details"
}
```

---

## Frontend Architecture

### Component Hierarchy

```
App
├── Navbar
├── Routes
│   ├── Login (public)
│   ├── AdminDashboard (protected)
│   │   ├── UserManagement
│   │   ├── CourseManagement
│   │   └── ExamList
│   ├── TeacherDashboard (protected)
│   │   ├── CreateExam
│   │   ├── QuestionBank
│   │   └── Evaluation
│   ├── StudentDashboard (protected)
│   │   ├── ExamList
│   │   ├── MyResults
│   │   └── Profile
│   └── ExamPlayer (protected)
└── Toast (global notifications)
```

### State Management

```javascript
// AuthContext provides
- user: Current authenticated user
- token: JWT token
- login(user, token): Set authentication
- logout(): Clear authentication
- isAuthenticated: Boolean

// Component local state
- useState for form inputs
- useState for loading/error states
```

### API Communication

```javascript
// axios instance with interceptors
api.interceptors.request.use((config) => {
  // Add token to headers
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use((response) => {
  // Handle success
  return response;
}, (error) => {
  // Handle errors, refresh token if needed
  return Promise.reject(error);
});
```

---

## Performance Optimization

### Frontend
- Code splitting with Vite
- Lazy loading components
- Caching API responses
- Debouncing search inputs
- Optimized re-renders with useMemo

### Backend
- Database indexing on frequently queried fields
- Pagination for large datasets
- Caching with Redis (future)
- Query optimization with lean()

### Database
- Indexes on: email, rollNo, user ID
- TTL indexes for session data
- Connection pooling

---

## Error Handling

### Backend Error Handling

```javascript
// Route handler with try-catch
try {
  // Business logic
} catch (error) {
  console.error('Error:', error);
  res.status(500).json({
    message: 'Server error',
    error: error.message
  });
}
```

### Frontend Error Handling

```javascript
try {
  const response = await authAPI.login(email, password);
  setUser(response.data.user);
} catch (error) {
  const message = error.response?.data?.message || 'Error occurred';
  setToast({ type: 'error', message });
}
```

---

## Deployment Architecture

### Development
```
Localhost:5000 (Backend)
Localhost:5173 (Frontend)
Local MongoDB or MongoDB Atlas
```

### Production
```
Cloud Service (Backend API)
Static Hosting (Frontend)
MongoDB Atlas (Database)
```

---

## Future Enhancements

1. **Microservices**
   - Separate services for exams, submissions, users
   - API Gateway for routing

2. **Caching Layer**
   - Redis for session management
   - Cache frequently accessed exam data

3. **Message Queue**
   - Background job processing
   - Email notifications

4. **Real-time Features**
   - WebSocket for live exam updates
   - Real-time notification system

5. **Scalability**
   - Database sharding
   - Load balancing
   - CDN for static assets

---

## Technology Decisions

| Decision | Reason |
|----------|--------|
| Express.js | Lightweight, easy to learn, large ecosystem |
| React | Component-based, fast rendering, large community |
| MongoDB | Document-based, flexible schema, free Atlas |
| JWT | Stateless authentication, suitable for APIs |
| bcryptjs | Secure password hashing, well-tested |
| Vite | Fast build tool, better dev experience than Webpack |

---

This architecture is designed to be scalable, maintainable, and easy to extend with new features.
