// server/models/Habit.js
const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please add a habit name'],
      trim: true,
    },
    goal: {
      type: String,
      default: 'No goal set',
      trim: true,
    },
    frequency: {
      type: String,
      enum: ['Daily', 'Weekly (3x)', 'Weekly (5x)', 'Custom'],
      default: 'Daily',
    },
    type: {
      type: String,
      enum: ['binary', 'percentage'],
      default: 'binary',
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    completionRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    // Store last 30 days as array of booleans
    last30Days: {
      type: [Boolean],
      default: () => Array(30).fill(false),
    },
    // Weekly progress (Mon-Sun)
    weeklyProgress: {
      Mon: { type: Boolean, default: false },
      Tue: { type: Boolean, default: false },
      Wed: { type: Boolean, default: false },
      Thu: { type: Boolean, default: false },
      Fri: { type: Boolean, default: false },
      Sat: { type: Boolean, default: false },
      Sun: { type: Boolean, default: false },
    },
    challenge: {
      type: String,
      default: '',
    },
    challengeType: {
      type: String,
      default: '',
    },
    challengeGoal: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
habitSchema.index({ user: 1 });

module.exports = mongoose.model('Habit', habitSchema);