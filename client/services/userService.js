import API from '../utils/api';

// Get user profile
export const getUserProfile = async () => {
  const response = await API.get('/users/profile');
  return response.data;
};

// Update user profile
export const updateUserProfile = async (userData) => {
  const response = await API.put('/users/profile', userData);
  return response.data;
};

// Update password
export const updatePassword = async (passwordData) => {
  const response = await API.put('/users/password', passwordData);
  return response.data;
};

// Update notification preferences
export const updateNotifications = async (notificationData) => {
  const response = await API.put('/users/notifications', notificationData);
  return response.data;
};

// Delete account
export const deleteAccount = async () => {
  const response = await API.delete('/users/account');
  return response.data;
};

// Get user stats (for Analytics page)
export const getUserStats = async () => {
  const response = await API.get('/users/stats');
  return response.data;
};