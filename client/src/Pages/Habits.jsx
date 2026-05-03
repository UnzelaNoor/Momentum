// client/src/Pages/Habits.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../Components/Sidebar';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { 
  getHabits, 
  createHabit, 
  deleteHabit as deleteHabitAPI, 
  updateHabitProgress 
} from '../services/habitService';
import '../Styles/theme.css';
import './Habits.css';

const Habits = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trackingMode, setTrackingMode] = useState('binary');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: '',
    goal: '',
    frequency: 'Daily',
    type: 'binary'
  });

  // Fetch habits on component mount
  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      setLoading(true);
      const response = await getHabits();
      setHabits(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch habits');
      console.error('Error fetching habits:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHabit = async (e) => {
    e.preventDefault();
    if (!newHabit.name.trim()) {
      alert('Please enter a habit name');
      return;
    }

    try {
      const response = await createHabit(newHabit);
      setHabits([...habits, response.data]);
      setNewHabit({ name: '', goal: '', frequency: 'Daily', type: 'binary' });
      setShowCreateModal(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create habit');
      console.error('Error creating habit:', err);
    }
  };

  const handleDeleteHabit = async (id) => {
    if (!window.confirm('Are you sure you want to delete this habit?')) return;

    try {
      await deleteHabitAPI(id);
      setHabits(habits.filter(h => h._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete habit');
      console.error('Error deleting habit:', err);
    }
  };

  const toggleHabitDay = async (habitId, day) => {
    const habit = habits.find(h => h._id === habitId);
    if (!habit) return;

    const newValue = !habit.weeklyProgress[day];

    try {
      const response = await updateHabitProgress(habitId, {
        day: day,
        value: newValue
      });
      
      setHabits(habits.map(h => 
        h._id === habitId ? response.data : h
      ));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update habit progress');
      console.error('Error updating habit:', err);
    }
  };

  const filteredHabits = habits.filter(h => h.type === trackingMode);
  const totalHabits = habits.length;
  const activeHabits = habits.filter(h => h.currentStreak > 0).length;
  const longestStreak = Math.max(...habits.map(h => h.longestStreak), 0);
  const weeklyMastery = Math.round((habits.reduce((acc, h) => {
    const completed = Object.values(h.weeklyProgress).filter(Boolean).length;
    return acc + (completed / 7);
  }, 0) / (habits.length || 1)) * 100);

  const renderLast30Days = (habit) => {
    return habit.last30Days.map((isCompleted, index) => (
      <div
        key={index}
        className={`day-dot ${isCompleted ? 'completed' : 'incomplete'}`}
        title={`Day ${index + 1}`}
      ></div>
    ));
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
      <div className="habits-page">
        <Sidebar activePage="habits" />
        <div className="main-content-area">
          <Navbar activePage="habits" />
          <div className="d-flex justify-content-center align-items-center flex-grow-1">
            <div className="alert alert-danger">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
              <button className="btn btn-sm btn-primary-custom ms-3" onClick={fetchHabits}>
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
    <div className="habits-page">
      <Sidebar activePage="habits" />

      <div className="main-content-area">
        <Navbar activePage="habits" />

        <div className="habits-container">
          <div className="container-fluid px-4 py-5">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-start mb-5">
              <div>
                <h1 className="display-5 fw-semibold mb-2">Your Rituals</h1>
                <p className="text-muted mb-0">
                  Cultivating consistency through mindful daily actions.
                </p>
              </div>
              <button className="btn btn-primary-custom px-4" onClick={() => setShowCreateModal(true)}>
                <i className="bi bi-plus-circle me-2"></i>Create New
              </button>
            </div>

            <div className="row">
              {/* Left Column */}
              <div className="col-lg-8">
                {/* Tracking Type Toggle */}
                <div className="mb-4">
                  <div className="btn-group" role="group">
                    <button 
                      className={`btn btn-outline-secondary ${trackingMode === 'binary' ? 'active' : ''}`}
                      onClick={() => setTrackingMode('binary')}
                    >
                      <i className="bi bi-check-circle me-2"></i>Binary Tracking
                    </button>
                    <button 
                      className={`btn btn-outline-secondary ${trackingMode === 'percentage' ? 'active' : ''}`}
                      onClick={() => setTrackingMode('percentage')}
                    >
                      <i className="bi bi-percent me-2"></i>Percentage Tracking
                    </button>
                  </div>
                </div>

                {/* Habit Cards */}
                <div className="habits-list">
                  {filteredHabits.length > 0 ? (
                    filteredHabits.map(habit => (
                      <div key={habit._id} className="card border-0 shadow-sm mb-4 habit-card">
                        <div className="card-body p-4">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div className="d-flex align-items-start gap-3">
                              <div className="habit-icon">
                                <i className={`bi ${
                                  habit.name.includes('Meditation') ? 'bi-circle' :
                                  habit.name.includes('Reading') ? 'bi-book' :
                                  'bi-bicycle'
                                }`}></i>
                              </div>
                              <div>
                                <h3 className="h5 fw-semibold mb-1">{habit.name}</h3>
                                <div className="d-flex gap-3 small text-muted">
                                  <span><i className="bi bi-target me-1"></i>{habit.goal}</span>
                                  <span><i className="bi bi-calendar-week me-1"></i>{habit.frequency}</span>
                                </div>
                              </div>
                            </div>
                            <div className="d-flex align-items-start gap-3">
                              <div className="text-end">
                                <div className="streak-badge">
                                  <div className="streak-number display-6 fw-bold">{habit.currentStreak}</div>
                                  <div className="streak-label small text-muted">DAY STREAK</div>
                                </div>
                              </div>
                              <button 
                                className="btn btn-sm btn-outline-danger rounded-circle p-2"
                                onClick={() => handleDeleteHabit(habit._id)}
                                title="Delete habit"
                                style={{width: '36px', height: '36px'}}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </div>

                          {/* Weekly Progress */}
                          <div className="weekly-progress mb-3">
                            <div className="d-flex justify-content-between small text-muted mb-2">
                              <span>Weekly Progress</span>
                              {habit.type === 'percentage' && (
                                <span className="fw-semibold">{habit.completionRate}%</span>
                              )}
                              <span className="text-end">M T W T F S S</span>
                            </div>
                            <div className="d-flex gap-2">
                              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                <button
                                  key={day}
                                  className={`week-day ${habit.weeklyProgress[day] ? 'completed' : ''}`}
                                  onClick={() => toggleHabitDay(habit._id, day)}
                                >
                                  <i className={`bi ${habit.weeklyProgress[day] ? 'bi-check-circle-fill' : 'bi-circle'}`}></i>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Percentage Progress Bar */}
                          {habit.type === 'percentage' && (
                            <div className="mb-3">
                              <div className="d-flex justify-content-between small mb-1">
                                <span className="text-muted">Monthly Progress</span>
                                <span className="fw-semibold">{habit.completionRate}%</span>
                              </div>
                              <div className="progress" style={{height: '8px'}}>
                                <div 
                                  className="progress-bar bg-primary-purple" 
                                  role="progressbar" 
                                  style={{width: `${habit.completionRate}%`}}
                                ></div>
                              </div>
                            </div>
                          )}

                          {/* Challenge Badge */}
                          {habit.challenge && (
                            <div className="challenge-badge mb-3">
                              <div className="d-flex align-items-center gap-2">
                                <i className="bi bi-trophy text-warning"></i>
                                <div className="flex-grow-1">
                                  <div className="fw-semibold small">{habit.challenge}</div>
                                  <div className="text-muted" style={{fontSize: '12px'}}>
                                    {habit.challengeType} • {habit.challengeGoal}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Last 30 Days Grid */}
                          <div className="last-30-days">
                            <div className="small text-muted mb-2">LAST 30 DAYS</div>
                            <div className="days-grid">
                              {renderLast30Days(habit)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-5">
                      <i className="bi bi-lightning fs-1 text-muted mb-3 d-block" style={{opacity: 0.3}}></i>
                      <h3 className="h5">No {trackingMode === 'binary' ? 'Binary' : 'Percentage'} Habits Yet</h3>
                      <p className="text-muted">Switch tracking mode or create a new habit to get started.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="col-lg-4">
                {/* Weekly Mastery Card */}
                <div className="card border-0 shadow-sm mb-4 mastery-card">
                  <div className="card-body p-4 text-center">
                    <h3 className="h6 fw-semibold text-uppercase text-muted mb-3">Weekly Mastery</h3>
                    <div className="display-4 fw-bold mb-2" style={{color: '#2D2A45'}}>{weeklyMastery}%</div>
                    <p className="small text-muted mb-3">
                      {weeklyMastery >= 70 ? "You're significantly more consistent this week. Keep going!" : "Keep building momentum. Every day counts."}
                    </p>
                    <div className="progress" style={{height: '6px'}}>
                      <div 
                        className="progress-bar bg-primary-purple" 
                        style={{width: `${weeklyMastery}%`}}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Habit Harmony Card */}
                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-body p-4">
                    <h3 className="h6 fw-semibold text-uppercase text-muted mb-3">Habit Harmony</h3>
                    <div className="harmony-chart mb-3">
                      <svg viewBox="0 0 200 100" style={{width: '100%', height: '120px'}}>
                        <rect x="20" y="70" width="20" height="30" fill="#E8E6F0" rx="4"/>
                        <rect x="50" y="50" width="20" height="50" fill="#E8E6F0" rx="4"/>
                        <rect x="80" y="20" width="20" height="80" fill="#2D2A45" rx="4"/>
                        <rect x="110" y="40" width="20" height="60" fill="#E8E6F0" rx="4"/>
                        <rect x="140" y="60" width="20" height="40" fill="#E8E6F0" rx="4"/>
                        <rect x="170" y="55" width="20" height="45" fill="#E8E6F0" rx="4"/>
                        
                        <text x="30" y="95" fontSize="10" fill="#6B6B6B" textAnchor="middle">Mon</text>
                        <text x="60" y="95" fontSize="10" fill="#6B6B6B" textAnchor="middle">Tue</text>
                        <text x="90" y="95" fontSize="10" fill="#6B6B6B" textAnchor="middle">Wed</text>
                        <text x="120" y="95" fontSize="10" fill="#6B6B6B" textAnchor="middle">Thu</text>
                        <text x="150" y="95" fontSize="10" fill="#6B6B6B" textAnchor="middle">Fri</text>
                        <text x="180" y="95" fontSize="10" fill="#6B6B6B" textAnchor="middle">Sat</text>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Global Insight Card */}
                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-body p-4">
                    <h3 className="h6 fw-semibold text-uppercase text-muted mb-3">
                      <i className="bi bi-bar-chart me-2"></i>Global Insight
                    </h3>
                    <div className="insight-item mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="small fw-medium">Total Habits</span>
                        <span className="badge bg-light text-dark">{totalHabits}</span>
                      </div>
                    </div>
                    <div className="insight-item mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="small fw-medium">Active Streaks</span>
                        <span className="badge bg-success">{activeHabits}</span>
                      </div>
                    </div>
                    <div className="insight-item">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="small fw-medium">Longest Streak</span>
                        <span className="badge bg-primary-purple text-white">{longestStreak} days</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Motivational Quote */}
                <div className="card border-0 quote-card">
                  <div className="card-body p-4">
                    <i className="bi bi-quote fs-1 mb-3 d-block opacity-25"></i>
                    <p className="mb-3 fst-italic">
                      We are what we repeatedly do. Excellence, then, is not an act, but a habit.
                    </p>
                    <div className="small text-uppercase fw-semibold opacity-75">Aristotle</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>

      {/* Create Habit Modal */}
      {showCreateModal && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-semibold">Create New Habit</h5>
                <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleCreateHabit}>
                  <div className="mb-3">
                    <label className="form-label fw-medium">Habit Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g., Morning Meditation"
                      value={newHabit.name}
                      onChange={(e) => setNewHabit({...newHabit, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-medium">Goal</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g., 30 Days, 5km per session"
                      value={newHabit.goal}
                      onChange={(e) => setNewHabit({...newHabit, goal: e.target.value})}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-medium">Frequency</label>
                    <select 
                      className="form-select"
                      value={newHabit.frequency}
                      onChange={(e) => setNewHabit({...newHabit, frequency: e.target.value})}
                    >
                      <option value="Daily">Daily</option>
                      <option value="Weekly (3x)">Weekly (3x)</option>
                      <option value="Weekly (5x)">Weekly (5x)</option>
                      <option value="Custom">Custom</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-medium">Tracking Type</label>
                    <div className="d-flex gap-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="type"
                          id="typeBinary"
                          value="binary"
                          checked={newHabit.type === 'binary'}
                          onChange={(e) => setNewHabit({...newHabit, type: e.target.value})}
                        />
                        <label className="form-check-label" htmlFor="typeBinary">
                          Binary (Yes/No)
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="type"
                          id="typePercentage"
                          value="percentage"
                          checked={newHabit.type === 'percentage'}
                          onChange={(e) => setNewHabit({...newHabit, type: e.target.value})}
                        />
                        <label className="form-check-label" htmlFor="typePercentage">
                          Percentage
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex gap-2 justify-content-end">
                    <button type="button" className="btn btn-light" onClick={() => setShowCreateModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary-custom">
                      Create Habit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Habits;