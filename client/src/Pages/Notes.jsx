// Import Hooks
import { useState, useEffect } from 'react';
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
    const [notes, setNotes] = useState([]);
    const [showEditor, setShowEditor] = useState(false);
    const [editingNote, setEditingNote] = useState(null);

    // Grab token from local storage
    const token = localStorage.getItem('token');
    const authHeader = { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
    };

    // Fetch the user's notes on page load
    useEffect(() => {
        const fetchNotes = async () => {
            const response = await fetch('http://localhost:5000/api/notes', {
                headers: authHeader
            });
            const data = await response.json();
            setNotes(data);
        };
        fetchNotes();
    }, []);

    // Define functions that will be passed as props to children
    const addNote = async (newNote) => {
        const response = await fetch('http://localhost:5000/api/notes', {
            method: 'POST',
            headers: authHeader,
            body: JSON.stringify(newNote)
        });
        const data = await response.json();
        setNotes(prev => [...prev, data]);
    };

    const deleteNote = async (id) => {
        await fetch(`http://localhost:5000/api/notes/${id}`, {
            method: 'DELETE',
            headers: authHeader
        });
        setNotes(prev => prev.filter(note => note._id !== id));
    };

    const saveNote = async (id, updatedNote) => {
        const response = await fetch(`http://localhost:5000/api/notes/${id}`, {
            method: 'PATCH',
            headers: authHeader,
            body: JSON.stringify(updatedNote)
        });
        const data = await response.json();
        setNotes(prev => prev.map(note => note._id === id ? data : note));
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
                            onSave={(updated) => saveNote(editingNote._id, updated)}
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