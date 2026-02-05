import { useState, useEffect } from 'react';
import { questionAPI } from '../services/api';
import Toast from './Toast';

const QuestionBank = () => {
    const [questions, setQuestions] = useState([]);
    const [filter, setFilter] = useState({ subject: '', difficulty: '' });
    const [showModal, setShowModal] = useState(false);
    const [newQuestion, setNewQuestion] = useState({
        text: '', subject: '', difficulty: 'Medium', type: 'MCQ', options: ['', '', '', ''], correctOption: 0
    });
    const [toast, setToast] = useState(null);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const res = await questionAPI.getAll(filter);
            setQuestions(res.data);
        } catch (err) { setToast({ type: 'error', message: 'Failed to fetch' }); }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            console.log('Submitting question:', newQuestion);
            const response = await questionAPI.create(newQuestion);
            console.log('✅ Success response:', response);
            setToast({ type: 'success', message: 'Question added' });
            setShowModal(false);
            fetchQuestions();
            setNewQuestion({ text: '', subject: '', difficulty: 'Medium', type: 'MCQ', options: ['', '', '', ''], correctOption: 0 });
        } catch (err) { 
            console.error('❌ Error adding question:', err);
            console.error('Response status:', err.response?.status);
            console.error('Response data:', err.response?.data);
            const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message || 'Add failed';
            setToast({ type: 'error', message: errorMsg }); 
        }
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...newQuestion.options];
        newOptions[index] = value;
        setNewQuestion({ ...newQuestion, options: newOptions });
    };

    const deleteQuestion = async (id) => {
        if (!confirm('Delete this question?')) return;
        try {
            await questionAPI.delete(id);
            setToast({ type: 'success', message: 'Deleted' });
            fetchQuestions();
        } catch (err) { setToast({ type: 'error', message: 'Delete failed' }); }
    };

    return (
        <div>
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2>Question Bank</h2>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>Add Question</button>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input className="input-group" style={{ marginBottom: 0 }} placeholder="Filter Subject..."
                    onChange={(e) => setFilter({ ...filter, subject: e.target.value })} />
                <select className="input-group" style={{ width: '150px', marginBottom: 0 }}
                    onChange={(e) => setFilter({ ...filter, difficulty: e.target.value })}>
                    <option value="">All Difficulties</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>
                <button className="btn" onClick={fetchQuestions}>Search</button>
            </div>

            <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                {questions.map(q => (
                    <div key={q._id} className="glass-card" style={{ padding: '15px', marginBottom: '10px', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '60px' }}>
                            <strong>{q.text}</strong>
                            <span className="badge" style={{
                                backgroundColor: q.difficulty === 'Easy' ? 'rgba(0,255,0,0.2)' : q.difficulty === 'Hard' ? 'rgba(255,0,0,0.2)' : 'rgba(255,200,0,0.2)'
                            }}>{q.difficulty}</span>
                        </div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Subject: {q.subject} | Type: {q.type}</p>
                        <button className="btn btn-error" style={{ position: 'absolute', top: '10px', right: '10px', padding: '5px 10px', fontSize: '0.8rem' }}
                            onClick={() => deleteQuestion(q._id)}>Delete</button>
                    </div>
                ))}
            </div>

            {/* Add Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="glass-card modal-content">
                        <h2>Add Question</h2>
                        <form onSubmit={handleCreate}>
                            <div className="input-group">
                                <label>Question Text</label>
                                <textarea required value={newQuestion.text} onChange={e => setNewQuestion({ ...newQuestion, text: e.target.value })} rows="3"></textarea>
                            </div>
                            <div className="input-group">
                                <label>Subject</label>
                                <input required value={newQuestion.subject} onChange={e => setNewQuestion({ ...newQuestion, subject: e.target.value })} />
                            </div>
                            <div className="input-group">
                                <label>Difficulty</label>
                                <select value={newQuestion.difficulty} onChange={e => setNewQuestion({ ...newQuestion, difficulty: e.target.value })}>
                                    <option>Easy</option>
                                    <option>Medium</option>
                                    <option>Hard</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Type</label>
                                <select value={newQuestion.type} onChange={e => setNewQuestion({ ...newQuestion, type: e.target.value })}>
                                    <option value="MCQ">Multiple Choice</option>
                                    <option value="Descriptive">Descriptive</option>
                                </select>
                            </div>

                            {newQuestion.type === 'MCQ' && (
                                <>
                                    {[0, 1, 2, 3].map((i) => (
                                        <div key={i} className="input-group">
                                            <label>Option {i + 1}</label>
                                            <input required value={newQuestion.options[i]} onChange={e => handleOptionChange(i, e.target.value)} />
                                        </div>
                                    ))}
                                    <div className="input-group">
                                        <label>Correct Option (1-4)</label>
                                        <input required type="number" min="1" max="4"
                                            value={newQuestion.correctOption + 1}
                                            onChange={e => setNewQuestion({ ...newQuestion, correctOption: parseInt(e.target.value) - 1 })} />
                                    </div>
                                </>
                            )}

                            <button className="btn btn-primary" style={{ width: '100%' }}>Add</button>
                            <button type="button" className="btn" style={{ width: '100%', marginTop: '10px' }} onClick={() => setShowModal(false)}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuestionBank;
