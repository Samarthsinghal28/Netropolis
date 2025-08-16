import React, { useState, useEffect } from 'react';
import './login.css';
import { io } from "socket.io-client";
import { useNavigate } from 'react-router-dom';

// Validation helper functions
const validateEmail = (email) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email);
};

const validatePassword = (password) => {
  return password.length >= 6;
};

// function Login({ props.onLogin }) {
function Login(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formSubmitted, setFormStatus]=useState(false);
    const [loginAsManager, setLoginAsManager] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleRadioChange = (event) => {
      if (event.target.checked) {
        setLoginAsManager(true); 
        console.log(loginAsManager);
      } else {
        setLoginAsManager(false); 
        console.log(loginAsManager);
      }
      
    };

    useEffect(() => {
    
      const s = io(process.env.REACT_APP_BACKEND_URL, {
        transports: ["websocket"],
        cors: {
          origin: "http://localhost:3000/",
        },
      }); 
  
      if(formSubmitted){
      function SearchUser() {
        const data = {
            'email': email,
            'password': password
        };
        if(!loginAsManager){
          s.emit("login_user", data);
        }
        else{
          console.log("calling login manager")
          s.emit("login_manager",data);
        }
      }
  
      const waitForMessage = () => {
        return new Promise((resolve) => {

          const emittedMessage= loginAsManager?"login_manager":"login_result";

          s.on(emittedMessage, (data) => {
            resolve(data['message']);
          });
        });
      };
  
      const fetchData = async () => {
        try {
          SearchUser();
          const message = await waitForMessage();
          console.log('Received message from WebSocket:', message);
          
          if(message==="User logged in successfully" || message==="Manager logged in successfully"){
            // Store authentication data in localStorage for persistence
            const authData = {
              email: email,
              isManager: loginAsManager,
              timestamp: Date.now()
            };
            localStorage.setItem('authData', JSON.stringify(authData));
            
            props.onLogin(true, email, loginAsManager);
            alert(message);
            navigate("/");
          } else {
            alert(message);
          }
          
          setIsLoading(false);
          setFormStatus(false);
        } catch (error) {
          console.error('Error while waiting for message from WebSocket:', error);
          alert('Connection error. Please try again.');
          setIsLoading(false);
          setFormStatus(false);
        }
      };
  
      s.on('connect', () => {
        console.log('Connected to backend via WebSocket');
        // setIsConnected(true)
      });
  
  
      if(formSubmitted){
        fetchData();
      }
  
      return () => {
        s.disconnect();
      };
    }
  
  }, [formSubmitted]);
  
    const handleLogin = (e) => {
      e.preventDefault();
      
      // Clear previous errors
      setErrors({});
      
      // Validate form
      const newErrors = {};
      if (!email) {
        newErrors.email = 'Email is required';
      } else if (!validateEmail(email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      
      if (!password) {
        newErrors.password = 'Password is required';
      } else if (!validatePassword(password)) {
        newErrors.password = 'Password must be at least 6 characters long';
      }
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      
      setIsLoading(true);
      setFormStatus(true);
    };
    
    return (
      <div className='header'>
          <h1 className='header1'>Welcome to NetroPolis</h1>
      <h3>A platform where adventure awaits!</h3>
      
      <div className="body1">
      
        
      <div className="login-container">
      <h2>Login</h2>
      <form>
        <div className="form-group">
        <input
            type="checkbox"
            onChange={handleRadioChange}
            disabled={isLoading}
          />
          <label>Login as Manager</label>
          <br/>
          <br/>
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
          <label>Password:</label>
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
        <button 
          className="login-button" 
          type="submit" 
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className='form'>Don't have an account yet? <a href='./register'>Register</a></p>
      <p className='form'><a href='./'>Return to home page</a></p>
    </div>
    </div>
    </div>
    
    );
  }

  export default Login;