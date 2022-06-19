import React from 'react'
import { Container } from 'react-bootstrap'

function About() {
    return (
        <div>
            <Container>
            <div className="py-4">
                <h4 style={{ textAlign: 'center' }}>
                  NoteIt
                </h4>
                <br />
                <p style={{fontSize: '20px'}}>
                  NoteIt is a noting app. Information can be stored in text form for timely useage.
                  One can add a new note, edit existing note and delete a note. 
                </p>
            </div>
        </Container>
        </div>
    )
}

export default About