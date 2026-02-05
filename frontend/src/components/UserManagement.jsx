import { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import Toast from './Toast';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState({ role: '', status: '' });
    const [showModal, setShowModal] = useState(false);
    const [newUser, setNewUser] = useState({
        name: '', email: '', password: '', role: 'Student', rollNo: '', course: '', subject: ''
    });
    const [toast, setToast] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await userAPI.getAll();
            setUsers(res.data);
        } catch (err) {
            setToast({ type: 'error', message: 'Failed to fetch users' });
        }
    };

    const toggleStatus = async (id) => {
        try {
            await userAPI.toggleStatus(id);
            setToast({ type: 'success', message: 'Status updated' });
            fetchUsers();
        } catch (err) {
            setToast({ type: 'error', message: 'Update failed' });
        }
    };

    const deleteUser = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            await userAPI.delete(id);
            setToast({ type: 'success', message: 'User deleted' });
            fetchUsers();
        } catch (err) {
            setToast({ type: 'error', message: 'Delete failed' });
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await userAPI.create(newUser);
            setToast({ type: 'success', message: 'User created' });
            setShowModal(false);
            fetchUsers();
            setNewUser({ name: '', email: '', password: '', role: 'Student', rollNo: '', course: '', subject: '' });
        } catch (err) {
            setToast({ type: 'error', message: err.response?.data?.message || 'Creation failed' });
        }
    };

    const filteredUsers = users.filter(u => {
        return (!filter.role || u.role === filter.role) &&
            (!filter.status || u.isActive.toString() === filter.status);
    });

    return (
        <div>
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2>User Management</h2>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>Add New User</button>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <select className="input-group" style={{ width: '150px', marginBottom: 0 }}
                    onChange={(e) => setFilter({ ...filter, role: e.target.value })}>
                    <option value="">All Roles</option>
                    <option value="Student">Students</option>
                    <option value="Teacher">Teachers</option>
                    <option value="Admin">Admins</option>
                </select>
                <select className="input-group" style={{ width: '150px', marginBottom: 0 }}
                    onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
                    <option value="">All Status</option>
                    <option value="true">Active</option>
                    <option value="false">Disabled</option>
                </select>
            </div>

            <div className="glass-card table-container" style={{ padding: 0 }}>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email / Roll No</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Last Login</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(u => (
                            <tr key={u._id}>
                                <td>{u.name}</td>
                                <td>
                                    {u.email}<br />
                                    <small style={{ color: 'var(--text-muted)' }}>{u.rollNo || 'N/A'}</small>
                                </td>
                                <td>
                                    <span className={`badge ${u.role === 'Admin' ? 'badge-error' : u.role === 'Teacher' ? 'badge-warning' : 'badge-success'}`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td>
                                    <span style={{ color: u.isActive ? 'var(--success)' : 'var(--error)', marginRight: '5px' }}>●</span>
                                    {u.isActive ? 'Active' : 'Disabled'}
                                </td>
                                <td style={{ fontSize: '0.85rem' }}>
                                    {u.lastLoginTime ? new Date(u.lastLoginTime).toLocaleString() : 'Never'}<br />
                                    <small style={{ color: 'var(--text-muted)' }}>{u.lastLoginIP}</small>
                                </td>
                                <td>
                                    <button className="btn" style={{ padding: '5px 10px', fontSize: '0.8rem', marginRight: '5px' }}
                                        onClick={() => toggleStatus(u._id)}>
                                        {u.isActive ? 'Disable' : 'Enable'}
                                    </button>
                                    <button className="btn btn-error" style={{ padding: '5px 10px', fontSize: '0.8rem' }}
                                        onClick={() => deleteUser(u._id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="glass-card modal-content">
                        <h2>Add New User</h2>
                        <form onSubmit={handleCreate} style={{ marginTop: '20px' }}>
                            <div className="input-group">
                                <label>Name</label>
                                <input required value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} />
                            </div>
                            <div className="input-group">
                                <label>Email</label>
                                <input required type="email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
                            </div>
                            <div className="input-group">
                                <label>Password</label>
                                <input required type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
                            </div>
                            <div className="input-group">
                                <label>Role</label>
                                <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                                    <option value="Student">Student</option>
                                    <option value="Teacher">Teacher</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                            {newUser.role === 'Student' && (
                                <div className="input-group">
                                    <label>Roll No</label>
                                    <input value={newUser.rollNo} onChange={e => setNewUser({ ...newUser, rollNo: e.target.value })} />
                                </div>
                            )}
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div className="input-group" style={{ flex: 1 }}>
                                    <label>Course</label>
                                    <input value={newUser.course} onChange={e => setNewUser({ ...newUser, course: e.target.value })} />
                                </div>
                                <div className="input-group" style={{ flex: 1 }}>
                                    <label>Subject/Sem</label>
                                    <input value={newUser.subject} onChange={e => setNewUser({ ...newUser, subject: e.target.value })} />
                                </div>
                            </div>
                            <button className="btn btn-primary" style={{ width: '100%' }}>Create User</button>
                            <button type="button" className="btn" style={{ width: '100%', marginTop: '10px' }} onClick={() => setShowModal(false)}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
