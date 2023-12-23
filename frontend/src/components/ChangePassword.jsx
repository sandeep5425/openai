import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChangePassword = ({isLoggedIn,email}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  //if the user is not logged in navigate to /login
  if(!isLoggedIn) {
    navigate('/login');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Handle successful password change (e.g., show a success message)
        console.log('Password changed successfully:', data.message);
        navigate('/profile'); // Navigate to the profile page or another appropriate route
      } else {
        // Handle error scenarios
        setError(data.error || 'Failed to change password.');
      }
    } catch (err) {
      console.error('Error changing password:', err);
      setError('An unexpected error occurred.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Change Password</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">New Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Change Password</button>
      </form>
    </div>
  );
};

export default ChangePassword;
