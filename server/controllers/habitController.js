const Habit = require('../models/Habit');
const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: habits.length,
      data: habits,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

const getHabitById = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found',
      });
    }

    // Make sure user owns the habit
    if (habit.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this habit',
      });
    }

    res.status(200).json({
      success: true,
      data: habit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

const createHabit = async (req, res) => {
  try {
    const { name, goal, frequency, type, challenge, challengeType, challengeGoal } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a habit name',
      });
    }

    const habit = await Habit.create({
      user: req.user._id,
      name,
      goal: goal || 'No goal set',
      frequency: frequency || 'Daily',
      type: type || 'binary',
      challenge: challenge || '',
      challengeType: challengeType || '',
      challengeGoal: challengeGoal || '',
      currentStreak: 0,
      longestStreak: 0,
      completionRate: 0,
      last30Days: Array(30).fill(false),
      weeklyProgress: {
        Mon: false,
        Tue: false,
        Wed: false,
        Thu: false,
        Fri: false,
        Sat: false,
        Sun: false,
      },
    });

    res.status(201).json({
      success: true,
      data: habit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

const updateHabit = async (req, res) => {
  try {
    let habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found',
      });
    }

    // Make sure user owns the habit
    if (habit.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this habit',
      });
    }

    habit = await Habit.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: habit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

const updateHabitProgress = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found',
      });
    }

    // Make sure user owns the habit
    if (habit.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this habit',
      });
    }

    const { day, value } = req.body; // day: 'Mon', 'Tue', etc., value: true/false

    // Update weekly progress
    if (day && habit.weeklyProgress.hasOwnProperty(day)) {
      habit.weeklyProgress[day] = value;
    }

    // Update last30Days (shift array and add new value at the end)
    // For simplicity, we update the last element (today)
    habit.last30Days[29] = value;

    // Calculate new streak
    let streak = 0;
    for (let i = habit.last30Days.length - 1; i >= 0; i--) {
      if (habit.last30Days[i]) {
        streak++;
      } else {
        break;
      }
    }
    habit.currentStreak = streak;

    // Update longest streak
    if (streak > habit.longestStreak) {
      habit.longestStreak = streak;
    }

    // Calculate completion rate (percentage of completed days in last 30)
    const completedDays = habit.last30Days.filter((day) => day === true).length;
    habit.completionRate = Math.round((completedDays / 30) * 100);

    await habit.save();

    res.status(200).json({
      success: true,
      data: habit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found',
      });
    }

    // Make sure user owns the habit
    if (habit.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this habit',
      });
    }

    await habit.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Habit deleted successfully',
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

const getHabitAnalytics = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id });

    // Calculate statistics
    const totalHabits = habits.length;
    const activeHabits = habits.filter((h) => h.currentStreak > 0).length;
    const longestStreak = Math.max(...habits.map((h) => h.longestStreak), 0);

    // Weekly mastery (average completion this week)
    const weeklyMastery = Math.round(
      (habits.reduce((acc, h) => {
        const completed = Object.values(h.weeklyProgress).filter(Boolean).length;
        return acc + completed / 7;
      }, 0) /
        (habits.length || 1)) *
        100
    );

    // Habit distribution (binary vs percentage)
    const binaryHabits = habits.filter((h) => h.type === 'binary').length;
    const percentageHabits = habits.filter((h) => h.type === 'percentage').length;

    const distribution = [
      {
        category: 'Work Focus',
        percentage: totalHabits > 0 ? Math.round((binaryHabits / totalHabits) * 100) : 0,
        color: '#2D2A45',
      },
      {
        category: 'Self Care',
        percentage: totalHabits > 0 ? Math.round((percentageHabits / totalHabits) * 100) : 0,
        color: '#B8B3D4',
      },
    ];

    res.status(200).json({
      success: true,
      data: {
        totalHabits,
        activeHabits,
        longestStreak,
        weeklyMastery,
        distribution,
        habits: habits.map((h) => ({
          name: h.name,
          currentStreak: h.currentStreak,
          weeklyProgress: h.weeklyProgress,
          last30Days: h.last30Days,
        })),
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
  getHabits,
  getHabitById,
  createHabit,
  updateHabit,
  updateHabitProgress,
  deleteHabit,
  getHabitAnalytics,
};