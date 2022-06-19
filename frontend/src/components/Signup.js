import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {
    Form,
    Button,
    Container,
    Alert
} from 'react-bootstrap';
import { Navigate } from "react-router-dom";
import APIServices from './APIServices'

function SignUp(props) {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [validated, setValidated] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [errors, setErrors] = useState({
        usernamerr: '',
        emailerr: '',
        passerr: '',
        len: '',
        lower: '',
        upper: '',
        digit: '',
        special: '',
        confirmPasserr: '',
        otherr: ''
    });

    useEffect(() => {
        if (password.length !== 0)
            APIServices.checkPassword(password, setErrors);

        if (username.length !== 0)
            APIServices.checkUsername(username, setErrors);

        if (confirmPass.length !== 0)
            APIServices.checkConfirmPass(password, confirmPass, setErrors);

    }, [password, username, confirmPass])

    const handleSubmit = async (event) => {
        event.preventDefault();
        APIServices.checkPassword(password, setErrors);
        APIServices.checkUsername(username, setErrors);
        if (errors.passerr === '' && errors.usernamerr === '' && errors.confirmPasserr === '') {

            try {
                const resp = await axios.post("/api/signUp", {
                    username,
                    email,
                    password
                }, {
                    withCredentials: true,
                });
                setValidated(true);
                window.location.href = "/";
            } catch (err) {
                if (err.response.status === 409) {
                    setValidated(false);
                    setErrors(prev => ({
                        ...prev,
                        otherr: err.response.data.error
                    }));
                }
                else
                    window.location.href = "/error";
            }
        }
        else {
            event.stopPropagation();
            setValidated(false);
        }
    };

    return (
        <div>
            {validated ? <Navigate to='/' replace={true} /> : null}
            <Container className='mt-4' style={{ width: '45%' }}>
                <Form validated={validated} onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="username">
                        <Form.Label>Username</Form.Label>
                        <Form.Control required type="text" placeholder="Full name"
                            onChange={(e) => setUsername(e.target.value)}
                            isInvalid={errors.usernamerr === '' ? false : true} />
                        <Form.Control.Feedback type='invalid'>
                            {errors.usernamerr}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control required type="email" placeholder="Enter email"
                            onChange={(e) => setEmail(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control required type="password" placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                            isInvalid={errors.passerr === '' ? false : true} />
                        <Form.Control.Feedback type="invalid">
                            {errors.len} <br />
                            {errors.lower} <br />
                            {errors.upper} <br />
                            {errors.special} <br />
                            {errors.digit}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className='mb-3' controlId='confirmPass'>
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control required type='password' placeholder='Confirm the password'
                            onChange={(e) => setConfirmPass(e.target.value)}
                            isInvalid={errors.confirmPasserr === '' ? false : true} />
                        <Form.Control.Feedback type='invalid'>
                            {errors.confirmPasserr}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {errors.otherr === '' ?
                        null :
                        <Alert variant='danger'>
                            {errors.otherr}
                        </Alert>
                    }

                    <Button variant="primary" type="submit">
                        Sign Up
                    </Button>
                </Form>
            </Container>
        </div>
    )
}

export default SignUp