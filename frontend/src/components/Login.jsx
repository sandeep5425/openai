// components/Login.js
import React, {  useEffect, useState } from 'react';
import { useNavigate } from'react-router-dom';



function Login({isLoggedIn}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const[error, setError] = useState('');
  const [disable,setDisable] = useState(false);

  const navigate = useNavigate();

    
  useEffect(() => {
    if(isLoggedIn) {
      // Redirect to the '/home' page if the user is logged in
      navigate('/');
      // console.log("Login",isLoggedIn);
    } 
  }, [isLoggedIn]);
    

  const handleLogin = async () => {
    setDisable(true);
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.login === "sucessful") {
        // Redirect to the '/verify-otp' page upon successful login
       //save the token locallly
       localStorage.setItem("token", data.token);
        navigate('/verifyotp');
        // console.log("Login successful");
      } else {
        // Handle login failure (e.g., display error message)
        setError("Invalid email or password");
        setDisable(false);
        console.error('Login failed:', data.error);
      }
    } catch (error) {
      setDisable(false);
      setError("No response from server.Try again later");
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="text-center mb-4">Login Page</h2>
              <form>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email:</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password:</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="d-grid gap-2">
                  <button disabled={disable} type="button" className="btn btn-primary" onClick={handleLogin}>
                    Login
                  </button>
                </div>
              </form>
              <span>{error}</span>
              <div className="text-center mt-5">
                <button type="button" className="btn btn-secondary" onClick={() => navigate('/signup')}>
                  Go to Signup
                </button>  &nbsp;&nbsp; 
                <button type="button" className="btn btn-secondary" onClick={() => navigate('/reset-password')}>
                  Forgot Password?
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
}

export default Login;