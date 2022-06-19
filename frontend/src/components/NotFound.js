import React from 'react'
import { Alert, Container } from 'react-bootstrap'

function NotFound() {
  return (
    <div>
      <Container className='container-fluid'>
        <center>
          <Alert variant='danger' className='my-5' style={{ width: '40%' }}>
            Something went wrong!!
          </Alert>
        </center>
      </Container>
    </div>
  )
}

export default NotFound