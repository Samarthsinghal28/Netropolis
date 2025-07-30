import React, { useState } from 'react';

function Application() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [statusMessage, setStatusMessage] = useState('');

    const validateEmail = (email) => {
        const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        return re.test(String(email).toLowerCase());
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setStatusMessage('');

        if (!name.trim()) {
            setStatusMessage('Name is required.');
            return;
        }

        if (!validateEmail(email)) {
            setStatusMessage('Invalid email format.');
            return;
        }

        if (password.length < 6) {
            setStatusMessage('Password must be at least 6 characters long.');
            return;
        }

        // Simulate API call
        fakeApiRegister(name, email, password)
            .then(response => {
                if (response.success) {
                    setStatusMessage('Registration successful!');
                } else {
                    setStatusMessage('Registration failed. Please try again.');
                }
            })
            .catch(() => {
                setStatusMessage('An error occurred. Please try again later.');
            });
    };

    // Simulated API call
    const fakeApiRegister = (name, email, password) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (email !== 'test@example.com') {
                    resolve({ success: true });
                } else {
                    resolve({ success: false });
                }
            }, 1000);
        });
    };

    return (
        <div className="application-container">
            <form onSubmit={handleSubmit}>
                <h2>Register</h2>
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
                {statusMessage && <p className="status">{statusMessage}</p>}
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Application;
