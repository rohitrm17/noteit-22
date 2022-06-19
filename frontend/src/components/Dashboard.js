import React, { useEffect, useState } from 'react'
import { Container, Button, Row, Col, Card, Form, Alert, Modal } from 'react-bootstrap'
import axios from 'axios'

function Dashboard(props) {

    const [validated, setValidated] = useState(true);
    const [myNotes, setMyNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState('');
    const [newNoteHead, setNewNoteHead] = useState('');
    const [newNoteBody, setNewNoteBody] = useState('');
    const [show, setShow] = useState(false);
    const [delViewModal, setDelViewModal] = useState('');

    const addNote = async () => {
        if (newNoteHead.length === 0) {
            setValidated(false);
            return;
        }

        setValidated(true);

        try {
            const resp = await axios.post("/api/addnote", {
                noteHead: newNoteHead,
                noteBody: newNoteBody
            }, {
                withCredentials: true
            });
            setMyNotes([...myNotes, resp.data]);
            setShow(false);
            setNewNoteHead('');
            setNewNoteBody('');
        } catch (error) {
            window.location.href = "/error";
        }
    }

    const showDeleteViewAlert = (noteId, event, Idx) => {

        if (event.target.dataset.viewbtn) {
            setDelViewModal('1');
            setNewNoteHead(myNotes[Idx].noteHead);
            setNewNoteBody(myNotes[Idx].noteBody);
        }
        if (event.target.dataset.delbtn)
            setDelViewModal('2');
        setSelectedNote(noteId);
    }

    const deleteNote = async (noteId) => {
        try {
            const resp = await axios.delete(`/api/deletenote/${noteId}`, {
                withCredentials: true
            })
            const newNotes = myNotes.filter(oneNote => {
                if (oneNote.noteId === resp.data.noteId)
                    return false;
                return true;
            })
            setMyNotes(newNotes);
            setDelViewModal('');
            setSelectedNote('');
        } catch (error) {
            window.location.href = "/error";
        }
    }

    const updateNote = async (noteId) => {
        if (newNoteHead.length === 0) {
            setValidated(false);
            return;
        }

        setValidated(true);

        try {
            const resp = await axios.put(`/api/updatenote/${noteId}`, {
                noteHead: newNoteHead,
                noteBody: newNoteBody
            }, {
                withCredentials: true
            });
            myNotes[selectedNote].noteHead = resp.data.noteHead;
            myNotes[selectedNote].noteBody = resp.data.noteBody;
            setShow(false);
            setNewNoteHead('');
            setNewNoteBody('');
        } catch (error) {
            window.location.href = "/error";
        }
    }

    const handleClose = () => {
        setShow(false);
        setValidated(true);
        setDelViewModal('');
        setSelectedNote('');
        setNewNoteHead('');
        setNewNoteBody('');
    }

    const handleShow = () => {
        setShow(true);
        setSelectedNote('');
        setNewNoteHead('');
        setNewNoteBody('');
    }

    const handleUpdateShow = (Idx, event) => {

        if (event.target.dataset.delbtn || event.target.dataset.viewbtn) {
            return;
        }
        setShow(true);
        setSelectedNote(Idx);
        setNewNoteHead(myNotes[Idx].noteHead);
        setNewNoteBody(myNotes[Idx].noteBody);
    }

    useEffect(() => {
        (async () => {
            try {
                const resp = await axios.get("/api/@mynotes", {
                    withCredentials: true
                });
                setMyNotes(resp.data);
            } catch (error) {
                setMyNotes(null);
            }
        })();
    }, []);

    return (
        <div className='m-2 p-2'>
            <Modal show={delViewModal.length === 0 ? false : true} onHide={handleClose}>
                {delViewModal === '2' ?
                    <Modal.Header>
                        <Modal.Title>Confirmation</Modal.Title>
                    </Modal.Header>
                    :
                    null
                }
                {delViewModal === '2' ?
                    <Modal.Body>
                        Are you sure, you want to delete this note!
                    </Modal.Body>
                    :
                    <Modal.Body>
                        <div>
                            {newNoteHead}
                            {newNoteBody === '' || <hr />}
                            {newNoteBody}
                        </div>
                    </Modal.Body>
                }
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    {delViewModal === '2' ?
                        <Button variant="danger" onClick={e => deleteNote(selectedNote)}>
                            Delete
                        </Button>
                        : null
                    }
                </Modal.Footer>
            </Modal>

            <Modal show={show} onHide={handleClose}>
                {selectedNote !== '' ?
                    <Modal.Header>
                        <Modal.Title>Edit the note</Modal.Title>
                    </Modal.Header>
                    :
                    <Modal.Header>
                        <Modal.Title>Add a Note</Modal.Title>
                    </Modal.Header>
                }

                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="noteHead">
                            <Form.Control type="text" placeholder='Title' value={newNoteHead}
                                onChange={(e) => setNewNoteHead(e.target.value)}
                                isInvalid={!validated} />
                            <Form.Control.Feedback type='invalid'>Title is required</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="noteBody">
                            <Form.Control as="textarea" rows={3} placeholder='Notes' value={newNoteBody}
                                onChange={(e) => setNewNoteBody(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    {selectedNote !== '' ?
                        <Button variant="primary" onClick={e => updateNote(myNotes[selectedNote].noteId)}>
                            Edit
                        </Button>
                        :
                        <Button variant="primary" onClick={addNote}>
                            Add
                        </Button>
                    }
                </Modal.Footer>
            </Modal>
            <Container>
                <div style={{float: 'right'}}>
                    <Button onClick={handleShow} >Add note</Button>
                </div>
                <div style={{width: '90%'}}>
                    <h3 style={{ textAlign: 'center' }}>
                        My Notes
                    </h3>
                </div>
                <hr />
                {myNotes && myNotes.length !== 0 ?
                    <div>
                        <Row xs='0' sm='576px' md='768px' lg='992px' className="g-4">
                            {myNotes.map((note, idx) => (
                                <Col key={note.noteId} className="mb-3">
                                    <Card bg="light" className="mb-2" style={{ width: '18rem' }}
                                        onDoubleClick={e => handleUpdateShow(idx, e)} >
                                        <Card.Header>{note.noteHead}</Card.Header>
                                        <Card.Body>
                                            <Card.Text>
                                                <div style={{ overflowY: 'auto', height: '10rem', scrollbarWidth: 'thin' }}>
                                                    {note.noteBody}
                                                </div>
                                            </Card.Text>
                                            <div style={{ textAlign: 'right' }} className='pt-2'>
                                                <Button data-viewbtn='viewBtn' className='btn-sm btn-secondary mx-2'
                                                    onClick={e => showDeleteViewAlert(note.noteId, e, idx)}
                                                >View</Button>
                                                <Button data-delbtn='delBtn' className='btn-sm btn-secondary'
                                                    onClick={e => showDeleteViewAlert(note.noteId, e, idx)}
                                                >Delete</Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                    :
                    <div>
                        <center className="py-4">
                            <Alert variant='info' style={{ width: '40%' }}>
                                Click <b>Add note</b> to add a new note<br />
                                <b>Double click</b> to edit the note <br />
                                Click <b>Delete</b> to delete a specific note <br />
                                Click <b>View</b> to view a specific note
                            </Alert>
                        </center>
                    </div>
                }
            </Container>

        </div>
    )
}

export default Dashboard