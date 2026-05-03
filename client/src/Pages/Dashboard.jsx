import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from '../Components/Sidebar';
import Navbar from '../Components/Navbar';
import '../Styles/theme.css';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('User');
    const [notes, setNotes] = useState([]);
    const [todayTasks, setTodayTasks] = useState([]);
    const [stats, setStats] = useState({ avgTaskCompletion: 0, longestStreak: 0, tasksCreatedThisWeek: 0 });

    const token = localStorage.getItem('token');
    const authHeader = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    useEffect(() => {
        const fetchData = async () => {
            // Fetch user profile
            const userRes = await fetch('http://localhost:5000/api/users/profile', { headers: authHeader });
            const userData = await userRes.json();
            setUsername(userData.data.name);

            // Fetch notes (max 2)
            const notesRes = await fetch('http://localhost:5000/api/notes', { headers: authHeader });
            const notesData = await notesRes.json();
            setNotes(notesData.slice(0, 2));

            // Fetch tasks (max 3)
            const tasksRes = await fetch('http://localhost:5000/api/tasks', { headers: authHeader });
            const tasksData = await tasksRes.json();
            setTodayTasks(Array.isArray(tasksData) ? tasksData.slice(0, 3) : []);

            // Fetch user stats
            const statsRes = await fetch('http://localhost:5000/api/users/stats', { headers: authHeader });
            const statsData = await statsRes.json();
            if (statsData.success) setStats(statsData.data);
        };
        fetchData();
    }, []);

    return (
        <div className="dashboard-page">
            <Sidebar activePage="home" />
            <div className="main-content-area">
                <Navbar activePage="dashboard" />
                <div className="container-fluid px-4 py-5">

                    {/* Greeting */}
                    <div className="mb-5">
                        <h1 className="display-5 fw-semibold mb-1">Good morning, {username}.</h1>
                        <p className="text-muted">Your sanctuary is ready.</p>
                    </div>

                    {/* Quick Actions */}
                    <div className="row g-3 mb-5">
                        <div className="col-md-4">
                            <div className="quick-action-card" onClick={() => navigate('/notes')}>
                                <div className="quick-action-icon">
                                    <i className="bi bi-file-earmark-text"></i>
                                </div>
                                <span>New Note</span>
                                <i className="bi bi-chevron-right ms-auto"></i>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="quick-action-card" onClick={() => navigate('/tasks')}>
                                <div className="quick-action-icon dark">
                                    <i className="bi bi-check2-circle"></i>
                                </div>
                                <span>Add Task</span>
                                <i className="bi bi-chevron-right ms-auto"></i>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="quick-action-card" onClick={() => navigate('/habits')}>
                                <div className="quick-action-icon dark">
                                    <i className="bi bi-check2-circle"></i>
                                </div>
                                <span>Add Habit</span>
                                <i className="bi bi-chevron-right ms-auto"></i>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="quick-action-card" onClick={() => navigate('/analytics')}>
                                <div className="quick-action-icon">
                                    <i className="bi bi-graph-up"></i>
                                </div>
                                <span>View Analytics</span>
                                <i className="bi bi-chevron-right ms-auto"></i>
                            </div>
                        </div>
                    </div>

                    <div className="row g-4">
                        {/* Today's Focus */}
                        <div className="col-lg-8">
                            <div className="card border-0 shadow-sm mb-4">
                                <div className="card-body p-4">
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <h5 className="fw-semibold mb-0">Today's Focus</h5>
                                        <span className="small text-muted text-uppercase">{todayTasks.filter(t => !t.completed).length} Priority Tasks</span>
                                    </div>
                                    <div className="d-flex flex-column gap-3">
                                        {todayTasks.length > 0 ? todayTasks.map(task => (
                                            <div key={task._id} className={`task-row ${task.completed ? 'completed' : ''}`}>
                                                <div className={`task-dot ${task.completed ? 'done' : ''}`}></div>
                                                <div className="flex-grow-1">
                                                    <div className="task-row-title">{task.title}</div>
                                                    <div className="task-row-meta">{task.category} · {task.time}</div>
                                                </div>
                                                <span className={`priority-badge priority-${task.priority?.toLowerCase()}`}>{task.priority}</span>
                                            </div>
                                        )) : (
                                            <p className="text-muted small">No tasks for today.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Recent Notes */}
                            <div className="card border-0 shadow-sm">
                                <div className="card-body p-4">
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <h5 className="fw-semibold mb-0">Recent Notes</h5>
                                        <span className="small text-muted" style={{cursor:'pointer'}} onClick={() => navigate('/notes')}>View All</span>
                                    </div>
                                    <div className="row g-3">
                                        {notes.map(note => (
                                            <div key={note._id} className="col-md-6">
                                                <div className="note-preview-card">
                                                    <div className="d-flex justify-content-between mb-2">
                                                        <span className="note-preview-category">{note.category || 'No Category'}</span>
                                                        <span className="note-preview-date">{note.lastEdited}</span>
                                                    </div>
                                                    <div className="note-preview-title">{note.title}</div>
                                                    <div className="note-preview-text" dangerouslySetInnerHTML={{ __html: note.text }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="col-lg-4">
                            {/* Weekly Insight */}
                            <div className="card border-0 shadow-sm mb-4 weekly-insight-card">
                                <div className="card-body p-4">
                                    <h5 className="fw-semibold mb-1">Weekly Insight</h5>
                                    <p className="small text-muted mb-3">Avg task completion: {stats.avgTaskCompletion}% · Longest streak: {stats.longestStreak} days</p>
                                    <div className="insight-bars">
                                        {['M','T','W','T','F','S','S'].map((day, i) => (
                                            <div key={i} className="insight-bar-col">
                                                <div className="insight-bar" style={{height: `${[40,60,45,80,90,30,20][i]}%`, backgroundColor: i === 4 ? 'var(--primary-purple)' : 'var(--light-purple)'}}></div>
                                                <span className="insight-day">{day}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Track Habit */}
                            <div className="card border-0 shadow-sm">
                                <div className="card-body p-4">
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <h5 className="fw-semibold mb-0">Track Habit</h5>
                                        <span className="small text-muted" style={{cursor:'pointer'}} onClick={() => navigate('/habits')}>View All</span>
                                    </div>
                                    <p className="small text-muted mb-3">Stay consistent with your daily habits.</p>
                                    <button className="btn btn-primary-custom w-100" onClick={() => navigate('/habits')}>
                                        Go to Habits
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="page-footer">
                    <div className="container-fluid px-4 py-4">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <strong className="d-block small">Momentum</strong>
                                <p className="mb-0 text-muted" style={{fontSize: '0.75rem'}}>© 2024 Momentum Productivity. Designed for Focus.</p>
                            </div>
                            <div className="d-flex gap-4">
                                <a href="/privacy" className="text-muted text-decoration-none small">Privacy</a>
                                <a href="/terms" className="text-muted text-decoration-none small">Terms</a>
                                <a href="/support" className="text-muted text-decoration-none small">Support</a>
                                <a href="/api" className="text-muted text-decoration-none small">API</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Dashboard;