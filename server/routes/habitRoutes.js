const express = require('express');
const router = express.Router();
const {
  getHabits,
  getHabitById,
  createHabit,
  updateHabit,
  updateHabitProgress,
  deleteHabit,
  getHabitAnalytics,
} = require('../controllers/habitController');
const { protect } = require('../middleware/authMiddleware');
router.get('/analytics', protect, getHabitAnalytics);
router.route('/').get(protect, getHabits).post(protect, createHabit);
router
  .route('/:id')
  .get(protect, getHabitById)
  .put(protect, updateHabit)
  .delete(protect, deleteHabit);
router.patch('/:id/progress', protect, updateHabitProgress);

module.exports = router;