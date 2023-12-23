import React, { useState,useEffect } from 'react'; 
//import useNavigate
import { useNavigate } from'react-router-dom';


const SignUp = ({isLoggedIn}) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const[error, setError] = useState('');

  //navigate
  const navigate = useNavigate();

  useEffect(() => {
    if(isLoggedIn) {
      // Redirect to the '/home' page if the user is logged in
      navigate('/');
      // console.log("Login",isLoggedIn);
    } 
  }, [isLoggedIn]);
  const { username, email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    // Check if passwords match
    if (password !== confirmPassword) {
      console.error('Passwords do not match');
      setError('Passwords do not match');
      // Optionally, display an error message to the user
      return;
    }
  
    try {
      // Send the registration request to "/register"
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });
  
      const data = await response.json();
  
      // Check if registration was successful
      if (data.register === "successful") {
        // Store the generated token in local storage
        localStorage.setItem('token', data.token);
        // console.log('Registration successful');
        // Optionally, redirect the user to another page (e.g., dashboard)
        //Navigate to VerifyOtp page using navigate
        navigate('/verifyotp');
        
      } else {
        setError(data.error);
        console.error('Registration failed:', data.error);
        // Optionally, display an error message to the user
      }
    } catch (error) {
      setError('No response from server.Try again later');
      console.error('Error registering user:', error);
      // Optionally, display an error message to the user
    }
  };
  

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h1 className="text-center mb-4">SignUp</h1>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username:</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    className="form-control"
                    value={username}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    value={email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password:</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-control"
                    value={password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password:</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className="form-control"
                    value={confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
                <span>{error}</span>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    SignUp
                  </button>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => navigate('/login')}>
                  Go to Login
                </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
