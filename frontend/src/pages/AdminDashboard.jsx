import { useState } from 'react';
import Navbar from '../components/Navbar';
import UserManagement from '../components/UserManagement';
import CourseManagement from '../components/CourseManagement';
import ExamList from '../components/ExamList';
import { submissionAPI } from '../services/api';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('exams');
    const [stats, setStats] = useState(null);

    const loadStats = async () => {
        try {
            const res = await submissionAPI.getAnalytics();
            setStats(res.data);
        } catch (err) { console.error(err); }
    };

    return (
        <div className="app">
            <Navbar />
            <div className="main-content">
                <div className="tabs" style={{ marginBottom: '20px' }}>
                    <button className={`tab-btn ${activeTab === 'exams' ? 'active' : ''}`} onClick={() => setActiveTab('exams')}>Exams</button>
                    <button className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>Users</button>
                    <button className={`tab-btn ${activeTab === 'courses' ? 'active' : ''}`} onClick={() => setActiveTab('courses')}>Courses</button>
                    <button className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => { setActiveTab('analytics'); loadStats(); }}>Analytics</button>
                </div>

                {activeTab === 'exams' && <ExamList role="Admin" />}
                {activeTab === 'users' && <UserManagement />}
                {activeTab === 'courses' && <CourseManagement />}
                {activeTab === 'analytics' && (
                    <div className="glass-card">
                        <h2>Performance Analytics</h2>
                        {stats ? (
                            <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                                <div className="glass-card" style={{ textAlign: 'center' }}>
                                    <h3>{stats.totalAttempts}</h3>
                                    <p style={{ color: 'var(--text-muted)' }}>Total Attempts</p>
                                </div>
                                <div className="glass-card" style={{ textAlign: 'center' }}>
                                    <h3>{stats.avgScore?.toFixed(1)}%</h3>
                                    <p style={{ color: 'var(--text-muted)' }}>Average Score</p>
                                </div>
                                <div className="glass-card" style={{ textAlign: 'center' }}>
                                    <h3>{stats.passRate?.toFixed(1)}%</h3>
                                    <p style={{ color: 'var(--text-muted)' }}>Pass Rate</p>
                                </div>
                            </div>
                        ) : (
                            <p style={{ padding: '20px', textAlign: 'center' }}>Loading stats...</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
