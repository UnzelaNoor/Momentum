const createTransporter = require('../config/emailConfig');

const sendTaskReminder = async (userEmail, userName, task) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Momentum App" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: ` Reminder: "${task.title}" is due soon!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #F5F4F8;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background-color: white;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #2D2A45 0%, #4A4568 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
              font-weight: 600;
            }
            .content {
              padding: 40px 30px;
            }
            .task-card {
              background-color: #F5F4F8;
              border-left: 4px solid #2D2A45;
              padding: 20px;
              margin: 20px 0;
              border-radius: 8px;
            }
            .task-title {
              font-size: 18px;
              font-weight: 600;
              color: #2D2A45;
              margin-bottom: 10px;
            }
            .task-details {
              color: #6B6B6B;
              font-size: 14px;
              margin: 5px 0;
            }
            .priority-badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 12px;
              font-size: 12px;
              font-weight: 600;
              margin-top: 10px;
            }
            .priority-HIGH {
              background-color: #dc3545;
              color: white;
            }
            .priority-MED {
              background-color: #ffc107;
              color: #000;
            }
            .priority-LOW {
              background-color: #0d6efd;
              color: white;
            }
            .cta-button {
              display: inline-block;
              background-color: #2D2A45;
              color: white;
              padding: 14px 32px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              margin-top: 20px;
            }
            .footer {
              background-color: #F5F4F8;
              padding: 20px;
              text-align: center;
              color: #6B6B6B;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Task Reminder</h1>
            </div>
            <div class="content">
              <p>Hi <strong>${userName}</strong>,</p>
              <p>Just a friendly reminder that you have an upcoming task that needs your attention:</p>
              
              <div class="task-card">
                <div class="task-title">${task.title}</div>
                <div class="task-details">
                   Due: <strong>${task.dueDate}</strong>
                </div>
                <div class="task-details">
                   Category: ${task.category}
                </div>
                <span class="priority-badge priority-${task.priority}">
                  ${task.priority} PRIORITY
                </span>
              </div>
              
              <p>Stay focused and keep up the great work! 💪</p>
              
              <center>
                <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/tasks" class="cta-button">
                  View All Tasks
                </a>
              </center>
            </div>
            <div class="footer">
              <p>You're receiving this email because you have task reminders enabled.</p>
              <p>
                <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/settings" style="color: #2D2A45;">
                  Manage notification preferences
                </a>
              </p>
              <p>© 2024 Momentum Productivity. Designed for Focus.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(` Email sent to ${userEmail}: ${info.messageId}`); 
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASSWORD exists:", !!process.env.EMAIL_PASSWORD);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(' Error sending email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendTaskReminder,
};