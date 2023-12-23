import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [disable,setDisable] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisable(true);
    try {
      const response = await fetch('http://localhost:3000/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      // console.log("Email from ForgotPassword", email);
      if (data.reset === "sucessful") {
          localStorage.setItem("token", data.token);
          // console.log("Token from ForgotPassword", data.token);
        // Navigate to the OTP validation page
        navigate(`/verifyotp`);
      } else {
        // Handle error scenarios
        setDisable(false);
        setError(data.error || 'Failed to generate OTP.');
      }
    } catch (err) {
        setDisable(false);
        console.error('Error generating OTP:', err);
        setError('An unexpected error occurred.TRY AGAIN LATER');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Forgot Password</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={disable}  className="btn btn-primary">Reset Password</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
