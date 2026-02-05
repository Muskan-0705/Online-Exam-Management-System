import { useState } from 'react';
import Navbar from '../components/Navbar';
import ExamList from '../components/ExamList';
import QuestionBank from '../components/QuestionBank';
import Evaluation from '../components/Evaluation';

const TeacherDashboard = () => {
    const [activeTab, setActiveTab] = useState('exams');

    return (
        <div className="app">
            <Navbar />
            <div className="main-content">
                <div className="tabs" style={{ marginBottom: '20px' }}>
                    <button className={`tab-btn ${activeTab === 'exams' ? 'active' : ''}`} onClick={() => setActiveTab('exams')}>My Exams</button>
                    <button className={`tab-btn ${activeTab === 'questions' ? 'active' : ''}`} onClick={() => setActiveTab('questions')}>Question Bank</button>
                    <button className={`tab-btn ${activeTab === 'evaluate' ? 'active' : ''}`} onClick={() => setActiveTab('evaluate')}>Evaluation</button>
                </div>

                {activeTab === 'exams' && <ExamList role="Teacher" />}
                {activeTab === 'questions' && <QuestionBank />}
                {activeTab === 'evaluate' && <Evaluation />}
            </div>
        </div>
    );
};

export default TeacherDashboard;
