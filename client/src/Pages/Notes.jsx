// Import Hooks
import { useState, useEffect } from 'react';
// Import nanoid for Random ID Generation
import { nanoid } from 'nanoid';
// Import Components
import NotesList from '../Components/NotesList';
import NoteEditor from '../Components/NoteEditor';
import Sidebar from '../Components/Sidebar';
import Navbar from '../Components/Navbar';
// Import CSS
import '../Styles/theme.css';
import './Notes.css'

const Notes = () => {
    // Make States
    const [notes, setNotes] = useState([
        {
            id: nanoid(),
            title: 'Morning Reflection',
            text: 'Today felt different. Woke up early and had time to think before the chaos began.',
            lastEdited: '01/04/2026',
            category: 'health'
        },
        {
            id: nanoid(),
            title: 'Project Ideas',
            text: 'Build a habit tracker that syncs with calendar. Also thinking about a focus timer with ambient sounds. Need to research existing solutions before starting.',
            lastEdited: '02/04/2026',
            category: 'work'
        },
        {
            id: nanoid(),
            title: 'Grocery List',
            text: 'Eggs, milk, bread, olive oil, pasta, tomatoes, spinach, chicken, yogurt, oats.',
            lastEdited: '02/04/2026',
            category: 'home'
        },
        {
            id: nanoid(),
            title: 'React Notes',
            text: 'useEffect runs after every render by default. Pass an empty array to run only on mount. Pass dependencies to run when they change. Cleanup function runs before the next effect.',
            lastEdited: '03/04/2026',
            category: 'study'
        },
        {
            id: nanoid(),
            title: 'Book Recommendations',
            text: 'Deep Work by Cal Newport.',
            lastEdited: '03/04/2026',
            category: 'home'
        },
        {
            id: nanoid(),
            title: 'Weekly Goals',
            text: 'Finish the notes module. Review authentication flow. Start on the dashboard analytics section. Write tests for the API endpoints. Update README.',
            lastEdited: '04/04/2026',
            category: 'work'
        },
        {
            id: nanoid(),
            title: 'Workout Plan',
            text: 'Mon: Push. Tue: Pull. Wed: Legs. Thu: Rest. Fri: Push. Sat: Pull. Sun: Rest. Increase weight by 5% every two weeks.',
            lastEdited: '04/04/2026',
            category: 'health'
        },
        {
            id: nanoid(),
            title: 'Meeting Notes',
            text: 'Discussed Q2 roadmap. Backend team needs two more weeks for the auth service. Frontend can proceed with mocked data in the meantime. Next sync on Friday.',
            lastEdited: '04/04/2026',
            category: 'work'
        },
        {
            id: nanoid(),
            title: 'Exam Topics',
            text: 'Databases.',
            lastEdited: '05/04/2026',
            category: 'study'
        },
        {
            id: nanoid(),
            title: 'Random Thought',
            text: 'What if productivity apps are themselves a form of procrastination? You spend so much time organizing your tasks that you never actually do them. Something to think about.',
            lastEdited: '05/04/2026',
            category: 'home'
        }
    ]);
    const [showEditor, setShowEditor] = useState(false);
    const [editingNote, setEditingNote] = useState(null);

    // Define functions that will be passed as props to children
    const addNote = (newNote) => {
        setNotes(prev => [...prev, { id: nanoid(), ...newNote }]);
    };

    const deleteNote = (id) => {
        setNotes(prev => prev.filter(note => note.id !== id));
    };

    const saveNote = (id, updatedNote) => {
        setNotes(prev => prev.map(note => 
            note.id === id ? { ...note, ...updatedNote, lastEdited: new Date().toLocaleDateString('en-GB') } : note
        ));
    };

    return (
        <div className='notes-page'> 
            <Sidebar activePage="notes" />
            <div className='main-content-area'>
                <Navbar activePage="notes" />
                <div className="container-fluid px-4 py-5">
                    <div className="notess-hero mb-5">
                        <div>
                            <h1 className="display-5 fw-semibold mb-2">My Notes</h1>
                            <p className="text-muted mb-0">Your digital sanctuary for captured thoughts and creative sparks. Organised for deep focus.</p>
                        </div> 
                    </div>
                    <button className="new-note-btn" onClick={() => setShowEditor(true)}>+</button>
                    <NotesList notes={notes} onDelete={deleteNote} onSave={saveNote} onEdit={setEditingNote}/>
                    {editingNote ? (
                        <NoteEditor
                            note={editingNote}
                            onSave={(updated) => saveNote(editingNote.id, updated)}
                            onClose={() => setEditingNote(null)}
                        />
                    ) : showEditor && (
                        <NoteEditor
                            onSave={addNote}
                            onClose={() => setShowEditor(false)}
                        />
                    )}
                </div>

                <footer className="page-footer">
                    <div className="container-fluid px-4 py-4">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <strong className="d-block small">Momentum</strong>
                                <p className="mb-0 text-muted" style={{fontSize: '0.75rem'}}>
                                    © 2024 Momentum Productivity. Designed for Focus.
                                </p>
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
}

export default Notes;