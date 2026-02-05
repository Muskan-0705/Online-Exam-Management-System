import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="logo">📚 ExamPortal</div>

            <div className="nav-links">
                <span style={{ color: 'var(--text-muted)' }}>
                    Hello, {user?.name} ({user?.role})
                </span>
                <button className="btn" onClick={() => navigate('/profile')}>
                    Profile
                </button>
                <button className="btn btn-error" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
