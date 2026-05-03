import React, { useState, useEffect } from 'react';
import Sidebar from '../Components/Sidebar';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { getTasks, createTask, deleteTask as deleteTaskAPI, toggleTask } from '../services/taskService';
import '../Styles/theme.css';
import './TaskPage.css';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [newTask, setNewTask] = useState('');
  const [newTaskDate, setNewTaskDate] = useState('Today');
  const [newTaskPriority, setNewTaskPriority] = useState('MED');
  const [filter, setFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPriorityPicker, setShowPriorityPicker] = useState(false);

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await getTasks();
      setTasks(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const response = await createTask({
        title: newTask,
        priority: newTaskPriority,
        dueDate: newTaskDate,
      });
      
      setTasks([response.data, ...tasks]);
      setNewTask('');
      setNewTaskDate('Today');
      setNewTaskPriority('MED');
      setShowDatePicker(false);
      setShowPriorityPicker(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create task');
      console.error('Error creating task:', err);
    }
  };

  const handleToggleTask = async (id) => {
    try {
      const response = await toggleTask(id);
      setTasks(tasks.map(task => 
        task._id === id ? response.data : task
      ));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update task');
      console.error('Error toggling task:', err);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await deleteTaskAPI(id);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete task');
      console.error('Error deleting task:', err);
    }
  };

  const togglePriorityFilter = (priority) => {
    if (priorityFilter.includes(priority)) {
      setPriorityFilter(priorityFilter.filter(p => p !== priority));
    } else {
      setPriorityFilter([...priorityFilter, priority]);
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending' && task.completed) return false;
    if (filter === 'completed' && !task.completed) return false;
    if (priorityFilter.length > 0 && !priorityFilter.includes(task.priority)) return false;
    return true;
  });

  const completionRate = tasks.length > 0 
    ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) 
    : 0;

  const overdueTasks = [
    { id: 'o1', title: 'Send project brief to curators', dueDate: 'Yesterday, 5:00 PM' },
    { id: 'o2', title: 'Weekly sync with engineering', dueDate: 'Oct 24th' }
  ];

  const upcomingTasks = [
    { id: 'u1', title: 'Brand Identity Refresh', dueDate: 'Tomorrow, Oct 23', icon: 'bi-calendar' },
    { id: 'u2', title: 'Portfolio Review', dueDate: 'Monday, Oct 25', icon: 'bi-briefcase' }
  ];

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
      <div className="tasks-page">
        <Sidebar activePage="checklist" />
        <div className="main-content-area">
          <Navbar activePage="tasks" />
          <div className="d-flex justify-content-center align-items-center flex-grow-1">
            <div className="alert alert-danger">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
              <button className="btn btn-sm btn-primary-custom ms-3" onClick={fetchTasks}>
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
    <div className="tasks-page">
      <Sidebar activePage="checklist" />

      <div className="main-content-area">
        <Navbar activePage="tasks" />

        <div className="tasks-container">
          <div className="container-fluid px-4 py-5">
            {/* Hero Section */}
            <div className="tasks-hero mb-5">
              <div>
                <h1 className="display-5 fw-semibold mb-2">Focus, Breathe.</h1>
                <p className="text-muted mb-0">
                  You have {filteredTasks.filter(t => !t.completed).length} tasks remaining for today. Your focus is your greatest asset—nurture it.
                </p>
              </div>
              <div className="daily-velocity-card">
                <div className="velocity-label text-uppercase small text-muted mb-1">Daily Velocity</div>
                <div className="velocity-value display-4 fw-bold">{completionRate}%</div>
                <div className="velocity-subtitle small text-muted">completed</div>
                <div className="progress mt-3" style={{height: '8px'}}>
                  <div 
                    className="progress-bar bg-primary-purple" 
                    role="progressbar" 
                    style={{width: `${completionRate}%`}}
                  ></div>
                </div>
              </div>
            </div>

            <div className="row">
              {/* Left Column */}
              <div className="col-lg-8">
                {/* Add Task Input */}
                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-body p-4">
                    <form onSubmit={handleAddTask}>
                      <div className="d-flex gap-3 align-items-center">
                        <i className="bi bi-plus-circle fs-4 text-muted"></i>
                        <input
                          type="text"
                          className="form-control border-0 fs-5"
                          placeholder="Capture a new intention..."
                          value={newTask}
                          onChange={(e) => setNewTask(e.target.value)}
                          style={{boxShadow: 'none'}}
                        />
                        
                        {/* Calendar Button */}
                        <div className="position-relative">
                          <button 
                            type="button"
                            className={`btn btn-light rounded-circle p-2 ${showDatePicker ? 'active' : ''}`}
                            style={{width: '40px', height: '40px'}}
                            onClick={() => {
                              setShowDatePicker(!showDatePicker);
                              setShowPriorityPicker(false);
                            }}
                          >
                            <i className="bi bi-calendar"></i>
                          </button>
                          
                          {showDatePicker && (
                            <div className="dropdown-menu show position-absolute p-3" style={{top: '45px', right: '0', minWidth: '280px'}}>
                              <div className="mb-2">
                                <label className="form-label small fw-semibold mb-2">Select Date</label>
                                <input
                                  type="date"
                                  className="form-control"
                                  min={new Date().toISOString().split('T')[0]}
                                  onChange={(e) => {
                                    if (e.target.value) {
                                      const selectedDate = new Date(e.target.value);
                                      const today = new Date();
                                      today.setHours(0, 0, 0, 0);
                                      
                                      const tomorrow = new Date(today);
                                      tomorrow.setDate(tomorrow.getDate() + 1);
                                      
                                      if (selectedDate.getTime() === today.getTime()) {
                                        setNewTaskDate('Today');
                                      } else if (selectedDate.getTime() === tomorrow.getTime()) {
                                        setNewTaskDate('Tomorrow');
                                      } else {
                                        const formatted = selectedDate.toLocaleDateString('en-US', {
                                          month: 'short',
                                          day: 'numeric',
                                          year: 'numeric'
                                        });
                                        setNewTaskDate(formatted);
                                      }
                                    }
                                  }}
                                />
                              </div>
                              <div className="d-flex gap-2">
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-secondary flex-grow-1"
                                  onClick={() => {
                                    setNewTaskDate('Today');
                                    setShowDatePicker(false);
                                  }}
                                >
                                  Today
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-secondary flex-grow-1"
                                  onClick={() => {
                                    setNewTaskDate('Tomorrow');
                                    setShowDatePicker(false);
                                  }}
                                >
                                  Tomorrow
                                </button>
                              </div>
                              <div className="text-end mt-2">
                                <button
                                  type="button"
                                  className="btn btn-sm btn-primary-custom"
                                  onClick={() => setShowDatePicker(false)}
                                >
                                  Done
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Priority Flag Button */}
                        <div className="position-relative">
                          <button 
                            type="button"
                            className={`btn btn-light rounded-circle p-2 ${showPriorityPicker ? 'active' : ''}`}
                            style={{width: '40px', height: '40px'}}
                            onClick={() => {
                              setShowPriorityPicker(!showPriorityPicker);
                              setShowDatePicker(false);
                            }}
                          >
                            <i className={`bi bi-flag-fill ${
                              newTaskPriority === 'HIGH' ? 'text-danger' : 
                              newTaskPriority === 'MED' ? 'text-warning' : 
                              'text-primary'
                            }`}></i>
                          </button>
                          
                          {showPriorityPicker && (
                            <div className="dropdown-menu show position-absolute" style={{top: '45px', right: '0', minWidth: '150px'}}>
                              <button 
                                type="button"
                                className="dropdown-item d-flex align-items-center justify-content-between" 
                                onClick={() => {
                                  setNewTaskPriority('HIGH');
                                  setShowPriorityPicker(false);
                                }}
                              >
                                <span><i className="bi bi-flag-fill text-danger me-2"></i>High</span>
                                {newTaskPriority === 'HIGH' && <i className="bi bi-check2"></i>}
                              </button>
                              <button 
                                type="button"
                                className="dropdown-item d-flex align-items-center justify-content-between" 
                                onClick={() => {
                                  setNewTaskPriority('MED');
                                  setShowPriorityPicker(false);
                                }}
                              >
                                <span><i className="bi bi-flag-fill text-warning me-2"></i>Medium</span>
                                {newTaskPriority === 'MED' && <i className="bi bi-check2"></i>}
                              </button>
                              <button 
                                type="button"
                                className="dropdown-item d-flex align-items-center justify-content-between" 
                                onClick={() => {
                                  setNewTaskPriority('LOW');
                                  setShowPriorityPicker(false);
                                }}
                              >
                                <span><i className="bi bi-flag-fill text-primary me-2"></i>Low</span>
                                {newTaskPriority === 'LOW' && <i className="bi bi-check2"></i>}
                              </button>
                            </div>
                          )}
                        </div>

                        <button type="submit" className="btn btn-primary-custom px-4">
                          Add Task
                        </button>
                      </div>
                      
                      {/* Show selected date and priority */}
                      {(newTaskDate !== 'Today' || newTaskPriority !== 'MED') && (
                        <div className="d-flex gap-2 mt-3 ms-5">
                          {newTaskDate !== 'Today' && (
                            <span className="badge bg-light text-dark">
                              <i className="bi bi-calendar me-1"></i>{newTaskDate}
                            </span>
                          )}
                          {newTaskPriority !== 'MED' && (
                            <span className={`badge ${
                              newTaskPriority === 'HIGH' ? 'bg-danger' : 
                              newTaskPriority === 'LOW' ? 'bg-primary' : 
                              'bg-warning'
                            }`}>
                              <i className="bi bi-flag-fill me-1"></i>{newTaskPriority}
                            </span>
                          )}
                        </div>
                      )}
                    </form>
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="btn-group" role="group">
                    <button 
                      className={`btn ${filter === 'all' ? 'btn-dark' : 'btn-outline-secondary'}`}
                      onClick={() => setFilter('all')}
                    >
                      All
                    </button>
                    <button 
                      className={`btn ${filter === 'pending' ? 'btn-dark' : 'btn-outline-secondary'}`}
                      onClick={() => setFilter('pending')}
                    >
                      Pending
                    </button>
                    <button 
                      className={`btn ${filter === 'completed' ? 'btn-dark' : 'btn-outline-secondary'}`}
                      onClick={() => setFilter('completed')}
                    >
                      Completed
                    </button>
                  </div>

                  <div className="d-flex gap-2 align-items-center">
                    <span className="small text-muted me-2">FILTER:</span>
                    <button 
                      className={`btn btn-sm rounded-pill ${priorityFilter.includes('HIGH') ? 'btn-danger' : 'btn-outline-danger'}`}
                      onClick={() => togglePriorityFilter('HIGH')}
                    >
                      <i className="bi bi-flag-fill me-1"></i>
                    </button>
                    <button 
                      className={`btn btn-sm rounded-pill ${priorityFilter.includes('MED') ? 'btn-warning' : 'btn-outline-warning'}`}
                      onClick={() => togglePriorityFilter('MED')}
                    >
                      <i className="bi bi-flag-fill me-1"></i>
                    </button>
                    <button 
                      className={`btn btn-sm rounded-pill ${priorityFilter.includes('LOW') ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => togglePriorityFilter('LOW')}
                    >
                      <i className="bi bi-flag-fill me-1"></i>
                    </button>
                  </div>
                </div>

                {/* Tasks List */}
                <div className="mb-4">
                  <h3 className="h6 fw-semibold text-uppercase text-muted mb-3">TODAY</h3>
                  <div className="tasks-list">
                    {filteredTasks.length > 0 ? (
                      filteredTasks.map(task => (
                        <div key={task._id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                          <div className="form-check">
                            <input
                              className="form-check-input task-checkbox"
                              type="checkbox"
                              id={`task-${task._id}`}
                              checked={task.completed}
                              onChange={() => handleToggleTask(task._id)}
                            />
                            <label className="form-check-label flex-grow-1" htmlFor={`task-${task._id}`}>
                              <div className="task-content">
                                <div className="task-title">{task.title}</div>
                                <div className="task-meta">
                                  <span className="task-category">{task.category}</span>
                                  <span className="task-time">
                                    <i className="bi bi-clock me-1"></i>
                                    {task.dueDate}
                                  </span>
                                </div>
                              </div>
                            </label>
                            <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
                              {task.priority}
                            </span>
                            <button 
                              className="btn btn-sm btn-light rounded-circle ms-2"
                              onClick={() => handleDeleteTask(task._id)}
                              style={{width: '32px', height: '32px'}}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-5 text-muted">
                        <i className="bi bi-inbox fs-1 d-block mb-3" style={{opacity: 0.3}}></i>
                        <p>No tasks found. Add a new task to get started!</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="col-lg-4">
                {/* Overdue Tasks */}
                <div className="card border-0 shadow-sm mb-4 overdue-card">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h3 className="h6 fw-semibold text-danger mb-0">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        OVERDUE
                      </h3>
                      <span className="badge bg-danger">{overdueTasks.length} MISSED</span>
                    </div>
                    <div className="d-flex flex-column gap-3">
                      {overdueTasks.map(task => (
                        <div key={task.id} className="overdue-item">
                          <div className="fw-medium">{task.title}</div>
                          <div className="small text-muted">Due: {task.dueDate}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Upcoming Tasks */}
                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-body p-4">
                    <h3 className="h6 fw-semibold text-uppercase text-muted mb-3">UPCOMING</h3>
                    <div className="d-flex flex-column gap-3">
                      {upcomingTasks.map(task => (
                        <div key={task.id} className="upcoming-item">
                          <div className="d-flex align-items-center gap-3">
                            <div className="upcoming-icon">
                              <i className={task.icon}></i>
                            </div>
                            <div className="flex-grow-1">
                              <div className="fw-medium">{task.title}</div>
                              <div className="small text-muted">{task.dueDate}</div>
                            </div>
                            <i className="bi bi-chevron-right text-muted"></i>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Motivational Quote */}
                <div className="card border-0 quote-card">
                  <div className="card-body p-4 text-center">
                    <i className="bi bi-lightbulb fs-2 mb-3 d-block"></i>
                    <p className="fst-italic mb-3">
                      "Focus is not about saying yes to one thing, but saying no to a hundred other good ideas."
                    </p>
                    <div className="small text-uppercase fw-semibold">Steve Jobs</div>
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

export default Tasks;