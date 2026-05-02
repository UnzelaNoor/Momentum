const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
  updateNotificationPreferences,
  deleteUserAccount,
  getUserStats,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.put('/password', protect, updateUserPassword);
router.put('/notifications', protect, updateNotificationPreferences);
router.delete('/account', protect, deleteUserAccount);
router.get('/stats', protect, getUserStats);

module.exports = router;