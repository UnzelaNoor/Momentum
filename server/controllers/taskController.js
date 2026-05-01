const Task = require('../models/Task');
const getTasks = async (req, res) => {
  try {
    const { completed, priority } = req.query;

    // Build filter
    const filter = { user: req.user._id };

    if (completed !== undefined) {
      filter.completed = completed === 'true';
    }

    if (priority) {
      filter.priority = priority;
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Make sure user owns the task
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this task',
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, category, dueDate, priority } = req.body;

    // Validation
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a task title',
      });
    }

    const task = await Task.create({
      user: req.user._id,
      title,
      category: category || 'New Task',
      dueDate: dueDate || 'Today',
      priority: priority || 'MED',
      completed: false,
    });

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

const updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Make sure user owns the task
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task',
      });
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

const toggleTaskCompletion = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Make sure user owns the task
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task',
      });
    }

    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date() : null;

    await task.save();

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Make sure user owns the task
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this task',
      });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

const getTaskAnalytics = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });

    // Total tasks
    const totalTasks = tasks.length;
    
    // Completed tasks
    const completedTasks = tasks.filter((t) => t.completed).length;
    
    // Completion rate
    const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0;

    // Tasks by priority
    const highPriorityTasks = tasks.filter((t) => t.priority === 'HIGH' && !t.completed).length;
    const medPriorityTasks = tasks.filter((t) => t.priority === 'MED' && !t.completed).length;
    const lowPriorityTasks = tasks.filter((t) => t.priority === 'LOW' && !t.completed).length;

    // Weekly completion trend (mock data for now - you can implement actual logic)
    const weeklyTrend = [
      { day: 'MON', value: 65 },
      { day: 'TUE', value: 78 },
      { day: 'WED', value: 95 },
      { day: 'THU', value: 82 },
      { day: 'FRI', value: 70 },
      { day: 'SAT', value: 55 },
      { day: 'SUN', value: 60 },
    ];

    res.status(200).json({
      success: true,
      data: {
        totalTasks,
        completedTasks,
        completionRate: parseFloat(completionRate),
        pendingTasks: totalTasks - completedTasks,
        byPriority: {
          high: highPriorityTasks,
          medium: medPriorityTasks,
          low: lowPriorityTasks,
        },
        weeklyTrend,
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
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  toggleTaskCompletion,
  deleteTask,
  getTaskAnalytics,
};