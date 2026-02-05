# 📚 Online Examination Management System

<div align="center">

![GitHub stars](https://img.shields.io/github/stars/Yashwantkashyap2005/Online-Exam-Management-System-?style=social)
![GitHub forks](https://img.shields.io/github/forks/Yashwantkashyap2005/Online-Exam-Management-System-?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/Yashwantkashyap2005/Online-Exam-Management-System-?style=social)
![License](https://img.shields.io/github/license/Yashwantkashyap2005/Online-Exam-Management-System-)

![Node.js](https://img.shields.io/badge/Node.js-v16+-green)
![React](https://img.shields.io/badge/React-19.2-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-9.0-green)
![Express](https://img.shields.io/badge/Express-5.2-black)
![Status](https://img.shields.io/badge/Status-Active-brightgreen)

**A comprehensive, full-stack online examination management system with real-time proctoring and evaluation capabilities.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 🎯 Overview

**Online Examination Management System** is a modern, scalable web application designed for educational institutions to conduct online examinations efficiently. It provides a complete ecosystem for managing exams, questions, student submissions, and automated evaluation with role-based access control.

### Perfect for:
- Educational Institutions
- Online Learning Platforms
- Competitive Exam Preparation
- Corporate Training Programs
- Certification Courses

---

## ✨ Features

### 🔐 Authentication & Security
- ✅ JWT-based Authentication
- ✅ Role-Based Access Control (Admin, Teacher, Student)
- ✅ Password Hashing with bcryptjs
- ✅ Email/Roll Number Login Support
- ✅ Account Activation/Deactivation
- ✅ Last Login Tracking

### 📝 Exam Management
- ✅ Create, Edit, Delete Exams
- ✅ Schedule Exams with Time Limits
- ✅ Multiple Question Types Support
- ✅ Question Bank Management
- ✅ Exam Analytics & Reports
- ✅ Real-time Exam Progress

### 👥 User Management
- ✅ Multi-role User System (Admin, Teacher, Student)
- ✅ Bulk User Import/Management
- ✅ User Profile Management
- ✅ Password Change/Reset
- ✅ User Activity Tracking

### 📊 Evaluation System
- ✅ Automated Answer Grading
- ✅ Manual Evaluation for Descriptive Questions
- ✅ Instant Result Generation
- ✅ Performance Analytics
- ✅ Detailed Result Reports

### 🎓 Academic Management
- ✅ Course Management
- ✅ Subject Management
- ✅ Department Organization
- ✅ Semester Management

### 🚀 Advanced Features
- ✅ Real-time Dashboard
- ✅ Responsive Design
- ✅ Toast Notifications
- ✅ Export Results
- ✅ Proctoring Checks
- ✅ Webcam Integration

---

## 🛠️ Tech Stack

### Backend
```
✓ Node.js v16+      - JavaScript Runtime
✓ Express.js 5.2    - Web Framework
✓ MongoDB 9.0       - NoSQL Database (Atlas)
✓ Mongoose         - ODM for MongoDB
✓ JWT              - Authentication
✓ bcryptjs         - Password Hashing
✓ CORS             - Cross-Origin Support
```

### Frontend
```
✓ React 19.2       - UI Library
✓ Vite 7.2         - Build Tool
✓ React Router 7   - Routing
✓ Axios            - HTTP Client
✓ CSS3             - Styling (Glass Morphism)
✓ React Webcam    - Camera Integration
```

### Database
```
✓ MongoDB Atlas    - Cloud NoSQL Database
✓ Mongoose ODM     - Data Modeling
```

---

## 📋 Project Structure

```
Online-Exam-Management-System/
│
├── backend/
│   ├── models/                 # Database Schemas
│   │   ├── User.js            # User model with authentication
│   │   ├── Exam.js            # Exam configuration
│   │   ├── Question.js        # Question templates
│   │   ├── Submission.js      # Student submissions
│   │   ├── Course.js          # Course definitions
│   │   └── Subject.js         # Subject definitions
│   │
│   ├── routes/                 # API Endpoints
│   │   ├── auth.js            # Auth endpoints
│   │   ├── exams.js           # Exam CRUD operations
│   │   ├── questions.js       # Question management
│   │   ├── submissions.js     # Submission handling
│   │   ├── users.js           # User management
│   │   └── academic.js        # Academic data
│   │
│   ├── middleware/             # Express Middleware
│   │   ├── auth.js            # JWT verification
│   │   └── role.js            # Role-based access
│   │
│   ├── scripts/               # Utility Scripts
│   │   ├── setupTestUsers.js  # Create test data
│   │   ├── createAdmin.js
│   │   ├── createStudent.js
│   │   └── createTeacher.js
│   │
│   ├── server.js              # Main server entry
│   ├── .env                   # Environment variables
│   └── package.json           # Dependencies
│
├── frontend/
│   ├── src/
│   │   ├── pages/             # Page Components
│   │   │   ├── Login.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── TeacherDashboard.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── ExamPlayer.jsx
│   │   │   ├── ExamResults.jsx
│   │   │   ├── MyResults.jsx
│   │   │   └── Profile.jsx
│   │   │
│   │   ├── components/        # Reusable Components
│   │   │   ├── Navbar.jsx
│   │   │   ├── ExamList.jsx
│   │   │   ├── CreateExam.jsx
│   │   │   ├── QuestionBank.jsx
│   │   │   ├── Evaluation.jsx
│   │   │   ├── UserManagement.jsx
│   │   │   ├── CourseManagement.jsx
│   │   │   ├── ProctorChecks.jsx
│   │   │   └── Toast.jsx
│   │   │
│   │   ├── services/          # API Services
│   │   │   └── api.js        # Axios instance & methods
│   │   │
│   │   ├── context/           # State Management
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── App.jsx            # Root component
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Global styles
│   │
│   ├── vite.config.js         # Vite configuration
│   ├── .env                   # Frontend config
│   └── package.json
│
├── docs/
│   ├── README.md              # This file
│   ├── DEVELOPMENT.md         # Developer guide
│   ├── TESTING_GUIDE.md       # Testing procedures
│   ├── QUICK_START.md         # Quick start guide
│   ├── ARCHITECTURE.md        # System architecture
│   ├── MONGODB_ATLAS_SETUP.md # Database setup
│   └── API.md                 # API documentation
│
├── .github/                   # GitHub specific files
├── .gitignore                 # Git ignore rules
├── LICENSE                    # ISC License
└── package.json              # Root package.json
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v16+ ([Download](https://nodejs.org/))
- MongoDB Atlas Account ([Free](https://www.mongodb.com/cloud/atlas))
- npm or yarn

### 1️⃣ Clone Repository
```bash
git clone https://github.com/Yashwantkashyap2005/Online-Exam-Management-System-.git
cd Online-Exam-Management-System
```

### 2️⃣ Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend (new terminal)
cd frontend
npm install
```

### 3️⃣ Configure Environment

**Backend** (`backend/.env`):
```env
PORT=5000
MONGODB_URI=mongodb+srv://examadmin:examadmin123@cluster0.zztxw1x.mongodb.net/online-exam-system?retryWrites=true&w=majority
JWT_SECRET=supersecretkey123
NODE_ENV=development
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000
```

### 4️⃣ Setup Database
```bash
cd backend
npm run setup-db
```

### 5️⃣ Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Access Application:** http://localhost:5173

---

## 👤 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@exam.com | admin123 |
| **Student** | student@exam.com | student123 |
| **Teacher** | teacher@exam.com | teacher123 |

---

## 📚 Documentation

- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Complete development guide
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Comprehensive testing procedures
- **[QUICK_START.md](./QUICK_START.md)** - Quick reference guide
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture & design
- **[MONGODB_ATLAS_SETUP.md](./MONGODB_ATLAS_SETUP.md)** - Database configuration
- **[API.md](./API.md)** - Complete API documentation

---

## 🔌 API Endpoints

### Authentication
```http
POST   /auth/login              # Login user
POST   /auth/signup             # Register new user
PUT    /auth/profile            # Update profile
PUT    /auth/change-password    # Change password
```

### Exams
```http
GET    /exams                   # Get all exams
GET    /exams/:id               # Get exam details
POST   /exams                   # Create exam (Teacher/Admin)
PUT    /exams/:id               # Update exam
DELETE /exams/:id               # Delete exam (Admin)
```

### Questions
```http
GET    /questions               # Get questions
POST   /questions               # Create question
PUT    /questions/:id           # Update question
DELETE /questions/:id           # Delete question
```

### Submissions
```http
POST   /submit/:examId          # Submit answers
GET    /submit/my-results       # Get student results
GET    /submit/pending          # Get pending evaluations
PUT    /submit/grade/:id        # Grade submission
```

### Users (Admin)
```http
GET    /users                   # Get all users
POST   /users/create            # Create user
DELETE /users/:id               # Delete user
PUT    /users/:id/toggle-status # Toggle user status
```

---

## 🧪 Testing

### Run Tests
```bash
# Backend API tests
npm run test

# Frontend tests (if configured)
cd frontend && npm run test

# E2E tests (if configured)
npm run test:e2e
```

See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for comprehensive testing procedures.

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details on:
- Code style guidelines
- Pull request process
- Issue reporting
- Development workflow

### Quick Contribution Steps
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License - see [LICENSE](./LICENSE) file for details.

---

## 👨‍💻 Author

**Yashwant Kashyap**
- GitHub: [@Yashwantkashyap2005](https://github.com/Yashwantkashyap2005)
- Project: [Online-Exam-Management-System](https://github.com/Yashwantkashyap2005/Online-Exam-Management-System-)

---

## 🙏 Acknowledgments

- [Express.js Documentation](https://expressjs.com)
- [React Documentation](https://react.dev)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Vite Documentation](https://vitejs.dev)
- Community feedback and contributions

---

## 📞 Support & Contact

- **Issues:** [GitHub Issues](https://github.com/Yashwantkashyap2005/Online-Exam-Management-System-/issues)
- **Discussions:** [GitHub Discussions](https://github.com/Yashwantkashyap2005/Online-Exam-Management-System-/discussions)
- **Email:** your.email@example.com

---

## 🗺️ Roadmap

- [ ] Mobile App (React Native)
- [ ] Advanced Analytics Dashboard
- [ ] AI-powered Question Generation
- [ ] Plagiarism Detection
- [ ] Video Recording & Playback
- [ ] Advanced Proctoring Features
- [ ] Payment Integration
- [ ] Multi-language Support
- [ ] API Rate Limiting
- [ ] WebSocket Real-time Updates

---

<div align="center">

### If you found this project helpful, please consider giving it a ⭐

**[⬆ back to top](#-online-examination-management-system)**

</div>

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
