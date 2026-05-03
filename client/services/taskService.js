import API from '../utils/api';

// Get all tasks
export const getTasks = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await API.get(`/tasks?${params}`);
  return response.data;
};

// Get single task
export const getTaskById = async (id) => {
  const response = await API.get(`/tasks/${id}`);
  return response.data;
};

// Create new task
export const createTask = async (taskData) => {
  const response = await API.post('/tasks', taskData);
  return response.data;
};

// Update task
export const updateTask = async (id, taskData) => {
  const response = await API.put(`/tasks/${id}`, taskData);
  return response.data;
};

// Toggle task completion
export const toggleTask = async (id) => {
  const response = await API.patch(`/tasks/${id}/toggle`);
  return response.data;
};

// Delete task
export const deleteTask = async (id) => {
  const response = await API.delete(`/tasks/${id}`);
  return response.data;
};

// Get task analytics
export const getTaskAnalytics = async () => {
  const response = await API.get('/tasks/analytics');
  return response.data;
};