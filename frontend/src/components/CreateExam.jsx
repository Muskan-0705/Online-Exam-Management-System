import { useState, useEffect } from 'react';
import { questionAPI, examAPI } from '../services/api';
import Toast from './Toast';

const CreateExam = ({ onClose, onSuccess }) => {
    const [step, setStep] = useState(1);
    const [examData, setExamData] = useState({
        title: '', date: '', duration: '', questionCount: ''
    });
    const [questions, setQuestions] = useState([]);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [autoMode, setAutoMode] = useState(false);
    const [filters, setFilters] = useState({ subject: '', difficulty: '' });
    const [toast, setToast] = useState(null);

    useEffect(() => {
        if (step === 2 && !autoMode) {
            fetchQuestions();
        }
    }, [step, autoMode]);

    const fetchQuestions = async () => {
        try {
            const res = await questionAPI.getAll(filters);
            setQuestions(res.data);
        } catch (err) { setToast({ type: 'error', message: 'Failed to fetch questions' }); }
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                ...examData,
                questions: autoMode ? [] : selectedQuestions,
                randomize: autoMode,
                filters: autoMode ? filters : null
            };

            await examAPI.create(payload);
            setToast({ type: 'success', message: 'Exam created successfully!' });
            setTimeout(() => {
                onSuccess();
            }, 1000);
        } catch (err) {
            setToast({ type: 'error', message: 'Creation failed' });
        }
    };

    const toggleQuestion = (id) => {
        if (selectedQuestions.includes(id)) {
            setSelectedQuestions(selectedQuestions.filter(q => q !== id));
        } else {
            setSelectedQuestions([...selectedQuestions, id]);
        }
    };

    return (
        <div className="modal-overlay">
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
            <div className="glass-card modal-content">
                <h2>Create New Exam</h2>

                {step === 1 && (
                    <div style={{ marginTop: '20px' }}>
                        <div className="input-group">
                            <label>Exam Title</label>
                            <input required value={examData.title} onChange={e => setExamData({ ...examData, title: e.target.value })} />
                        </div>
                        <div className="input-group">
                            <label>Date & Time</label>
                            <input type="datetime-local" required value={examData.date} onChange={e => setExamData({ ...examData, date: e.target.value })} />
                        </div>
                        <div className="input-group">
                            <label>Duration (minutes)</label>
                            <input type="number" required value={examData.duration} onChange={e => setExamData({ ...examData, duration: e.target.value })} />
                        </div>

                        <div className="input-group">
                            <label>Question Selection Mode</label>
                            <select value={autoMode ? 'auto' : 'manual'} onChange={e => setAutoMode(e.target.value === 'auto')}>
                                <option value="manual">Manual Selection</option>
                                <option value="auto">Auto Generate (Random)</option>
                            </select>
                        </div>

                        {autoMode && (
                            <>
                                <div className="input-group">
                                    <label>Number of Questions</label>
                                    <input type="number" value={examData.questionCount} onChange={e => setExamData({ ...examData, questionCount: e.target.value })} />
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <div className="input-group" style={{ flex: 1 }}>
                                        <label>Subject</label>
                                        <input value={filters.subject} onChange={e => setFilters({ ...filters, subject: e.target.value })} placeholder="Any" />
                                    </div>
                                    <div className="input-group" style={{ flex: 1 }}>
                                        <label>Difficulty</label>
                                        <select value={filters.difficulty} onChange={e => setFilters({ ...filters, difficulty: e.target.value })}>
                                            <option value="">Any</option>
                                            <option>Easy</option>
                                            <option>Medium</option>
                                            <option>Hard</option>
                                        </select>
                                    </div>
                                </div>
                            </>
                        )}

                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => autoMode ? handleSubmit() : setStep(2)}>
                                {autoMode ? 'Create Exam' : 'Next: Select Questions'}
                            </button>
                            <button className="btn" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
                        </div>
                    </div>
                )}

                {step === 2 && !autoMode && (
                    <div style={{ marginTop: '20px' }}>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                            <input className="input-group" style={{ marginBottom: 0 }} placeholder="Filter by subject..."
                                onChange={e => setFilters({ ...filters, subject: e.target.value })} />
                            <button className="btn" onClick={fetchQuestions}>Filter</button>
                        </div>

                        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            {questions.map(q => (
                                <div key={q._id} onClick={() => toggleQuestion(q._id)}
                                    style={{
                                        padding: '10px',
                                        marginBottom: '10px',
                                        background: selectedQuestions.includes(q._id) ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255,255,255,0.05)',
                                        border: selectedQuestions.includes(q._id) ? '1px solid var(--primary)' : '1px solid transparent',
                                        borderRadius: '8px',
                                        cursor: 'pointer'
                                    }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <strong>{q.text.substring(0, 50)}...</strong>
                                        <span className="badge">{q.difficulty}</span>
                                    </div>
                                    <small>{q.subject} | {q.type}</small>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Selected: {selectedQuestions.length}</span>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button className="btn" onClick={() => setStep(1)}>Back</button>
                                <button className="btn btn-primary" onClick={handleSubmit} disabled={selectedQuestions.length === 0}>
                                    Create Exam
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateExam;
