// server/routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  toggleTaskCompletion,
  deleteTask,
  getTaskAnalytics,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
router.get('/analytics', protect, getTaskAnalytics);

router.route('/').get(protect, getTasks).post(protect, createTask);
router
  .route('/:id')
  .get(protect, getTaskById)
  .put(protect, updateTask)
  .delete(protect, deleteTask);
router.patch('/:id/toggle', protect, toggleTaskCompletion);

module.exports = router;