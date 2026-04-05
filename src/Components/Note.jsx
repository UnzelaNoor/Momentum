// Import styles
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import "./Note.css"
import { useState} from 'react';


function Note({id, title, text, lastEdited, category, onDelete, onSave, onEdit}) {
    const handleDeleteNote = () => onDelete(id)

    const [selectedCategory, setSelectedCategory] = useState(category || '');
    return (
        <Card onClick={() => onEdit({id, title, text, lastEdited, category})} style={{cursor: 'pointer'}}>
            <Card.Header className='bg-light-purple'>             
                <Form.Select 
                    className="form-control select-category" 
                    style={{color: 'var(--text-)'}}
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="">No Category</option>
                    <option value="work">Work</option>
                    <option value="home">Home</option>
                    <option value="study">Study</option>
                    <option value="health">Health</option>
                </Form.Select>
            </Card.Header>
            <Card.Body style={{backgroundColor: 'var(--white)', color: 'var(--text-dark)'}}>
                <Card.Title>{title}</Card.Title>
                <Card.Text dangerouslySetInnerHTML={{ __html: text }} />
            </Card.Body>
            <Card.Footer className='bg-light-purple d-flex justify-content-between align-items-center' style={{color: 'var(--text-light)'}}>
                <small>{lastEdited}</small>
                <button 
                    className="btn btn-sm btn-outline-danger rounded-circle p-2"
                    onClick={(e) => { e.stopPropagation(); handleDeleteNote(id); }}
                    title="Delete habit"
                    style={{width: '36px', height: '36px'}}
                >
                <i className="bi bi-trash"></i>
                </button>
            </Card.Footer>
        </Card>
  );
}

export default Note;


/* Styling Note: 

Card.Footer
* d-flex — makes the element a flexbox container
* justify-content-between — pushes flex items to opposite ends with all available space between them
* align-items-center — vertically centers both items within the footer height
* Why no md, etc. for responsiveness? md/sm breakpoints are only needed for Bootstrap's grid (Rows and Cols). Flexbox utilities like justify-content-between are not grid-based. They just describe how items are arranged inside a container regardless of screen size

*/