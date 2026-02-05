# Development Guide

## Project Overview

This is a full-stack online examination management system built with:
- **Backend**: Node.js + Express + MongoDB
- **Frontend**: React + Vite

## Development Setup

### Prerequisites
- Node.js v16+ (check with `node --version`)
- MongoDB running locally or cloud connection
- Git (optional)

### Initial Setup

1. **Install Dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

2. **Configure Environment Variables**
   
   Create `backend/.env`:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/online-exam-system
   JWT_SECRET=your-secret-key-here
   NODE_ENV=development
   ```
   
   Create `frontend/.env`:
   ```
   VITE_API_URL=http://localhost:5000
   ```

3. **Initialize Database**
   ```bash
   cd backend
   npm run setup-db  # Creates test users
   ```

## Running Development Servers

### Backend Server
```bash
cd backend
npm start          # Regular start
# OR
npm run dev        # With nodemon auto-reload (requires installation)
```
- Server runs on `http://localhost:5000`
- API routes available at `/auth`, `/exams`, `/questions`, `/submit`, `/users`, `/academic`

### Frontend Development Server
```bash
cd frontend
npm run dev
```
- Application available at `http://localhost:5173`
- Hot module replacement enabled

## Project Structure Details

### Backend (`/backend`)

**Models** (`/models`)
- `User.js` - User schema with authentication
- `Exam.js` - Exam configurations
- `Question.js` - Question templates
- `Submission.js` - Student exam submissions
- `Course.js` - Course definitions
- `Subject.js` - Subject definitions

**Routes** (`/routes`)
- `auth.js` - Authentication endpoints (login, signup, profile)
- `exams.js` - Exam management
- `questions.js` - Question bank management
- `submissions.js` - Exam submissions and grading
- `users.js` - User management (admin)
- `academic.js` - Courses and subjects

**Middleware** (`/middleware`)
- `auth.js` - JWT verification middleware
- `role.js` - Role-based access control

**Scripts** (`/scripts`)
- `setupTestUsers.js` - Create all test users at once
- `createAdmin.js` - Create admin user
- `createStudent.js` - Create student user
- `createTeacher.js` - Create teacher user

### Frontend (`/frontend`)

**Pages** (`/src/pages`)
- `Login.jsx` - Authentication page
- `AdminDashboard.jsx` - Admin controls
- `TeacherDashboard.jsx` - Teacher interface
- `StudentDashboard.jsx` - Student main page
- `ExamPlayer.jsx` - Exam taking interface
- `ExamResults.jsx` - Results display
- `MyResults.jsx` - Student result history
- `Profile.jsx` - User profile management

**Components** (`/src/components`)
- `Navbar.jsx` - Navigation component
- `ExamList.jsx` - List exams
- `CreateExam.jsx` - Create new exam
- `QuestionBank.jsx` - Manage questions
- `UserManagement.jsx` - Admin user management
- `CourseManagement.jsx` - Course management
- `Evaluation.jsx` - Grading interface
- `ProctorChecks.jsx` - Proctoring features
- `Toast.jsx` - Notification component

**Services** (`/src/services`)
- `api.js` - Axios instance with API helper functions

**Context** (`/src/context`)
- `AuthContext.jsx` - Global authentication state

## Common Development Tasks

### Adding a New API Endpoint

1. **Create Route** (`backend/routes/your-route.js`)
   ```javascript
   const express = require('express');
   const router = express.Router();
   const authMiddleware = require('../middleware/auth');
   
   router.get('/', authMiddleware, (req, res) => {
     res.json({ message: 'Your response' });
   });
   
   module.exports = router;
   ```

2. **Register Route** (`backend/server.js`)
   ```javascript
   app.use('/your-path', require('./routes/your-route'));
   ```

3. **Add API Service** (`frontend/src/services/api.js`)
   ```javascript
   export const yourAPI = {
     getAll: () => api.get('/your-path'),
     create: (data) => api.post('/your-path', data),
   };
   ```

4. **Use in Component**
   ```javascript
   import { yourAPI } from '../services/api';
   
   const data = await yourAPI.getAll();
   ```

### Adding a New Component

1. Create component file in `/src/components`
2. Import in the page or parent component
3. Style using CSS modules or inline styles

### Database Queries

Models use Mongoose. Example:
```javascript
const User = require('../models/User');

// Find user
const user = await User.findOne({ email: 'user@example.com' });

// Create user
const newUser = await User.create({ name, email, password });

// Update user
await User.findByIdAndUpdate(id, updates, { new: true });

// Delete user
await User.deleteOne({ _id: id });
```

## Testing

### Manual Testing
- Use browser DevTools Network tab to inspect API calls
- Check MongoDB with MongoDB Compass or CLI
- Test different user roles to verify permissions

### Test Users
```
Admin:   admin@exam.com / admin123
Student: student@exam.com / student123
Teacher: teacher@exam.com / teacher123
```

## Debugging

### Backend Debugging
1. Check console logs in terminal
2. Review `.env` configuration
3. Verify MongoDB connection
4. Check JWT token in requests

### Frontend Debugging
1. Open browser DevTools (F12)
2. Check Console for errors
3. Use Network tab to inspect API requests
4. Check localStorage for tokens

### Common Issues

**"Cannot find module" errors**
- Wrong import path (check relative paths)
- Missing `require()` statement
- Module not installed

**MongoDB connection failed**
- MongoDB not running
- Wrong `MONGODB_URI` in `.env`
- Firewall blocking connection

**API 401 Unauthorized**
- Missing or invalid JWT token
- Token expired
- Wrong authentication header format

**CORS errors**
- Frontend URL not in backend CORS config
- Check `cors()` middleware in server.js

## Performance Tips

1. Use `nodemon` for backend auto-reload during development
2. Enable React Fast Refresh in Vite
3. Monitor bundle size: `npm run build` then check `dist/` folder
4. Use browser DevTools Performance tab
5. Implement pagination for large data sets

## Code Style

- Use consistent indentation (2 spaces)
- Name components PascalCase (MyComponent.jsx)
- Name functions/variables camelCase
- Use arrow functions where appropriate
- Add comments for complex logic

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/feature-name

# Make changes and commit
git add .
git commit -m "Add feature description"

# Push to repository
git push origin feature/feature-name
```

## Building for Production

```bash
# Build frontend
cd frontend
npm run build

# Preview production build
npm run preview

# Backend runs as-is, just change NODE_ENV=production
```

## Useful Commands

```bash
# Backend
npm start              # Start server
npm run dev           # Start with hot-reload
npm run setup-db      # Setup test users
npm run create-admin  # Add admin user

# Frontend
npm run dev           # Start dev server
npm run build         # Build for production
npm run preview       # Preview build
npm run lint          # Check code quality
```

## Resources

- [Express.js Docs](https://expressjs.com)
- [MongoDB Docs](https://docs.mongodb.com)
- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [Mongoose Docs](https://mongoosejs.com)

## Getting Help

1. Check console logs for error messages
2. Review related files and imports
3. Verify environment configuration
4. Test endpoints with Postman or curl
5. Check MongoDB data directly

---

Happy coding! 🚀
