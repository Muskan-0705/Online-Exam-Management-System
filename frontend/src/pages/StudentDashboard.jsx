import { useState, useEffect } from 'react';
import { examAPI, submissionAPI } from '../services/api'; // Import submissionAPI
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
    const [exams, setExams] = useState([]);
    const [submittedExamIds, setSubmittedExamIds] = useState(new Set());
    const [activeTab, setActiveTab] = useState('available');
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [examsRes, submissionsRes] = await Promise.all([
                examAPI.getAll(),
                submissionAPI.getMyResults()
            ]);

            setExams(examsRes.data);

            // Create a Set of exam IDs that the student has already submitted
            const ids = new Set(submissionsRes.data.map(sub => sub.exam._id || sub.exam));
            setSubmittedExamIds(ids);

        } catch (err) { console.error(err); }
    };

    const availableExams = exams.filter(e => e.isPublished);

    return (
        <div className="app">
            <Navbar />
            <div className="main-content">
                <div className="tabs" style={{ marginBottom: '20px' }}>
                    <button className={`tab-btn ${activeTab === 'available' ? 'active' : ''}`} onClick={() => setActiveTab('available')}>Available Exams</button>
                    <button className={`tab-btn ${activeTab === 'results' ? 'active' : ''}`} onClick={() => { setActiveTab('results'); navigate('/my-results'); }}>My Results</button>
                </div>

                {activeTab === 'available' && (
                    <div className="exam-grid">
                        {availableExams.map(exam => {
                            const isSubmitted = submittedExamIds.has(exam._id);
                            return (
                                <div key={exam._id} className="glass-card">
                                    <h3>{exam.title}</h3>
                                    <p style={{ color: 'var(--text-muted)', margin: '10px 0' }}>
                                        {new Date(exam.date).toLocaleDateString()} | {exam.duration} mins
                                    </p>
                                    <p>{exam.questions.length} Questions</p>

                                    {isSubmitted ? (
                                        <button className="btn" style={{ marginTop: '15px', width: '100%', background: 'var(--bg-dark)', cursor: 'default' }} disabled>
                                            ✅ Completed
                                        </button>
                                    ) : (
                                        <button className="btn btn-primary" style={{ marginTop: '15px', width: '100%' }}
                                            onClick={() => navigate(`/take-exam/${exam._id}`)}>
                                            Start Exam
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                        {availableExams.length === 0 && <p>No exams available at the moment.</p>}
                    </div>
                )}
            </div>
        </div>
    );
};


export default StudentDashboard;
