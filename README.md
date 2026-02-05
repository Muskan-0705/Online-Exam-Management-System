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

