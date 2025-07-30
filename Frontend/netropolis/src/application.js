import React, { useState } from 'react';

function Application() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [statusMessage, setStatusMessage] = useState('');

    const validateEmail = (email) => {
        const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        return re.test(email);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setStatusMessage('');

        if (!name.trim()) {
            setStatusMessage('Name is required');
            return;
        }

        if (!validateEmail(email)) {
            setStatusMessage('Invalid email format');
            return;
        }

        if (password.length < 6) {
            setStatusMessage('Password must be at least 6 characters long');
            return;
        }

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            if (!response.ok) {
                throw new Error('Registration failed');
            }

            setStatusMessage('Registration successful!');
        } catch (error) {
            setStatusMessage(error.message);
        }
    };

    return (
        <div className="application-container">
            <form onSubmit={handleSubmit}>
                <h2>Register</h2>
                {statusMessage && <p className="status">{statusMessage}</p>}
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Application;