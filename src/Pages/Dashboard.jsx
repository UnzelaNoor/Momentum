import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../Components/Sidebar';
import Navbar from '../Components/Navbar';
import '../Styles/theme.css';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const username = location.state?.username || 'User';

    const recentNotes = [
        { id: 1, category: 'Work', title: 'Scrum Meeting', preview: 'Discussed scalability options.', lastEdited: 'Oct 24' },
        { id: 2, category: 'Study', title: 'Book List: Q4 Reads', preview: '1. Deep Work 2. Designing for Emotion 3. The...', date: 'Oct 22' },
    ];

    const todayTasks = [
        { id: 1, title: 'Refine Design System Documentation', category: 'Project Sanctuary', time: '2:00 PM', priority: 'HIGH', completed: false },
        { id: 2, title: 'Weekly Performance Review', category: 'Analytics', time: '4:30 PM', priority: 'MED', completed: false },
        { id: 3, title: 'Morning Deep Work Session', category: 'Productivity', time: 'Completed', priority: 'LOW', completed: true },
    ];

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
                                        {todayTasks.map(task => (
                                            <div key={task.id} className={`task-row ${task.completed ? 'completed' : ''}`}>
                                                <div className={`task-dot ${task.completed ? 'done' : ''}`}></div>
                                                <div className="flex-grow-1">
                                                    <div className="task-row-title">{task.title}</div>
                                                    <div className="task-row-meta">{task.category} · {task.time}</div>
                                                </div>
                                                <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
                                            </div>
                                        ))}
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
                                        {recentNotes.map(note => (
                                            <div key={note.id} className="col-md-6">
                                                <div className="note-preview-card">
                                                    <div className="d-flex justify-content-between mb-2">
                                                        <span className="note-preview-category">{note.category}</span>
                                                        <span className="note-preview-date">{note.date}</span>
                                                    </div>
                                                    <div className="note-preview-title">{note.title}</div>
                                                    <div className="note-preview-text">{note.preview}</div>
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
                                    <p className="small text-muted mb-3">Your completion rate is up by 14% compared to last week.</p>
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