import React, { useState, useEffect } from 'react';
import Sidebar from '../Components/Sidebar';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { getTaskAnalytics } from '../services/taskService';
import { getHabitAnalytics } from '../services/habitService';
import { getUserStats } from '../services/userService';
import '../Styles/theme.css';
import './Analytics.css';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('weekly');
  
  const [stats, setStats] = useState({
    avgTaskCompletion: 0,
    avgTaskCompletionChange: 0,
    longestStreak: 0,
    currentStreak: 0,
    tasksCreatedThisWeek: 0,
    tasksInsight: ''
  });

  const [taskTrends, setTaskTrends] = useState({
    weekly: [],
    monthly: []
  });

  const [habitDistribution, setHabitDistribution] = useState([]);
  const [habitAdherence, setHabitAdherence] = useState({
    habits: [],
    legend: ['Low', 'Medium', 'High']
  });

  // Fetch all analytics data on mount
  useEffect(() => {
    fetchAllAnalytics();
  }, []);

  const fetchAllAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch task analytics
      const taskResponse = await getTaskAnalytics();
      
      // Fetch habit analytics
      const habitResponse = await getHabitAnalytics();
      
      // Fetch user stats
      const userResponse = await getUserStats();

      // Set stats
      setStats({
        avgTaskCompletion: userResponse.data.avgTaskCompletion || 0,
        avgTaskCompletionChange: 12, // You can calculate this from historical data
        longestStreak: userResponse.data.longestStreak || 0,
        currentStreak: habitResponse.data.longestStreak || 0,
        tasksCreatedThisWeek: userResponse.data.tasksCreatedThisWeek || 0,
        tasksInsight: 'Based on your productivity patterns'
      });

      // Set task trends
      if (taskResponse.data.weeklyTrend) {
        setTaskTrends({
          weekly: taskResponse.data.weeklyTrend,
          monthly: [
            { day: 'Week 1', value: 72 },
            { day: 'Week 2', value: 85 },
            { day: 'Week 3', value: 78 },
            { day: 'Week 4', value: 90 }
          ]
        });
      }

      // Set habit distribution
      if (habitResponse.data.distribution) {
        setHabitDistribution(habitResponse.data.distribution);
      }

      // Set habit adherence
      if (habitResponse.data.habits) {
        const habitsData = habitResponse.data.habits.slice(0, 3).map(habit => ({
          name: habit.name,
          data: habit.last30Days.map(day => day ? 1 : 0)
        }));
        
        setHabitAdherence({
          habits: habitsData,
          legend: ['Low', 'Medium', 'High']
        });
      }

      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch analytics');
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border" style={{color: '#2D2A45'}} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-page">
        <Sidebar activePage="insights" />
        <div className="main-content-area">
          <Navbar activePage="analytics" />
          <div className="d-flex justify-content-center align-items-center flex-grow-1">
            <div className="alert alert-danger">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
              <button className="btn btn-sm btn-primary-custom ms-3" onClick={fetchAllAnalytics}>
                Retry
              </button>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-page">
      <Sidebar activePage="insights" />

      <div className="main-content-area">
        <Navbar activePage="analytics" />

        <div className="analytics-container">
          <div className="container-fluid px-4 py-5">
            {/* Header */}
            <div className="mb-5">
              <h1 className="display-5 fw-semibold mb-2">Analytics Board</h1>
              <p className="text-muted mb-0">
                Your progress visualized in the digital sanctuary.
              </p>
            </div>

            {/* Top Stats Row */}
            <div className="row g-4 mb-5">
              {/* Avg Task Completion Rate */}
              <div className="col-md-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body p-4">
                    <div className="small text-muted text-uppercase fw-semibold mb-2">
                      AVG. TASK COMPLETION RATE
                    </div>
                    <div className="d-flex align-items-baseline gap-2 mb-2">
                      <div className="display-4 fw-bold" style={{color: '#2D2A45'}}>
                        {stats.avgTaskCompletion}%
                      </div>
                      <div className="badge bg-success">
                        <i className="bi bi-arrow-up me-1"></i>+{stats.avgTaskCompletionChange}% from last week
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Longest Streak */}
              <div className="col-md-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body p-4">
                    <div className="small text-muted text-uppercase fw-semibold mb-2">
                      LONGEST STREAK
                    </div>
                    <div className="d-flex align-items-baseline gap-2 mb-2">
                      <div className="display-4 fw-bold" style={{color: '#2D2A45'}}>
                        {stats.longestStreak} Days
                      </div>
                    </div>
                    <div className="small text-muted">
                      <i className="bi bi-lightning-fill text-warning me-1"></i>
                      Current: {stats.currentStreak} Days
                    </div>
                  </div>
                </div>
              </div>

              {/* Tasks Created This Week */}
              <div className="col-md-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body p-4">
                    <div className="small text-muted text-uppercase fw-semibold mb-2">
                      TASKS CREATED THIS WEEK
                    </div>
                    <div className="d-flex align-items-baseline gap-2 mb-2">
                      <div className="display-4 fw-bold" style={{color: '#2D2A45'}}>
                        {stats.tasksCreatedThisWeek}
                      </div>
                    </div>
                    <div className="small text-muted">
                      <i className="bi bi-calendar-check me-1"></i>
                      {stats.tasksInsight}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-4">
              {/* Left Column - Charts */}
              <div className="col-lg-8">
                {/* Task Completion Trends */}
                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h3 className="h5 fw-semibold mb-0">Task Completion Trends</h3>
                      <div className="btn-group btn-group-sm" role="group">
                        <button 
                          className={`btn ${timeRange === 'weekly' ? 'btn-dark' : 'btn-outline-secondary'}`}
                          onClick={() => setTimeRange('weekly')}
                        >
                          Weekly
                        </button>
                        <button 
                          className={`btn ${timeRange === 'monthly' ? 'btn-dark' : 'btn-outline-secondary'}`}
                          onClick={() => setTimeRange('monthly')}
                        >
                          Monthly
                        </button>
                      </div>
                    </div>

                    {/* Bar Chart */}
                    <div className="chart-container" style={{height: '300px'}}>
                      <svg width="100%" height="100%" viewBox="0 0 700 300" preserveAspectRatio="xMidYMid meet">
                        {/* Grid lines */}
                        <line x1="50" y1="250" x2="650" y2="250" stroke="#E0E0E0" strokeWidth="1"/>
                        <line x1="50" y1="200" x2="650" y2="200" stroke="#E0E0E0" strokeWidth="1" strokeDasharray="4"/>
                        <line x1="50" y1="150" x2="650" y2="150" stroke="#E0E0E0" strokeWidth="1" strokeDasharray="4"/>
                        <line x1="50" y1="100" x2="650" y2="100" stroke="#E0E0E0" strokeWidth="1" strokeDasharray="4"/>
                        <line x1="50" y1="50" x2="650" y2="50" stroke="#E0E0E0" strokeWidth="1" strokeDasharray="4"/>

                        {/* Bars */}
                        {taskTrends[timeRange].map((item, index) => {
                          const barWidth = 60;
                          const spacing = 600 / taskTrends[timeRange].length;
                          const x = 80 + (index * spacing);
                          const barHeight = (item.value / 100) * 200;
                          const y = 250 - barHeight;
                          
                          return (
                            <g key={index}>
                              {/* Bar */}
                              <rect
                                x={x}
                                y={y}
                                width={barWidth}
                                height={barHeight}
                                fill={item.day === 'WED' || item.day === 'Week 4' ? '#2D2A45' : '#E8E6F0'}
                                rx="4"
                              />
                              {/* Value on top */}
                              <text
                                x={x + barWidth/2}
                                y={y - 5}
                                textAnchor="middle"
                                fontSize="12"
                                fill="#6B6B6B"
                              >
                                {item.value}%
                              </text>
                              {/* Day label */}
                              <text
                                x={x + barWidth/2}
                                y="270"
                                textAnchor="middle"
                                fontSize="12"
                                fill="#6B6B6B"
                                fontWeight="500"
                              >
                                {item.day}
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Overall Dashboard - Habit Adherence */}
                <div className="card border-0 shadow-sm">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div>
                        <h3 className="h5 fw-semibold mb-1">Overall Dashboard</h3>
                        <p className="small text-muted mb-0">Monthly habit adherence visualization across all categories.</p>
                      </div>
                      <div className="d-flex gap-3 align-items-center">
                        <div className="d-flex align-items-center gap-2">
                          <div className="legend-dot" style={{backgroundColor: '#E8E6F0'}}></div>
                          <span className="small">Low</span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <div className="legend-dot" style={{backgroundColor: '#B8B3D4'}}></div>
                          <span className="small">Medium</span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <div className="legend-dot" style={{backgroundColor: '#2D2A45'}}></div>
                          <span className="small">High</span>
                        </div>
                      </div>
                    </div>

                    {/* Habit Grid */}
                    <div className="habit-grid-container">
                      {habitAdherence.habits.length > 0 ? (
                        habitAdherence.habits.map((habit, habitIndex) => (
                          <div key={habitIndex} className="habit-row mb-3">
                            <div className="habit-name small fw-medium text-muted mb-2">
                              {habit.name}
                            </div>
                            <div className="habit-dots d-flex gap-1">
                              {habit.data.map((value, dayIndex) => (
                                <div
                                  key={dayIndex}
                                  className="habit-dot"
                                  style={{
                                    backgroundColor: value === 1 ? '#2D2A45' : value === 0.5 ? '#B8B3D4' : '#E8E6F0'
                                  }}
                                  title={`Day ${dayIndex + 1}`}
                                ></div>
                              ))}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-muted">
                          <p>No habit data available. Start tracking habits to see analytics!</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Pie Chart */}
              <div className="col-lg-4">
                <div className="card border-0 shadow-sm">
                  <div className="card-body p-4">
                    <h3 className="h5 fw-semibold mb-4">Habit Distribution</h3>
                    
                    {habitDistribution.length > 0 ? (
                      <>
                        {/* Donut Chart */}
                        <div className="donut-chart-container text-center mb-4">
                          <svg width="250" height="250" viewBox="0 0 250 250">
                            <circle
                              cx="125"
                              cy="125"
                              r="90"
                              fill="none"
                              stroke="#E8E6F0"
                              strokeWidth="50"
                            />
                            <circle
                              cx="125"
                              cy="125"
                              r="90"
                              fill="none"
                              stroke="#2D2A45"
                              strokeWidth="50"
                              strokeDasharray={`${(habitDistribution[0].percentage / 100) * 565.48} 565.48`}
                              strokeDashoffset="141.37"
                              transform="rotate(-90 125 125)"
                            />
                            <text
                              x="125"
                              y="115"
                              textAnchor="middle"
                              fontSize="36"
                              fontWeight="bold"
                              fill="#2D2A45"
                            >
                              {habitDistribution[0].percentage}%
                            </text>
                            <text
                              x="125"
                              y="140"
                              textAnchor="middle"
                              fontSize="14"
                              fill="#6B6B6B"
                            >
                              FOCUS
                            </text>
                          </svg>
                        </div>

                        {/* Legend */}
                        <div className="distribution-legend">
                          {habitDistribution.map((item, index) => (
                            <div key={index} className="d-flex justify-content-between align-items-center mb-3 p-3 rounded" style={{backgroundColor: '#F5F4F8'}}>
                              <div className="d-flex align-items-center gap-3">
                                <div 
                                  className="legend-square" 
                                  style={{backgroundColor: item.color}}
                                ></div>
                                <span className="fw-medium">{item.category}</span>
                              </div>
                              <span className="badge bg-light text-dark">{item.percentage}%</span>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-5 text-muted">
                        <i className="bi bi-pie-chart fs-1 mb-3 d-block" style={{opacity: 0.3}}></i>
                        <p>No habit distribution data available.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Analytics;