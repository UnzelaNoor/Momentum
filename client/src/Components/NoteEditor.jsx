// Import Hooks
import { useState, useEffect } from 'react';
// Import Tiptap
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
// Import CSS
import './NoteEditor.css';

function NoteEditor({ note, onSave, onClose }) {
    // Create States
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const editor = useEditor({
        extensions: [StarterKit],
        content: '',
    });

    useEffect(() => {
        if (editor && note) {
            editor.commands.setContent(note.text || '');
            setTitle(note.title || '');
            setCategory(note.category || '');
        }
    }, [editor, note]);

    const handleSave = () => {
        if (!title.trim()) return;
        onSave({
            title,
            category,
            text: editor.getHTML(),
            lastEdited: new Date().toLocaleDateString('en-GB')
        });
        onClose();
    };

    return (
        <div className="note-editor-overlay">
            <div className="note-editor-container">

                {/* Top Bar */}
                <div className="note-editor-topbar">
                    <span className="note-editor-brand">MOMENTUM / NOTES</span>
                    <div className="note-editor-actions">
                        <button className="btn-editor-save" onClick={handleSave}>Save</button>
                        <button className="btn-editor-close" onClick={onClose}>Close ×</button>
                    </div>
                </div>

                <div className="note-editor-body">

                    {/* Title */}
                    <input
                        className="note-editor-title"
                        placeholder="Untitled Note"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    {/* Category */}
                    <select
                        className="note-editor-category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">No Category</option>
                        <option value="Work">Work</option>
                        <option value="Home">Home</option>
                        <option value="Study">Study</option>
                        <option value="Health">Health</option>
                    </select>

                    {/* Toolbar */}
                    <div className="note-editor-toolbar">
                        <button
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            className={editor?.isActive('bold') ? 'toolbar-btn active' : 'toolbar-btn'}
                            title="Bold"
                        >
                            <b>B</b>
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            className={editor?.isActive('italic') ? 'toolbar-btn active' : 'toolbar-btn'}
                            title="Italic"
                        >
                            <i>I</i>
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleStrike().run()}
                            className={editor?.isActive('strike') ? 'toolbar-btn active' : 'toolbar-btn'}
                            title="Strikethrough"
                        >
                            <s>S</s>
                        </button>
                        <div className="toolbar-divider" />
                        <button
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            className={editor?.isActive('bulletList') ? 'toolbar-btn active' : 'toolbar-btn'}
                            title="Bullet List"
                        >
                            • List
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                            className={editor?.isActive('orderedList') ? 'toolbar-btn active' : 'toolbar-btn'}
                            title="Numbered List"
                        >
                            1. List
                        </button>
                    </div>

                    {/* Editor */}
                    <EditorContent editor={editor} className="note-editor-content" />

                </div>
            </div>
        </div>
    );
}

export default NoteEditor;