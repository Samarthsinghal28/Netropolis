import React, { useState } from 'react';
import './login.css';
import { io } from "socket.io-client";
import { useNavigate } from 'react-router-dom';

function Login(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');

        if (!email || !password) {
            setErrorMessage('Email and password are required.');
            return;
        }

        if (!validateEmail(email)) {
            setErrorMessage('Please enter a valid email address.');
            return;
        }

        try {
            // Simulate server request
            const response = await fakeServerLogin(email, password);
            if (response.success) {
                props.onLogin(response.user);
                navigate('/dashboard');
            } else {
                setErrorMessage(response.message);
            }
        } catch (error) {
            setErrorMessage('An error occurred. Please try again later.');
        }
    };

    // Fake server login function
    const fakeServerLogin = async (email, password) => {
        // Simulate server delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (email === 'test@example.com' && password === 'password') {
            return { success: true, user: { email } };
        } else {
            return { success: false, message: 'Invalid email or password.' };
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>
                {errorMessage && <p className="error">{errorMessage}</p>}
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
