import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Note from './Note';

function NotesList({notes, onDelete, onSave, onEdit}) {
  return (
    <Container className='bg-light-custom'>
      <Row xs={1} sm={2} md={3} lg={4} className="align-items-start g-3">
        {notes.map((note) => (
          <Col key={note.id}>
            <Note {...note} onDelete={onDelete} onSave={onSave} onEdit={onEdit} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default NotesList;

// {...note}
// js{ id: 1, title: "My Note", content: "Hello", date: "4/4/2026" }
//        becomes
// jsx<Note id={1} title="My Note" content="Hello" date="4/4/2026" />
//        due to "..."