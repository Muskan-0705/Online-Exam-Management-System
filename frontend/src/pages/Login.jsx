import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import Toast from '../components/Toast';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        rollNo: '',
        course: '',
        semester: ''
    });
    const [toast, setToast] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let res;
            if (isLogin) {
                res = await authAPI.login(formData.email, formData.password);
            } else {
                res = await authAPI.signup({
                    ...formData,
                    role: 'Student'
                });
            }

            login(res.data.user, res.data.token);
            setToast({ type: 'success', message: 'Success!' });

            // Redirect based on role
            const role = res.data.user.role;
            if (role === 'Admin') navigate('/admin');
            else if (role === 'Teacher') navigate('/teacher');
            else navigate('/student');

        } catch (err) {
            setToast({ type: 'error', message: err.response?.data?.message || 'Error occurred' });
        }
    };

    return (
        <div className="auth-container">
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <div className="glass-card auth-card">
                <div className="auth-header">
                    <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>
                        {isLogin ? 'Welcome back! Please enter your details.' : 'Join us and start your journey.'}
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="input-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                required={!isLogin}
                            />
                        </div>
                    )}

                    <div className="input-group">
                        <label>Email / Roll No</label>
                        <input
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="name@example.com"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {!isLogin && (
                        <>
                            <div className="input-group">
                                <label>Roll No</label>
                                <input
                                    type="text"
                                    name="rollNo"
                                    value={formData.rollNo}
                                    onChange={handleChange}
                                    placeholder="Roll Number"
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div className="input-group" style={{ flex: 1 }}>
                                    <label>Course</label>
                                    <input
                                        type="text"
                                        name="course"
                                        value={formData.course}
                                        onChange={handleChange}
                                        placeholder="B.Tech"
                                    />
                                </div>
                                <div className="input-group" style={{ flex: 1 }}>
                                    <label>Semester</label>
                                    <input
                                        type="text"
                                        name="semester"
                                        value={formData.semester}
                                        onChange={handleChange}
                                        placeholder="5th"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        {isLogin ? 'Login' : 'Sign Up'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '20px' }}>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <span
                        onClick={() => setIsLogin(!isLogin)}
                        style={{ color: 'var(--primary)', cursor: 'pointer' }}
                    >
                        {isLogin ? 'Sign Up' : 'Login'}
                    </span>
                </p>

                <p style={{ textAlign: 'center', marginTop: '10px' }}>
                    <a href="/teacher-signup" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem' }}>
                        Are you a Teacher? Sign up here
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;
