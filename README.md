# Online Examination Management System

A comprehensive web application for managing online examinations with features for students, teachers, and administrators.

## Project Structure

```
.
├── backend/                 # Express.js REST API server
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API endpoints
│   ├── middleware/         # Express middleware (auth, role-based access)
│   ├── scripts/            # Utility scripts for database setup
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
│   └── .env                # Environment variables
│
├── frontend/               # React + Vite application
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service calls
│   │   ├── context/        # React context for state management
│   │   └── main.jsx        # Entry point
│   ├── package.json        # Frontend dependencies
│   └── vite.config.js      # Vite configuration
│
└── .env.example            # Example environment file
```

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

### 1. Clone Repository and Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Setup Environment Variables

```bash
# Copy .env.example to .env in root, backend, and frontend
cp .env.example .env
cd backend
cp ../.env.example .env
cd ../frontend
cp ../.env.example .env
```

Update the `.env` files with your actual configuration:

**backend/.env:**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/online-exam-system
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

**frontend/.env:**
```
VITE_API_URL=http://localhost:5000
```

### 3. Setup Database

Ensure MongoDB is running, then initialize test users:

```bash
cd backend
node scripts/setupTestUsers.js
```

## Running the Application

### Development Mode

**Terminal 1 - Start Backend Server:**
```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

**Terminal 2 - Start Frontend Development Server:**
```bash
cd frontend
npm run dev
# Application available at http://localhost:5173
```

### Production Build

```bash
# Build frontend
cd frontend
npm run build

# Run backend in production
cd ../backend
NODE_ENV=production npm start
```

## Test Credentials

After running `setupTestUsers.js`, use these credentials:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@exam.com | admin123 |
| Student | student@exam.com | student123 |
| Teacher | teacher@exam.com | teacher123 |

## Available Scripts

### Backend

- `npm start` - Start the server
- `node scripts/createAdmin.js` - Create admin user
- `node scripts/createStudent.js` - Create student user
- `node scripts/createTeacher.js` - Create teacher user
- `node scripts/setupTestUsers.js` - Setup all test users

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## API Endpoints

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login user
- `PUT /auth/profile` - Update profile
- `PUT /auth/change-password` - Change password

### Exams
- `GET /exams` - Get all exams
- `GET /exams/:id` - Get exam details
- `POST /exams` - Create exam (teacher/admin)
- `PUT /exams/:id` - Update exam (teacher/admin)
- `DELETE /exams/:id` - Delete exam (admin)

### Questions
- `GET /questions` - Get questions
- `POST /questions` - Create question (teacher/admin)
- `PUT /questions/:id` - Update question (teacher/admin)
- `DELETE /questions/:id` - Delete question (admin)

### Submissions
- `POST /submit/:examId` - Submit exam answers
- `GET /submit/my-results` - Get student results
- `GET /submit/pending` - Get pending evaluations (teacher)
- `PUT /submit/grade/:id` - Grade submission (teacher)

### Users
- `GET /users` - Get all users (admin)
- `POST /users/create` - Create user (admin)
- `DELETE /users/:id` - Delete user (admin)

### Academic
- `GET /academic/courses` - Get courses
- `POST /academic/courses` - Create course
- `GET /academic/subjects` - Get subjects
- `POST /academic/subjects` - Create subject

## Features

- ✅ User Authentication (Email/Roll No)
- ✅ Role-Based Access Control (Admin, Teacher, Student)
- ✅ Exam Management (Create, Schedule, Delete)
- ✅ Question Bank Management
- ✅ Online Exam Taking with Proctoring
- ✅ Exam Submission and Evaluation
- ✅ Result Analytics
- ✅ User Management
- ✅ Course and Subject Management

## Technology Stack

**Backend:**
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs for password hashing
- CORS enabled

**Frontend:**
- React 19
- Vite (build tool)
- React Router v7
- Axios for API calls
- CSS3 with Glass Morphism UI

## Middleware

- **auth.js** - JWT verification middleware
- **role.js** - Role-based access control middleware

## Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Role-based access control
- Account activation/deactivation
- Last login tracking
- Account lockout support

## Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env` file

**Frontend API Errors:**
- Verify backend server is running on port 5000
- Check `VITE_API_URL` in frontend/.env

**Import Path Errors:**
- Use relative paths: `require('../models/User')`
- Not: `require('./models/User')`

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit pull request

## License

ISC

## Support

For issues or questions, please check the logs and ensure all prerequisites are installed correctly.
