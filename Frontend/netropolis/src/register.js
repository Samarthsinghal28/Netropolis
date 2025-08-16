// Register.js

import React, { useState, useEffect} from 'react';
import './register.css'; // Import CSS file for styling
import { io } from "socket.io-client";
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';

// Validation helper functions
const validateEmail = (email) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email);
};

const validatePassword = (password) => {
  return password.length >= 6;
};

const validateName = (name) => {
  return name.trim().length >= 2;
};

// function Register({ onRegister }) {
function Register(){
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateBirth, setDateOfBirth] = useState('');
  const [specialisation, setSpecialization] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formSubmitted, setFormStatus]= useState(false);
  const [loginAsManager, setLoginAsManager] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate=useNavigate();
  useEffect(() => {
    
    const s = io(process.env.REACT_APP_BACKEND_URL, {
      transports: ["websocket"],
      cors: {
        origin: process.env.REACT_APP_FRONTEND_URL,
      },
    }); 


    function createUser() {
      const data = {
          'first_name': firstName,
          'last_name': lastName,
          'password': password,
          'email': email,
          'dob': dateBirth,
          'specialisation': specialisation
      };
      if(!loginAsManager){
        s.emit("create_user", data);
      }
      else{
        s.emit("create_community_manager",data);
      }
    }

    const waitForMessage = () => {
      return new Promise((resolve) => {
        s.on('user_created', (data) => {
          resolve(data['message']);
        });
      });
    };

    const sendData = async () => {
      try {
        createUser();
        const message = await waitForMessage();
        console.log('Received message from WebSocket:', message);
        
        setIsLoading(false);
        setFormStatus(false);
        
        if(message==="User created successfully" || message==="Manager created successfully"){
          alert(message);
          navigate("/login");
        }
        else{
          alert(message);
        }
      } catch (error) {
        console.error('Error while waiting for message from WebSocket:', error);
        alert('Registration failed. Please try again.');
        setIsLoading(false);
        setFormStatus(false);
      }
    };

    s.on('connect', () => {
      console.log('Connected to backend via WebSocket');
      // setIsConnected(true)
    });


    if(formSubmitted){
      sendData();

    }

    return () => {
      s.disconnect();
    };

    }, [formSubmitted]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});
    
    // Validate form
    const newErrors = {};
    
    if (!validateName(firstName)) {
      newErrors.firstName = 'First name must be at least 2 characters long';
    }
    
    if (!validateName(lastName)) {
      newErrors.lastName = 'Last name must be at least 2 characters long';
    }
    
    if (!dateBirth) {
      newErrors.dateBirth = 'Date of birth is required';
    }
    
    if (!specialisation.trim()) {
      newErrors.specialisation = 'Specialisation is required';
    }
    
    if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 6 characters long';
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setFormStatus(true);
  };

  const handleRadioChange = (event) => {
    if (event.target.checked) {
      setLoginAsManager(true); // Set to 1 if radio button is checked
    } else {
      setLoginAsManager(false); // Set to 0 if radio button is unchecked
    }
    console.log(loginAsManager);
  };

  return (
    <div>
    <div className='header'>
          <h1 className='header1'>Welcome to NetroPolis</h1>
      <h3>A platform where adventure awaits!</h3>
    </div>
    <div className="body2">
      
    <div className="register-form ">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="checkbox"
            onChange={handleRadioChange}
            disabled={isLoading}
          />
          <label>Register as Manager</label>
          <br/>
          <br/>

          <label>First Name:</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={errors.firstName ? 'error' : ''}
            disabled={isLoading}
            required
          />
          {errors.firstName && <div className="error-message">{errors.firstName}</div>}
        </div>
        <div className="form-group">
          <label>Last Name:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={errors.lastName ? 'error' : ''}
            disabled={isLoading}
            required
          />
          {errors.lastName && <div className="error-message">{errors.lastName}</div>}
        </div>
        <div className="form-group">
          <label>Date of Birth:</label>
          <input
            type="date"
            value={dateBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            className={errors.dateBirth ? 'error' : ''}
            disabled={isLoading}
            required
          />
          {errors.dateBirth && <div className="error-message">{errors.dateBirth}</div>}
        </div>
        <div className="form-group">
          <label>Specialisation:</label>
          <input
            type="text"
            value={specialisation}
            onChange={(e) => setSpecialization(e.target.value)}
            className={errors.specialisation ? 'error' : ''}
            disabled={isLoading}
            required
          />
          {errors.specialisation && <div className="error-message">{errors.specialisation}</div>}
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={errors.email ? 'error' : ''}
            disabled={isLoading}
            required
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>
        <div className="form-group">
          <label>Password: (at least 6 characters)</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={errors.password ? 'error' : ''}
            disabled={isLoading}
            required
          />
          {errors.password && <div className="error-message">{errors.password}</div>}
        </div>
        <div className="form-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={errors.confirmPassword ? 'error' : ''}
            disabled={isLoading}
            required
          />
          {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
        </div>
        <button 
          className="register-button" 
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p>Already have an account <a href='./login'>Login</a></p>
    </div>
    </div>
    </div>
    
    
  );
}

export default Register;
