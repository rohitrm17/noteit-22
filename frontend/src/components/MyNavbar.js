import axios from 'axios';
import React from 'react'
import {
    Navbar,
    Nav,
    Container
} from 'react-bootstrap';

import { Link } from 'react-router-dom';

function MyNavbar(props) {
    return (
        <div>
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand as={Link} to="/">NoteIt</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/">Home</Nav.Link>
                            <Nav.Link as={Link} to="about">About</Nav.Link>
                        </Nav>
                        {
                            props.currUser !== null ?
                                <Nav className='ml-auto'>
                                    <Nav.Link >Welcome, {props.currUser.username}</Nav.Link>
                                    <Nav.Link onClick={async () => {
                                        let email = props.currUser.email
                                        try {
                                            const resp = await axios.post("/api/logout", {
                                                email
                                            }, {
                                                withCredentials: true,
                                            });
                                            console.log("RESP logout: ", resp);
                                            window.location.href = "/";
                                        } catch (err) {
                                            console.log("RESP err: ", err);
                                        }
                                    }} >Logout</Nav.Link>
                                </Nav>
                                :
                                <Nav className='ml-auto'>
                                    <Nav.Link as={Link} to='/signUp'>Sign Up</Nav.Link>
                                    <Nav.Link as={Link} to='/login'>Login</Nav.Link>
                                </Nav>
                        }

                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    )
}

export default MyNavbar