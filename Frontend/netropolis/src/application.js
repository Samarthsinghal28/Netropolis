import React, { useState } from 'react';

function Application() {
    const [name, setName] = useState('');
    const [values, setValues] = useState('');
    const [statusMessage, setStatusMessage] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        setStatusMessage('');

        if (!name.trim() || !values.trim()) {
            setStatusMessage('All fields are required.');
            return;
        }

        // Simulate server request
        fakeServerSubmit(name, values)
            .then(response => {
                if (response.success) {
                    setStatusMessage('Submission successful!');
                } else {
                    setStatusMessage(response.message);
                }
            })
            .catch(() => {
                setStatusMessage('An error occurred. Please try again later.');
            });
    };

    // Fake server submit function
    const fakeServerSubmit = async (name, values) => {
        // Simulate server delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (name === 'test' && values === '123') {
            return { success: true };
        } else {
            return { success: false, message: 'Invalid submission data.' };
        }
    };

    return (
        <div className="application-container">
            <form onSubmit={handleSubmit}>
                <h2>Application Form</h2>
                {statusMessage && <p className="status">{statusMessage}</p>}
                <div>
                    <label>Name:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                    <label>Values:</label>
                    <input type="text" value={values} onChange={(e) => setValues(e.target.value)} />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default Application;
