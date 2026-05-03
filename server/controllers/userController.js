const User = require('../models/User');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken');

// @desc  Register new user
// @route POST /api/users
// @access Public
// @desc  Register new user
// @route POST /api/users/register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, pwd } = req.body

    if (!username || !email || !pwd) {
        res.status(400)
        throw new Error('Please add all fields.')
    }

    const userExists = await User.findOne({ email })
    if (userExists) {
        res.status(400)
        throw new Error('This user already exists.')
    }

    const user = await User.create({
        name: username,
        email,
        password: pwd
    })

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data.')
    }
})

// @desc Authenticate a user
// @route POST /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, pwd } = req.body

    const user = await User.findOne({ email }).select('+password')

    if (user && (await user.matchPassword(pwd))) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid credentials.')
    }
})

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn: '30d'
  })
}

const getUserProfile = async (req, res) => {
  try {
    // req.user is set by authMiddleware
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update fields
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        emailNotifications: updatedUser.emailNotifications,
        taskReminders: updatedUser.taskReminders,
        habitReminders: updatedUser.habitReminders,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

const updateUserPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current password and new password',
      });
    }

    // Get user with password field
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check current password
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Validate new password length
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters',
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

const updateNotificationPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update notification preferences
    if (req.body.emailNotifications !== undefined) {
      user.emailNotifications = req.body.emailNotifications;
    }
    if (req.body.taskReminders !== undefined) {
      user.taskReminders = req.body.taskReminders;
    }
    if (req.body.habitReminders !== undefined) {
      user.habitReminders = req.body.habitReminders;
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: {
        emailNotifications: user.emailNotifications,
        taskReminders: user.taskReminders,
        habitReminders: user.habitReminders,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

const deleteUserAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Delete user's tasks, habits, etc. (cascade delete)
    const Task = require('../models/Task');
    const Habit = require('../models/Habit');

    await Task.deleteMany({ user: req.user._id });
    await Habit.deleteMany({ user: req.user._id });

    // Delete user
    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

const getUserStats = async (req, res) => {
  try {
    const Task = require('../models/Task');
    const Habit = require('../models/Habit');

    const tasks = await Task.find({ user: req.user._id });
    const habits = await Habit.find({ user: req.user._id });

    // Calculate stats
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.completed).length;
    const avgTaskCompletion = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0;

    const longestStreak = Math.max(...habits.map((h) => h.longestStreak), 0);

    // Count notes created this week (you don't have notes, so we'll use tasks)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const tasksThisWeek = tasks.filter((t) => new Date(t.createdAt) >= oneWeekAgo).length;

    res.status(200).json({
      success: true,
      data: {
        avgTaskCompletion: parseFloat(avgTaskCompletion),
        longestStreak,
        tasksCreatedThisWeek: tasksThisWeek,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
  updateNotificationPreferences,
  deleteUserAccount,
  getUserStats,
  registerUser,
  loginUser,
};