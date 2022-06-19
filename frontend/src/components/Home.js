import React from 'react'
import { Container } from 'react-bootstrap'


function Home(props) {
  return (
    <div className='m-2 p-2'>
      <Container>
        <div className="py-4" style={{ textAlign: 'center' }}>
          <h4 >
            NoteIt
          </h4>
          <br />
          <p style={{fontSize: '20px'}}>
            Sign Up/Login to make notes 
          </p>
        </div>
      </Container>
    </div>
  )
}

export default Home