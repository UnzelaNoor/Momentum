// src/Pages/ProfileSettings.jsx
import React, { useState } from 'react';
import Sidebar from '../Components/Sidebar';
import Navbar from '../Components/Navbar'; 
import Footer from '../Components/Footer';
import '../Styles/theme.css';
import './ProfileSettings.css';

const ProfileSettings = () => {
  const [formData, setFormData] = useState({
    name: 'Julian',
    email: 'julian@momentum.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailNotifications: true,
    taskReminders: true,
    habitReminders: false
  });

  const [activeTab, setActiveTab] = useState('profile');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Settings saved successfully!');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      console.log('Account deleted');
    }
  };

  return (
    <div className="profile-settings-page">
      {/* Reusable Sidebar */}
      <Sidebar activePage="settings" />

      {/* Main Content Area */}
      <div className="main-content-area">
        {/* Reusable Navbar */}
        <Navbar activePage="settings" />

        {/* Settings Content */}
        <div className="settings-container">
          <div className="container py-5">
            <div className="mb-4">
              <h2 className="display-6 fw-semibold mb-2">Settings</h2>
              <p className="text-muted">Manage your account preferences and settings</p>
            </div>

            {/* Tabs */}
            <ul className="nav nav-tabs settings-tabs mb-4">
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <i className="bi bi-person me-2"></i>Profile
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'account' ? 'active' : ''}`}
                  onClick={() => setActiveTab('account')}
                >
                  <i className="bi bi-shield-lock me-2"></i>Account
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'notifications' ? 'active' : ''}`}
                  onClick={() => setActiveTab('notifications')}
                >
                  <i className="bi bi-bell me-2"></i>Notifications
                </button>
              </li>
            </ul>

            {/* Tab Content */}
            <form onSubmit={handleSubmit}>
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="tab-content-area">
                  <div className="card border-0 shadow-sm mb-4">
                    <div className="card-body p-4">
                      <h3 className="h5 fw-semibold mb-3">Profile Information</h3>

                      <div className="mb-3">
                        <label htmlFor="name" className="form-label fw-medium">Full Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          className="form-control"
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="mb-4">
                        <label htmlFor="email" className="form-label fw-medium">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="form-control"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="border-top pt-4">
                        <button type="submit" className="btn btn-primary-custom px-4">
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Account Tab */}
              {activeTab === 'account' && (
                <div className="tab-content-area">
                  <div className="card border-0 shadow-sm mb-4">
                    <div className="card-body p-4">
                      <h3 className="h5 fw-semibold mb-2">Change Password</h3>
                      <p className="text-muted small mb-4">Update your password to keep your account secure</p>

                      <div className="mb-3">
                        <label htmlFor="currentPassword" className="form-label fw-medium">Current Password</label>
                        <input
                          type="password"
                          id="currentPassword"
                          name="currentPassword"
                          className="form-control"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="newPassword" className="form-label fw-medium">New Password</label>
                        <input
                          type="password"
                          id="newPassword"
                          name="newPassword"
                          className="form-control"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="mb-4">
                        <label htmlFor="confirmPassword" className="form-label fw-medium">Confirm New Password</label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          className="form-control"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="border-top pt-4">
                        <button type="submit" className="btn btn-primary-custom px-4">
                          Update Password
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="card border-0 shadow-sm">
                    <div className="card-body p-4">
                      <h3 className="h5 fw-semibold mb-2">Delete Account</h3>
                      <p className="text-muted small mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                      <button 
                        type="button" 
                        className="btn btn-primary-custom px-4"
                        onClick={handleDeleteAccount}
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="tab-content-area">
                  <div className="card border-0 shadow-sm">
                    <div className="card-body p-4">
                      <h3 className="h5 fw-semibold mb-2">Notification Preferences</h3>
                      <p className="text-muted small mb-4">Choose what notifications you want to receive</p>

                      <div className="notification-items">
                        <div className="notification-item">
                          <div>
                            <div className="form-label mb-1 fw-medium">Email Notifications</div>
                            <p className="text-muted small mb-0">Receive email updates about your activity</p>
                          </div>
                          <div className="form-check form-switch">
                            <input
                              type="checkbox"
                              id="emailNotifications"
                              name="emailNotifications"
                              className="form-check-input custom-switch"
                              role="switch"
                              checked={formData.emailNotifications}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>

                        <div className="notification-item">
                          <div>
                            <div className="form-label mb-1 fw-medium">Task Reminders</div>
                            <p className="text-muted small mb-0">Get notified about upcoming tasks and deadlines</p>
                          </div>
                          <div className="form-check form-switch">
                            <input
                              type="checkbox"
                              id="taskReminders"
                              name="taskReminders"
                              className="form-check-input custom-switch"
                              role="switch"
                              checked={formData.taskReminders}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>

                        <div className="notification-item">
                          <div>
                            <div className="form-label mb-1 fw-medium">Habit Reminders</div>
                            <p className="text-muted small mb-0">Daily reminders to maintain your habits</p>
                          </div>
                          <div className="form-check form-switch">
                            <input
                              type="checkbox"
                              id="habitReminders"
                              name="habitReminders"
                              className="form-check-input custom-switch"
                              role="switch"
                              checked={formData.habitReminders}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="border-top pt-4 mt-4">
                        <button type="submit" className="btn btn-primary-custom px-4">
                          Save Preferences
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>  
        <Footer />
      </div>
    </div>
  );
};

export default ProfileSettings;