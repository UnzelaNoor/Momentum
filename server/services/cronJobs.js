const cron = require('node-cron');
const Task = require('../models/Task');
const User = require('../models/User');
const { sendTaskReminder } = require('./emailService');


const isTaskDueWithin3Days = (dueDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Handle special cases
  if (dueDate === 'Today') {
    return true;
  }
  
  if (dueDate === 'Tomorrow') {
    return true;
  }

  try {
    const taskDate = new Date(dueDate);
    taskDate.setHours(0, 0, 0, 0);

    const diffTime = taskDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 3;
  } catch (error) {
    console.error('Error parsing date:', dueDate, error);
    return false;
  }
};

const checkTaskReminders = async () => {
  try {
    console.log('Checking for tasks due within 3 days...');

    const tasks = await Task.find({
      completed: false,
    }).populate('user', 'name email taskReminders');

    let emailsSent = 0;
    let tasksChecked = 0;

    for (const task of tasks) {
      tasksChecked++;


      if (isTaskDueWithin3Days(task.dueDate)) {

        if (task.user && task.user.taskReminders) {
          await sendTaskReminder(task.user.email, task.user.name, task);
          emailsSent++;
          console.log(`   📧Sent reminder for: "${task.title}" to ${task.user.email}`);
        }
      }
    }

    console.log(` Checked ${tasksChecked} tasks, sent ${emailsSent} reminder emails`);
  } catch (error) {
    console.error(' Error in checkTaskReminders:', error);
  }
};

// Schedule cron job
const startCronJobs = () => {
  cron.schedule('30 9 * * *', () => {
    console.log(' Running daily task reminder check (9:00 AM)...');
    checkTaskReminders();
  });

  console.log(' Cron job scheduled successfully');
  console.log('   - Task reminders: Every day at 9:00 AM');
  console.log('   - Criteria: Tasks due within 3 days');
};

module.exports = {
  startCronJobs,
  checkTaskReminders, 
};