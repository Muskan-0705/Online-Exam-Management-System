import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { examAPI, submissionAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';

const ExamResults = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [results, setResults] = useState([]);
    const [exam, setExam] = useState(null);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [examRes, resultsRes] = await Promise.all([
                examAPI.getById(id),
                examAPI.getResults(id)
            ]);
            setExam(examRes.data);
            setResults(resultsRes.data);
        } catch (err) { setToast({ type: 'error', message: 'Failed to load results' }); }
    };

    const handleExport = () => {
        window.open(submissionAPI.exportResults(id), '_blank');
    };

    return (
        <div className="app">
            <Navbar />
            <div className="main-content">
                {toast && <Toast {...toast} onClose={() => setToast(null)} />}

                <button className="btn" onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>&larr; Back</button>

                {exam && (
                    <div className="glass-card" style={{ marginBottom: '30px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h2>Results: {exam.title}</h2>
                                <p style={{ color: 'var(--text-muted)' }}>{new Date(exam.date).toDateString()}</p>
                            </div>
                            <button className="btn btn-primary" onClick={handleExport}>Export CSV</button>
                        </div>
                    </div>
                )}

                <div className="glass-card" style={{ padding: 0 }}>
                    <table>
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>Roll No</th>
                                <th>Score</th>
                                <th>Percentage</th>
                                <th>Status</th>
                                <th>Submitted At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map(res => {
                                const percentage = (res.score / res.totalMarks) * 100;
                                return (
                                    <tr key={res._id}>
                                        <td>{res.student?.name}</td>
                                        <td>{res.student?.rollNo}</td>
                                        <td>{res.score} / {res.totalMarks}</td>
                                        <td>{percentage.toFixed(1)}%</td>
                                        <td>
                                            <span className="badge" style={{
                                                backgroundColor: percentage >= 40 ? 'rgba(0,255,0,0.2)' : 'rgba(255,0,0,0.2)',
                                                color: 'white'
                                            }}>
                                                {percentage >= 40 ? 'Pass' : 'Fail'}
                                            </span>
                                        </td>
                                        <td>{new Date(res.submittedAt).toLocaleString()}</td>
                                    </tr>
                                );
                            })}
                            {results.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>No submissions yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ExamResults;
