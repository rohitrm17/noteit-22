import axios from 'axios';
import React, { useState } from 'react';
import {
    Form,
    Button,
    Container,
    Alert
} from 'react-bootstrap';
import { Navigate } from 'react-router-dom';

function Login(props) {

    const [validated, setValidated] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState("");

    const handleSubmit = async (event) => {

        event.preventDefault();

        try {
            const resp = await axios.post("/api/login", {
                email,
                password
            }, {
                withCredentials: true,
            });
            setValidated(true);
            window.location.href = "/";
        } catch (err) {
            if (err.response.status === 401) {
                setValidated(false);
                setErrors(err.response.data.error);
            }
            else
                window.location.href = "/error";
        }
    }

    return (
        <div>
            {validated ? <Navigate to='/' replace={true} /> : null}
            <Container className='mt-4' style={{ width: '45%' }}>
                <Form validated={validated} onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control required type="email" placeholder="Enter email"
                            onChange={(e) => setEmail(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control required type="password" placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>

                    {errors === '' ?
                        null :
                        <Alert variant='danger'>
                            {errors}
                        </Alert>
                    }

                    <Button variant="primary" type="submit">
                        Login
                    </Button>
                </Form>
            </Container>
        </div>
    )
}

export default Login