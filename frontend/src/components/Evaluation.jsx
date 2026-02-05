import { useState, useEffect } from 'react';
import { submissionAPI } from '../services/api';
import Toast from './Toast';

const Evaluation = () => {
    const [pending, setPending] = useState([]);
    const [toast, setToast] = useState(null);
    const [selectedSub, setSelectedSub] = useState(null);
    const [marks, setMarks] = useState({});

    useEffect(() => {
        fetchPending();
    }, []);

    const fetchPending = async () => {
        try {
            const res = await submissionAPI.getPending();
            setPending(res.data);
        } catch (err) { setToast({ type: 'error', message: 'Failed to fetch pending' }); }
    };

    const handleGrade = async (sub) => {
        setSelectedSub(sub);
        // Initialize marks
        const initialMarks = {};
        sub.answers.forEach(ans => {
            if (ans.type === 'Descriptive') initialMarks[ans.questionId] = 0;
        });
        setMarks(initialMarks);
    };

    const submitGrade = async () => {
        try {
            // Calculate total marks including auto-graded MCQ
            let total = 0;
            selectedSub.answers.forEach(ans => {
                if (ans.type === 'MCQ') total += ans.marksObtained || 0;
                else total += parseInt(marks[ans.questionId] || 0);
            });

            await submissionAPI.grade(selectedSub._id, total);
            setToast({ type: 'success', message: 'Graded successfully' });
            setSelectedSub(null);
            fetchPending();
        } catch (err) { setToast({ type: 'error', message: 'Grading failed' }); }
    };

    return (
        <div>
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <h2>Pending Evaluations</h2>

            {!selectedSub ? (
                <div style={{ marginTop: '20px' }}>
                    {pending.map(sub => (
                        <div key={sub._id} className="glass-card" style={{ padding: '15px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <strong>{sub.student?.name || 'Student'}</strong> - {sub.exam?.title || 'Exam'}<br />
                                <small style={{ color: 'var(--text-muted)' }}>Submitted: {new Date(sub.submittedAt).toLocaleString()}</small>
                            </div>
                            <button className="btn btn-primary" onClick={() => handleGrade(sub)}>Grade</button>
                        </div>
                    ))}
                    {pending.length === 0 && <p style={{ textAlign: 'center', marginTop: '20px' }}>No pending evaluations.</p>}
                </div>
            ) : (
                <div className="glass-card" style={{ marginTop: '20px' }}>
                    <h3>Grading: {selectedSub.student?.name}</h3>
                    <div style={{ marginTop: '15px' }}>
                        {selectedSub.answers.filter(a => a.type === 'Descriptive').map((ans, i) => (
                            <div key={i} style={{ marginBottom: '20px', padding: '10px', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>
                                <p><strong>Q:</strong> {ans.questionId}</p> {/* Ideally fetch question text */}
                                <p style={{ margin: '10px 0', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '5px' }}>
                                    <strong>Answer:</strong><br />
                                    {ans.answer}
                                </p>
                                <div className="input-group">
                                    <label>Marks</label>
                                    <input type="number" value={marks[ans.questionId]}
                                        onChange={e => setMarks({ ...marks, [ans.questionId]: e.target.value })} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="btn btn-primary" onClick={submitGrade}>Submit Grades</button>
                        <button className="btn" onClick={() => setSelectedSub(null)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Evaluation;
