import React, { useState, useEffect } from 'react';
import Sidebar from '../Components/Sidebar';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { 
  getUserProfile, 
  updateUserProfile, 
  updatePassword,
  updateNotifications,
  deleteAccount 
} from '../services/userService';
import '../Styles/theme.css';
import './ProfileSettings.css';

const ProfileSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailNotifications: true,
    taskReminders: true,
    habitReminders: false
  });

  // Fetch user profile on mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await getUserProfile();
      setFormData({
        ...formData,
        name: response.data.name,
        email: response.data.email,
        emailNotifications: response.data.emailNotifications,
        taskReminders: response.data.taskReminders,
        habitReminders: response.data.habitReminders,
      });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch profile');
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      await updateUserProfile({
        name: formData.name,
        email: formData.email
      });
      alert('Profile updated successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update profile');
      console.error('Error updating profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }

    if (formData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    try {
      setSaving(true);
      await updatePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      alert('Password updated successfully!');
      setFormData({
        ...formData, 
        currentPassword: '', 
        newPassword: '', 
        confirmPassword: ''
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update password');
      console.error('Error updating password:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationsSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      await updateNotifications({
        emailNotifications: formData.emailNotifications,
        taskReminders: formData.taskReminders,
        habitReminders: formData.habitReminders
      });
      alert('Notification preferences saved!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update notifications');
      console.error('Error updating notifications:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmText = 'DELETE';
    const userInput = prompt(
      `⚠️ WARNING: This action cannot be undone!\n\nAll your tasks, habits, and data will be permanently deleted.\n\nType "${confirmText}" to confirm:`
    );

    if (userInput !== confirmText) {
      if (userInput !== null) {
        alert('Account deletion cancelled. Text did not match.');
      }
      return;
    }

    try {
      setSaving(true);
      await deleteAccount();
      alert('Account deleted successfully. You will be redirected to login.');
      localStorage.removeItem('token');
      window.location.href = '/login';
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete account');
      console.error('Error deleting account:', err);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border" style={{color: '#2D2A45'}} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex min-vh-100">
        <Sidebar activePage="settings" />
        <div className="flex-grow-1 d-flex flex-column main-content-wrapper">
          <Navbar activePage="settings" />
          <div className="d-flex justify-content-center align-items-center flex-grow-1">
            <div className="alert alert-danger">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
              <button className="btn btn-sm btn-primary-custom ms-3" onClick={fetchUserProfile}>
                Retry
              </button>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex min-vh-100">
      <Sidebar activePage="settings" />

      <div className="flex-grow-1 d-flex flex-column main-content-wrapper">
        <Navbar activePage="settings" />

        <div className="flex-grow-1 bg-light-custom">
          <div className="container-fluid px-4 py-5">
            {/* Header */}
            <div className="mb-5">
              <h1 className="display-5 fw-semibold mb-2">Settings</h1>
              <p className="text-muted mb-0">
                Manage your account preferences and configurations.
              </p>
            </div>

            <div className="row">
              <div className="col-lg-8">
                {/* Tabs Navigation */}
                <ul className="nav nav-tabs mb-4 border-0">
                  <li className="nav-item">
                    <button
                      className={`nav-link settings-tab ${activeTab === 'profile' ? 'active' : ''}`}
                      onClick={() => setActiveTab('profile')}
                    >
                      <i className="bi bi-person me-2"></i>Profile
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link settings-tab ${activeTab === 'account' ? 'active' : ''}`}
                      onClick={() => setActiveTab('account')}
                    >
                      <i className="bi bi-shield-lock me-2"></i>Account
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
                      onClick={() => setActiveTab('notifications')}
                    >
                      <i className="bi bi-bell me-2"></i>Notifications
                    </button>
                  </li>
                </ul>

                {/* Tab Content */}
                <div className="tab-content">
                  {/* Profile Tab */}
                  {activeTab === 'profile' && (
                    <div className="card border-0 shadow-sm">
                      <div className="card-body p-4">
                        <h3 className="h5 fw-semibold mb-4">Profile Information</h3>
                        <form onSubmit={handleProfileSubmit}>
                          <div className="mb-4">
                            <label className="form-label fw-medium">Full Name</label>
                            <input
                              type="text"
                              className="form-control form-control-lg"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              placeholder="Enter your full name"
                              required
                            />
                          </div>
                          <div className="mb-4">
                            <label className="form-label fw-medium">Email Address</label>
                            <input
                              type="email"
                              className="form-control form-control-lg"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="Enter your email"
                              required
                            />
                          </div>
                          <div className="d-flex gap-3">
                            <button 
                              type="submit" 
                              className="btn btn-primary-custom px-4"
                              disabled={saving}
                            >
                              {saving ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                  Saving...
                                </>
                              ) : (
                                'Save Changes'
                              )}
                            </button>
                            <button 
                              type="button" 
                              className="btn btn-light px-4"
                              onClick={fetchUserProfile}
                              disabled={saving}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* Account Tab */}
                  {activeTab === 'account' && (
                    <div>
                      {/* Change Password */}
                      <div className="card border-0 shadow-sm mb-4">
                        <div className="card-body p-4">
                          <h3 className="h5 fw-semibold mb-4">Change Password</h3>
                          <form onSubmit={handlePasswordSubmit}>
                            <div className="mb-3">
                              <label className="form-label fw-medium">Current Password</label>
                              <input
                                type="password"
                                className="form-control form-control-lg"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleInputChange}
                                placeholder="Enter current password"
                                required
                              />
                            </div>
                            <div className="mb-3">
                              <label className="form-label fw-medium">New Password</label>
                              <input
                                type="password"
                                className="form-control form-control-lg"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleInputChange}
                                placeholder="Enter new password (min. 6 characters)"
                                required
                              />
                            </div>
                            <div className="mb-4">
                              <label className="form-label fw-medium">Confirm New Password</label>
                              <input
                                type="password"
                                className="form-control form-control-lg"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                placeholder="Confirm new password"
                                required
                              />
                            </div>
                            <button 
                              type="submit" 
                              className="btn btn-primary-custom px-4"
                              disabled={saving}
                            >
                              {saving ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                  Updating...
                                </>
                              ) : (
                                'Update Password'
                              )}
                            </button>
                          </form>
                        </div>
                      </div>

                      {/* Delete Account */}
                      <div className="card border-0 shadow-sm border-danger">
                        <div className="card-body p-4">
                          <h3 className="h5 fw-semibold text-danger mb-3">
                            <i className="bi bi-exclamation-triangle me-2"></i>
                            Danger Zone
                          </h3>
                          <p className="text-muted mb-3">
                            Once you delete your account, there is no going back. All your data will be permanently removed.
                          </p>
                          <button 
                            className="btn btn-danger px-4"
                            onClick={handleDeleteAccount}
                            disabled={saving}
                          >
                            {saving ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Deleting...
                              </>
                            ) : (
                              <>
                                <i className="bi bi-trash me-2"></i>
                                Delete Account
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notifications Tab */}
                  {activeTab === 'notifications' && (
                    <div className="card border-0 shadow-sm">
                      <div className="card-body p-4">
                        <h3 className="h5 fw-semibold mb-4">Notification Preferences</h3>
                        <form onSubmit={handleNotificationsSubmit}>
                          <div className="notification-item mb-4 pb-4 border-bottom">
                            <div className="d-flex justify-content-between align-items-start">
                              <div className="flex-grow-1">
                                <h4 className="h6 fw-semibold mb-1">Email Notifications</h4>
                                <p className="text-muted small mb-0">
                                  Receive updates and summaries via email
                                </p>
                              </div>
                              <div className="form-check form-switch">
                                <input
                                  className="form-check-input custom-switch"
                                  type="checkbox"
                                  role="switch"
                                  id="emailNotifications"
                                  name="emailNotifications"
                                  checked={formData.emailNotifications}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="notification-item mb-4 pb-4 border-bottom">
                            <div className="d-flex justify-content-between align-items-start">
                              <div className="flex-grow-1">
                                <h4 className="h6 fw-semibold mb-1">Task Reminders</h4>
                                <p className="text-muted small mb-0">
                                  Get notified about upcoming and overdue tasks
                                </p>
                              </div>
                              <div className="form-check form-switch">
                                <input
                                  className="form-check-input custom-switch"
                                  type="checkbox"
                                  role="switch"
                                  id="taskReminders"
                                  name="taskReminders"
                                  checked={formData.taskReminders}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="notification-item mb-4">
                            <div className="d-flex justify-content-between align-items-start">
                              <div className="flex-grow-1">
                                <h4 className="h6 fw-semibold mb-1">Habit Reminders</h4>
                                <p className="text-muted small mb-0">
                                  Daily reminders to maintain your habits
                                </p>
                              </div>
                              <div className="form-check form-switch">
                                <input
                                  className="form-check-input custom-switch"
                                  type="checkbox"
                                  role="switch"
                                  id="habitReminders"
                                  name="habitReminders"
                                  checked={formData.habitReminders}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                          </div>

                          <button 
                            type="submit" 
                            className="btn btn-primary-custom px-4"
                            disabled={saving}
                          >
                            {saving ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Saving...
                              </>
                            ) : (
                              'Save Preferences'
                            )}
                          </button>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar Info */}
              <div className="col-lg-4">
                <div className="card border-0 shadow-sm">
                  <div className="card-body p-4">
                    <h3 className="h6 fw-semibold text-uppercase text-muted mb-3">
                      <i className="bi bi-info-circle me-2"></i>
                      Quick Tips
                    </h3>
                    <ul className="list-unstyled mb-0">
                      <li className="mb-3 pb-3 border-bottom">
                        <div className="d-flex gap-3">
                          <i className="bi bi-shield-check text-primary-purple fs-5"></i>
                          <div>
                            <div className="fw-semibold small mb-1">Keep Your Account Secure</div>
                            <p className="text-muted small mb-0">
                              Use a strong password and change it regularly.
                            </p>
                          </div>
                        </div>
                      </li>
                      <li className="mb-3 pb-3 border-bottom">
                        <div className="d-flex gap-3">
                          <i className="bi bi-bell text-primary-purple fs-5"></i>
                          <div>
                            <div className="fw-semibold small mb-1">Stay Updated</div>
                            <p className="text-muted small mb-0">
                              Enable notifications to never miss important updates.
                            </p>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="d-flex gap-3">
                          <i className="bi bi-person-badge text-primary-purple fs-5"></i>
                          <div>
                            <div className="fw-semibold small mb-1">Complete Your Profile</div>
                            <p className="text-muted small mb-0">
                              Keep your information up to date for a personalized experience.
                            </p>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default ProfileSettings;