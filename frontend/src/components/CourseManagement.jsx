import { useState, useEffect } from 'react';
import { academicAPI } from '../services/api';
import Toast from './Toast';

const CourseManagement = () => {
    const [courses, setCourses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [showCourseModal, setShowCourseModal] = useState(false);
    const [showSubjectModal, setShowSubjectModal] = useState(false);
    const [toast, setToast] = useState(null);

    // Form states
    const [newCourse, setNewCourse] = useState({ name: '', code: '', duration: '', department: '' });
    const [newSubject, setNewSubject] = useState({ name: '', code: '', course: '', semester: '', credits: '' });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [cRes, sRes] = await Promise.all([
                academicAPI.getCourses(),
                academicAPI.getSubjects()
            ]);
            setCourses(cRes.data);
            setSubjects(sRes.data);
        } catch (err) {
            setToast({ type: 'error', message: 'Failed to load data' });
        }
    };

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        try {
            await academicAPI.createCourse(newCourse);
            setToast({ type: 'success', message: 'Course created' });
            setShowCourseModal(false);
            loadData();
            setNewCourse({ name: '', code: '', duration: '', department: '' });
        } catch (err) {
            setToast({ type: 'error', message: 'Failed to create course' });
        }
    };

    const handleCreateSubject = async (e) => {
        e.preventDefault();
        try {
            await academicAPI.createSubject(newSubject);
            setToast({ type: 'success', message: 'Subject created' });
            setShowSubjectModal(false);
            loadData();
            setNewSubject({ name: '', code: '', course: '', semester: '', credits: '' });
        } catch (err) {
            setToast({ type: 'error', message: 'Failed to create subject' });
        }
    };

    const deleteCourse = async (id) => {
        if (!confirm('Delete course?')) return;
        try {
            await academicAPI.deleteCourse(id);
            setToast({ type: 'success', message: 'Deleted' });
            loadData();
        } catch (err) { setToast({ type: 'error', message: 'Delete failed' }); }
    };

    const deleteSubject = async (id) => {
        if (!confirm('Delete subject?')) return;
        try {
            await academicAPI.deleteSubject(id);
            setToast({ type: 'success', message: 'Deleted' });
            loadData();
        } catch (err) { setToast({ type: 'error', message: 'Delete failed' }); }
    };

    return (
        <div>
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <div style={{ display: 'flex', gap: '20px' }}>
                {/* Courses Section */}
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                        <h3>Courses</h3>
                        <button className="btn btn-primary" onClick={() => setShowCourseModal(true)}>Add Course</button>
                    </div>
                    <div className="glass-card" style={{ padding: '10px' }}>
                        {courses.map(c => (
                            <div key={c._id} style={{ padding: '12px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <strong>{c.name}</strong> <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>({c.code})</span><br />
                                    <small style={{ color: 'var(--text-muted)' }}>{c.duration} | {c.department}</small>
                                </div>
                                <button className="btn btn-error" style={{ fontSize: '0.8rem', padding: '5px 10px' }} onClick={() => deleteCourse(c._id)}>Delete</button>
                            </div>
                        ))}
                        {courses.length === 0 && <p style={{ padding: '10px', textAlign: 'center' }}>No courses</p>}
                    </div>
                </div>

                {/* Subjects Section */}
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                        <h3>Subjects</h3>
                        <button className="btn btn-primary" onClick={() => setShowSubjectModal(true)}>Add Subject</button>
                    </div>
                    <div className="glass-card" style={{ padding: '10px' }}>
                        {subjects.map(s => (
                            <div key={s._id} style={{ padding: '12px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <strong>{s.name}</strong> <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>({s.code})</span><br />
                                    <small style={{ color: 'var(--text-muted)' }}>Sem {s.semester} | {s.credits} Credits | {s.course?.name}</small>
                                </div>
                                <button className="btn btn-error" style={{ fontSize: '0.8rem', padding: '5px 10px' }} onClick={() => deleteSubject(s._id)}>Delete</button>
                            </div>
                        ))}
                        {subjects.length === 0 && <p style={{ padding: '10px', textAlign: 'center' }}>No subjects</p>}
                    </div>
                </div>
            </div>

            {/* Course Modal */}
            {showCourseModal && (
                <div className="modal-overlay">
                    <div className="glass-card modal-content">
                        <h2>Add Course</h2>
                        <form onSubmit={handleCreateCourse}>
                            <div className="input-group">
                                <label>Course Name</label>
                                <input required value={newCourse.name} onChange={e => setNewCourse({ ...newCourse, name: e.target.value })} />
                            </div>
                            <div className="input-group">
                                <label>Course Code</label>
                                <input required value={newCourse.code} onChange={e => setNewCourse({ ...newCourse, code: e.target.value })} />
                            </div>
                            <div className="input-group">
                                <label>Duration</label>
                                <input value={newCourse.duration} onChange={e => setNewCourse({ ...newCourse, duration: e.target.value })} placeholder="e.g. 4 Years" />
                            </div>
                            <div className="input-group">
                                <label>Department</label>
                                <input value={newCourse.department} onChange={e => setNewCourse({ ...newCourse, department: e.target.value })} />
                            </div>
                            <button className="btn btn-primary" style={{ width: '100%' }}>Create</button>
                            <button type="button" className="btn" style={{ width: '100%', marginTop: '10px' }} onClick={() => setShowCourseModal(false)}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Subject Modal */}
            {showSubjectModal && (
                <div className="modal-overlay">
                    <div className="glass-card modal-content">
                        <h2>Add Subject</h2>
                        <form onSubmit={handleCreateSubject}>
                            <div className="input-group">
                                <label>Subject Name</label>
                                <input required value={newSubject.name} onChange={e => setNewSubject({ ...newSubject, name: e.target.value })} />
                            </div>
                            <div className="input-group">
                                <label>Subject Code</label>
                                <input required value={newSubject.code} onChange={e => setNewSubject({ ...newSubject, code: e.target.value })} />
                            </div>
                            <div className="input-group">
                                <label>Course</label>
                                <select required value={newSubject.course} onChange={e => setNewSubject({ ...newSubject, course: e.target.value })}>
                                    <option value="">Select Course</option>
                                    {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div className="input-group" style={{ flex: 1 }}>
                                    <label>Semester</label>
                                    <input type="number" value={newSubject.semester} onChange={e => setNewSubject({ ...newSubject, semester: e.target.value })} />
                                </div>
                                <div className="input-group" style={{ flex: 1 }}>
                                    <label>Credits</label>
                                    <input type="number" value={newSubject.credits} onChange={e => setNewSubject({ ...newSubject, credits: e.target.value })} />
                                </div>
                            </div>
                            <button className="btn btn-primary" style={{ width: '100%' }}>Create</button>
                            <button type="button" className="btn" style={{ width: '100%', marginTop: '10px' }} onClick={() => setShowSubjectModal(false)}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseManagement;
