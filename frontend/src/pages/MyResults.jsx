import { useState, useEffect } from 'react';
import { submissionAPI } from '../services/api';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const MyResults = () => {
    const [results, setResults] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            const res = await submissionAPI.getMyResults();
            setResults(res.data);
        } catch (err) { console.error(err); }
    };

    return (
        <div className="app">
            <Navbar />
            <div className="main-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2>My Results</h2>
                    <button className="btn" onClick={() => navigate('/student')}>Back to Dashboard</button>
                </div>

                <div className="exam-grid">
                    {results.map(sub => {
                        // Handle case where exam might be deleted
                        if (!sub.exam) return null;

                        const marks = sub.marks || 0;
                        const total = sub.exam.totalMarks || 0;
                        const percentage = total > 0 ? (marks / total) * 100 : 0;

                        return (
                            <div key={sub._id} className="glass-card">
                                <h3>{sub.exam.title}</h3>
                                <div style={{ margin: '15px 0' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                        <span>Score:</span>
                                        <strong>{marks} / {total}</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Percentage:</span>
                                        <strong style={{ color: percentage >= 40 ? 'var(--success)' : 'var(--error)' }}>
                                            {percentage.toFixed(1)}%
                                        </strong>
                                    </div>
                                </div>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                    Submitted: {new Date(sub.submittedAt).toLocaleDateString()}
                                </p>
                            </div>
                        );
                    })}
                    {results.length === 0 && <p>No results found.</p>}
                </div>
            </div>
        </div>
    );
};

export default MyResults;
