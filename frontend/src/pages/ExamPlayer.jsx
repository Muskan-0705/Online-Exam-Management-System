import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { examAPI, submissionAPI } from '../services/api';
import ProctorChecks from '../components/ProctorChecks';

const ExamPlayer = () => {
    // ... existing state ...
    const { id } = useParams();
    const navigate = useNavigate();
    const [exam, setExam] = useState(null);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [toast, setToast] = useState(null);

    // ... useEffects ...
    useEffect(() => {
        loadExam();
    }, []);

    useEffect(() => {
        if (!exam) return;
        // Start timer only after exam is loaded
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [exam]);

    const loadExam = async () => {
        try {
            const res = await examAPI.getById(id);
            setExam(res.data);
            const duration = Math.max(0, Number(res.data.duration));
            setTimeLeft(duration * 60);
        } catch (err) { setToast({ type: 'error', message: 'Failed to load exam' }); }
    };

    const handleAnswer = (qId, value) => {
        setAnswers({ ...answers, [qId]: value });
    };

    const handleSubmit = async () => {
        try {
            const formattedAnswers = Object.keys(answers).map(qId => ({
                questionId: qId,
                answer: answers[qId]
            }));
            await submissionAPI.submit(id, formattedAnswers);
            alert('Exam submitted successfully!');
            navigate('/student');
        } catch (err) {
            const msg = err.response?.data?.message || 'Submission failed';
            setToast({ type: 'error', message: msg });
        }
    };

    const handleViolation = (msg) => {
        setToast({ type: 'warning', message: `⚠️ Violation: ${msg}` });
        // Optional: Auto-submit on too many violations
    };

    const formatTime = (seconds) => {
        if (seconds < 0) return "0:00";
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    if (!exam) return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Loading...</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', color: 'white' }}>
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <ProctorChecks onViolation={handleViolation} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', position: 'sticky', top: '10px', background: 'var(--bg-card)', padding: '15px', borderRadius: '10px', backdropFilter: 'blur(10px)', zIndex: 100 }}>
                <h2>{exam.title}</h2>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: timeLeft < 300 ? 'var(--error)' : 'var(--primary)' }}>
                    Time Left: {formatTime(timeLeft)}
                </div>
            </div>

            <div style={{ marginBottom: '30px' }}>
                {exam.questions.map((q, index) => (
                    <div key={q._id} className="glass-card" style={{ marginBottom: '20px', padding: '20px' }}>
                        <p style={{ fontSize: '1.1rem', marginBottom: '15px' }}>
                            <strong>Q{index + 1}.</strong> {q.questionText}
                        </p>

                        {q.type === 'MCQ' ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {q.options.map((opt, i) => (
                                    <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="radio"
                                            name={q._id}
                                            value={i}
                                            onChange={() => handleAnswer(q._id, i)}
                                            checked={answers[q._id] === i}
                                        />
                                        {opt}
                                    </label>
                                ))}
                            </div>
                        ) : (
                            <textarea
                                className="input-group"
                                rows="4"
                                placeholder="Type your answer here..."
                                onChange={(e) => handleAnswer(q._id, e.target.value)}
                            ></textarea>
                        )}
                    </div>
                ))}
            </div>

            <button className="btn btn-primary" style={{ width: '100%', padding: '15px', fontSize: '1.2rem' }} onClick={handleSubmit}>
                Submit Exam
            </button>
        </div>
    );
};

export default ExamPlayer;
