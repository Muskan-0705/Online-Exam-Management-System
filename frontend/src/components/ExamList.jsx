import { useState, useEffect } from 'react';
import { examAPI } from '../services/api';
import Toast from './Toast';
import CreateExam from './CreateExam';

const ExamList = ({ role }) => {
    const [exams, setExams] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            const res = await examAPI.getAll();
            setExams(res.data);
        } catch (err) {
            setToast({ type: 'error', message: 'Failed to fetch exams' });
        }
    };

    const togglePublish = async (id, currentStatus) => {
        try {
            await examAPI.update(id, { isPublished: !currentStatus });
            setToast({ type: 'success', message: `Exam ${!currentStatus ? 'Published' : 'Unpublished'}` });
            fetchExams();
        } catch (err) { setToast({ type: 'error', message: 'Update failed' }); }
    };

    const deleteExam = async (id) => {
        if (!confirm('Are you sure you want to delete this exam?')) return;
        try {
            await examAPI.delete(id);
            setToast({ type: 'success', message: 'Exam deleted' });
            fetchExams();
        } catch (err) { setToast({ type: 'error', message: 'Delete failed' }); }
    };

    const getStatusColor = (status) => {
        if (status) return 'var(--success)';
        return 'var(--warning)';
    };

    return (
        <div>
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            {(role === 'Admin' || role === 'Teacher') && (
                <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>Create New Exam</button>
                </div>
            )}

            <div className="exam-grid">
                {exams.map(exam => (
                    <div key={exam._id} className="glass-card">
                        <h3>{exam.title}</h3>
                        <p style={{ margin: '10px 0' }}>
                            {new Date(exam.date).toLocaleDateString()} | {exam.duration} mins
                        </p>
                        <p>Questions: {exam.questions.length}</p>
                        <div style={{ margin: '10px 0' }}>
                            <span className={`badge ${exam.isPublished ? 'badge-success' : 'badge-warning'}`}>
                                {exam.isPublished ? 'Published' : 'Draft'}
                            </span>
                        </div>
                        <div style={{ marginTop: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <a href={`/results/${exam._id}`} className="btn">Results</a>

                            {(role === 'Admin' || role === 'Teacher') && (
                                <>
                                    <button
                                        className={`btn ${exam.isPublished ? 'btn-warning' : 'btn-success'}`}
                                        onClick={() => togglePublish(exam._id, exam.isPublished)}>
                                        {exam.isPublished ? 'Unpublish' : 'Publish'}
                                    </button>
                                    <button className="btn btn-error" onClick={() => deleteExam(exam._id)}>Delete</button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
                {exams.length === 0 && <p>No exams found.</p>}
            </div>

            {showCreateModal && (
                <CreateExam
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => { setShowCreateModal(false); fetchExams(); }}
                />
            )}
        </div>
    );
};

export default ExamList;
