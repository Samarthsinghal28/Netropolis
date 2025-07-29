To create a new authentication page in place of the deleted one, you can follow these steps to create a new file with the necessary structure for an authentication page. Here's a basic example of what the new `register.js` file might look like:

```javascript
// File path: repo/Frontend/netropolis/src/register.js

import React, { useState } from 'react';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to handle registration, e.g., API call
    console.log('Form submitted', formData);
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
```

### Explanation:
- **React Functional Component**: The `Register` component is a functional component using React hooks.
- **State Management**: `useState` is used to manage form data.
- **Form Handling**: The `handleChange` function updates the state as the user types, and `handleSubmit` handles form submission.
- **Basic Form Structure**: The form includes fields for username, email, password, and password confirmation.
- **Styling and Structure**: Basic HTML structure is provided, and you can add CSS classes for styling as needed.

This code provides a basic structure for a registration page. You can expand it with additional features like form validation, error handling, and integration with a backend API for user registration.