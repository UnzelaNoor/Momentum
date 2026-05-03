import API from '../utils/api';

// Get all habits
export const getHabits = async () => {
  const response = await API.get('/habits');
  return response.data;
};

// Get single habit
export const getHabitById = async (id) => {
  const response = await API.get(`/habits/${id}`);
  return response.data;
};

// Create new habit
export const createHabit = async (habitData) => {
  const response = await API.post('/habits', habitData);
  return response.data;
};

// Update habit
export const updateHabit = async (id, habitData) => {
  const response = await API.put(`/habits/${id}`, habitData);
  return response.data;
};

// Update habit progress (toggle day)
export const updateHabitProgress = async (id, progressData) => {
  const response = await API.patch(`/habits/${id}/progress`, progressData);
  return response.data;
};

// Delete habit
export const deleteHabit = async (id) => {
  const response = await API.delete(`/habits/${id}`);
  return response.data;
};

// Get habit analytics
export const getHabitAnalytics = async () => {
  const response = await API.get('/habits/analytics');
  return response.data;
};