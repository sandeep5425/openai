import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleVerify = async () => {
    // console.log("Token from VerifyOtp", localStorage.getItem("token"));
    try {
      const response = await fetch('http://localhost:3000/verify-otp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': localStorage.getItem("token")
        },
        body: JSON.stringify({otp}),
      });

      const data = await response.json();

      if (data.isOtpValid) {
        // Navigate to the '/' route and set the 'authorization' header with the token
        navigate('/', { state: { token: data.token } });
        window.location.reload();
      } else {
        // Handle invalid OTP (e.g., display error message)
        //remove the token from local storage
        localStorage.removeItem("token");
        navigate('/login');
        console.error('Invalid OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h1 className="text-center mb-4">Verify OTP</h1>
              <div className="mb-3">
                <label htmlFor="otp" className="form-label">Enter OTP:</label>
                <input
                  type="text"
                  id="otp"
                  className="form-control"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <div className="d-grid">
                <button
                  className="btn btn-primary"
                  onClick={handleVerify}
                >
                  Verify
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );  
};

export default VerifyOtp;
