import axios from 'axios';

const API_URL = 'http://localhost:5000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    console.log('API Request to:', config.url, 'Token present:', !!token);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Authorization header added');
    }
    return config;
});

// Auth APIs
export const authAPI = {
    login: (identifier, password) => api.post('/auth/login', { identifier, password }),
    signup: (data) => api.post('/auth/signup', data),
    updateProfile: (data) => api.put('/auth/profile', data),
    changePassword: (oldPassword, newPassword) => api.put('/auth/password', { oldPassword, newPassword })
};

// Exam APIs
export const examAPI = {
    getAll: () => api.get('/exams'),
    getById: (id) => api.get(`/exams/${id}`),
    create: (data) => api.post('/exams', data),
    update: (id, data) => api.put(`/exams/${id}`, data),
    delete: (id) => api.delete(`/exams/${id}`),
    getResults: (id) => api.get(`/exams/results/${id}`)
};

// Submission APIs
export const submissionAPI = {
    submit: (examId, answers) => api.post(`/submit/${examId}`, { answers }),
    getMyResults: () => api.get('/submit/my-results'),
    getPending: () => api.get('/submit/pending'),
    grade: (id, marks) => api.put(`/submit/grade/${id}`, { marks }),
    getAnalytics: () => api.get('/submit/analytics/stats'),
    exportResults: (examId) => `${API_URL}/submit/export/${examId}`
};

// Question APIs
export const questionAPI = {
    getAll: (params) => api.get('/questions', { params }),
    create: (data) => api.post('/questions', data),
    update: (id, data) => api.put(`/questions/${id}`, data),
    delete: (id) => api.delete(`/questions/${id}`)
};

// User APIs
export const userAPI = {
    getAll: () => api.get('/users'),
    create: (data) => api.post('/users/create', data),
    delete: (id) => api.delete(`/users/${id}`),
    toggleStatus: (id) => api.put(`/users/${id}/toggle-status`)
};

// Academic APIs
export const academicAPI = {
    getCourses: () => api.get('/academic/courses'),
    createCourse: (data) => api.post('/academic/courses', data),
    deleteCourse: (id) => api.delete(`/academic/courses/${id}`),
    getSubjects: () => api.get('/academic/subjects'),
    createSubject: (data) => api.post('/academic/subjects', data),
    deleteSubject: (id) => api.delete(`/academic/subjects/${id}`)
};

export default api;
