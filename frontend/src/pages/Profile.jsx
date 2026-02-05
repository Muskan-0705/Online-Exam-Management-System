import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';

const Profile = () => {
    const { user, login } = useAuth(); // login is effectively setUser if we pass the new user object? 
    // Actually AuthContext usually exposes a way to update user. 
    // If not, we might need to just update the local state or reload.
    // Let's assume for now we just show success and maybe the user needs to re-login or we manually update if AuthContext supports it.

    // Check AuthContext implementation later. For now, basic implementation.

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        rollNo: user?.rollNo || '',
        course: user?.course || '',
        semester: user?.semester || '',
        subject: user?.subject || '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    const [toast, setToast] = useState(null);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const updatePayload = {
                name: formData.name,
                email: formData.email
            };

            // Add role specific fields
            if (user.role === 'Student') {
                updatePayload.rollNo = formData.rollNo;
                updatePayload.course = formData.course;
                updatePayload.semester = formData.semester;
            } else if (user.role === 'Teacher') {
                updatePayload.subject = formData.subject;
            }

            const { data } = await authAPI.updateProfile(updatePayload);

            // Update local storage if needed or just show success
            // Ideally update AuthContext state.
            const currentUser = JSON.parse(localStorage.getItem('user'));
            const updatedUser = { ...currentUser, ...data };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            setToast({ type: 'success', message: 'Profile updated successfully!' });
            setIsEditing(false);

            // Reload to reflect changes in Navbar etc
            setTimeout(() => window.location.reload(), 1000);

        } catch (err) {
            setToast({ type: 'error', message: err.response?.data?.message || 'Update failed' });
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmNewPassword) {
            setToast({ type: 'error', message: 'New passwords do not match' });
            return;
        }

        try {
            await authAPI.changePassword(formData.currentPassword, formData.newPassword);
            setToast({ type: 'success', message: 'Password changed successfully!' });
            setFormData({ ...formData, currentPassword: '', newPassword: '', confirmNewPassword: '' });
        } catch (err) {
            setToast({ type: 'error', message: err.response?.data?.message || 'Password change failed' });
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="dashboard-container">
            <Navbar />

            <div className="main-content" style={{ maxWidth: '800px', margin: '0 auto' }}>
                {toast && <Toast {...toast} onClose={() => setToast(null)} />}

                <div className="glass-card fade-in">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2>My Profile</h2>
                        {!isEditing && (
                            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit Profile</button>
                        )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '120px', height: '120px',
                                borderRadius: '50%', background: 'var(--primary)',
                                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '40px', margin: '0 auto 10px'
                            }}>
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <h3>{user.name}</h3>
                            <span className="badge">{user.role}</span>
                        </div>

                        <div>
                            <form onSubmit={handleUpdateProfile}>
                                <div className="input-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        disabled={!isEditing}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        disabled={!isEditing} // Email might be unique identifier, be careful
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>

                                {user.role === 'Student' && (
                                    <>
                                        <div className="input-group">
                                            <label>Roll Number</label>
                                            <input
                                                type="text"
                                                value={formData.rollNo}
                                                disabled={!isEditing}
                                                onChange={e => setFormData({ ...formData, rollNo: e.target.value })}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <div className="input-group" style={{ flex: 1 }}>
                                                <label>Course</label>
                                                <input
                                                    type="text"
                                                    value={formData.course}
                                                    disabled={!isEditing}
                                                    onChange={e => setFormData({ ...formData, course: e.target.value })}
                                                />
                                            </div>
                                            <div className="input-group" style={{ flex: 1 }}>
                                                <label>Semester</label>
                                                <input
                                                    type="text"
                                                    value={formData.semester}
                                                    disabled={!isEditing}
                                                    onChange={e => setFormData({ ...formData, semester: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {user.role === 'Teacher' && (
                                    <div className="input-group">
                                        <label>Specialized Subject</label>
                                        <input
                                            type="text"
                                            value={formData.subject}
                                            disabled={!isEditing}
                                            onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                        />
                                    </div>
                                )}

                                {isEditing && (
                                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                        <button className="btn btn-primary" type="submit">Save Changes</button>
                                        <button className="btn" type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>

                <div className="glass-card fade-in" style={{ marginTop: '20px' }}>
                    <h3>Security</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '15px' }}>Change your password here.</p>

                    <form onSubmit={handleChangePassword}>
                        <div className="input-group">
                            <label>Current Password</label>
                            <input
                                type="password"
                                value={formData.currentPassword}
                                onChange={e => setFormData({ ...formData, currentPassword: e.target.value })}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <div className="input-group" style={{ flex: 1 }}>
                                <label>New Password</label>
                                <input
                                    type="password"
                                    value={formData.newPassword}
                                    onChange={e => setFormData({ ...formData, newPassword: e.target.value })}
                                />
                            </div>
                            <div className="input-group" style={{ flex: 1 }}>
                                <label>Confirm New Password</label>
                                <input
                                    type="password"
                                    value={formData.confirmNewPassword}
                                    onChange={e => setFormData({ ...formData, confirmNewPassword: e.target.value })}
                                />
                            </div>
                        </div>
                        <button className="btn btn-error" type="submit"
                            disabled={!formData.currentPassword || !formData.newPassword}>
                            Update Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
