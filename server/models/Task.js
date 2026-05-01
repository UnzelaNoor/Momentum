// server/models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please add a task title'],
      trim: true,
    },
    category: {
      type: String,
      default: 'New Task',
      trim: true,
    },
    dueDate: {
      type: String, // We'll store as string like "Today", "Tomorrow", "Oct 25, 2024"
      default: 'Today',
    },
    priority: {
      type: String,
      enum: ['LOW', 'MED', 'HIGH'],
      default: 'MED',
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
taskSchema.index({ user: 1, completed: 1 });

module.exports = mongoose.model('Task', taskSchema);