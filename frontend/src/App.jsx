import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import ExamPlayer from './pages/ExamPlayer';
import ExamResults from './pages/ExamResults';
import MyResults from './pages/MyResults';
import Profile from './pages/Profile';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route path="/admin" element={
            <PrivateRoute allowedRoles={['Admin']}>
              <AdminDashboard />
            </PrivateRoute>
          } />

          <Route path="/teacher" element={
            <PrivateRoute allowedRoles={['Teacher']}>
              <TeacherDashboard />
            </PrivateRoute>
          } />

          <Route path="/student" element={
            <PrivateRoute allowedRoles={['Student']}>
              <StudentDashboard />
            </PrivateRoute>
          } />

          <Route path="/take-exam/:id" element={
            <PrivateRoute allowedRoles={['Student']}>
              <ExamPlayer />
            </PrivateRoute>
          } />

          <Route path="/results/:id" element={
            <PrivateRoute allowedRoles={['Admin', 'Teacher']}>
              <ExamResults />
            </PrivateRoute>
          } />

          <Route path="/my-results" element={
            <PrivateRoute allowedRoles={['Student']}>
              <MyResults />
            </PrivateRoute>
          } />

          <Route path="/profile" element={
            <PrivateRoute allowedRoles={['Admin', 'Teacher', 'Student']}>
              <Profile />
            </PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
