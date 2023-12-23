const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
require('dotenv').config();

const { User } = require('./models/model');
const {OTP} = require('./models/model');
const {extractEmailFromToken,isLoggedIn} = require('./middlewares/middleware')

router.use(bodyParser.json());

//test route.
router.get("/", (req, res) => {
    res.send("Welcome to App");
  })


// Login validation route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Simple validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required',login : "failed"});
  }

  try {
    // Check if the user exists and the password matches
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials',login : "failed"});
    }
    console.log("User found. Generating OTP");
    // If user is valid, call the generate OTP route internally
    const otpResponse = await fetch('http://localhost:3000/generate-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const otpData = await otpResponse.json();
    if (otpData.message === 'OTP sent successfully') {
      console.log("OTP generated");
      // If the OTP is  sent,generate a JWT token
    const token = jwt.sign({ email }, 'SECERT_KEY', { expiresIn: '1h' }); 
      res.status(200).json({ message: 'Login validation successful and OTP sent' ,token,login : "sucessful"});
    } else {
      console.log("Failed to generate OTP");
      res.status(500).json({ error: 'Failed to send OTP',login : "failed" });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error',login : "failed"});
  }
});


// Login validation route
router.post('/reset-password', async (req, res) => {
  const { email } = req.body;

  // Simple validation
  if (!email ) {
    return res.status(400).json({ error: 'Email  required',reset : "failed"});
  }

  try {
    // Check if the user exists and the password matches
    const user = await User.findOne({ email});
    if (!user) {
      return res.status(401).json({ error: 'Invalid email',reset : "failed"});
    }
    console.log("User found. Generating OTP");
    // If user is valid, call the generate OTP route internally
    const otpResponse = await fetch('http://localhost:3000/generate-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const otpData = await otpResponse.json();
    if (otpData.message === 'OTP sent successfully') {
      console.log("OTP generated");
      // If the OTP is  sent,generate a JWT token
    const token = jwt.sign({ email }, 'SECERT_KEY', { expiresIn: '1h' }); 
      res.status(200).json({ message: 'Email validation successful and OTP sent' ,token,reset : "sucessful"});
    } else {
      console.log("Failed to generate OTP");
      res.status(500).json({ error: 'Failed to send OTP',login : "failed" });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error',login : "failed"});
  }
});



// Generate OTP route
//We also use this route for forgot password.
router.post('/generate-otp', async (req, res) => {
  const { email } = req.body;
  console.log("Entered generate otp");
  // Validate email
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // Generate OTP
    const generatedOTP = uuid.v4().substr(0, 6);
    
    // Save OTP to the database
    await OTP.findOneAndUpdate(
      { email },
      { email, otp: generatedOTP },
      { upsert: true, new: true }
    );

    // Send OTP to the user's email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptiwons = {
      from: 'sandeepsunny4464@gmail.com',
      to: email,
      subject: 'Your OTP for Login',
      text: `Your OTP is: ${generatedOTP}`,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to send OTP email' });
      }

      res.status(200).json({ message: 'OTP sent successfully' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify OTP route
router.post('/verify-otp', async (req, res) => {
  const { otp } = req.body;
    const email = extractEmailFromToken(req);
  // Simple validation
  if (!email || !otp) {
    return res.status(400).json({ isOtpValid: false, error: 'Email and OTP are required' });
  }

  try {
    // Check if the provided OTP is valid
    const storedOTP = await OTP.findOne({ email, otp });
    if (!storedOTP) {
      return res.status(401).json({ isOtpValid: false, error: 'Invalid OTP' });
    }

     
    // Delete the used OTP from the database
    await OTP.deleteOne({ email, otp });


    res.status(200).json({ isOtpValid: true, message: 'OTP verified successfully'});
  } catch (error) {
    console.error(error);
    res.status(500).json({ isOtpValid: false, error: 'Internal server error' });
  }
});

// Loggedin route
router.get('/isloggedin', isLoggedIn, (req, res) => {
  // If the user is logged in, send back a success message and user information
  res.status(200).json({ message: 'User is logged in', loggedin : true,user: req.user });
});

// Change password route
router.post('/change-password',async (req, res) => {
  try {
  // Get the user's email from the jwt token
    
    // Get the new password from the request body
    const { email,password } = req.body;

    // Update the user's password in the database (replace with your database update logic)
    const user = await User.findOneAndUpdate(
      { email },
      { password }, // Assuming the password is stored as plain text (use hashing in production)
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Logout route
router.post('/logout', isLoggedIn, (req, res) => {
  // Remove the Authorization header from the request
  delete req.headers.authorization;
  //clear the token in local storage
  localStorage.removeItem('token');
  res.status(200).json({ message: 'Logout successful', headers: req.headers });
});

//get email from token
router.post('/extract-email', (req, res) => {
  const token = req.body.token; // Assuming the token is sent in the request body

  if (!token) {
      return res.status(400).json({ error: 'Token is required.' });
  }

  try {
      // Verify and decode the JWT token
      const decoded = jwt.verify(token, 'SECERT_KEY'); // Replace with your actual JWT secret key
      const email = decoded.email; // Extract the email from the decoded token payload

      res.status(200).json({ email });
  } catch (error) {
      console.error('Error extracting email from token:', error);
      res.status(500).json({ error: 'Error extracting email from token.' });
  }
});



module.exports = {router}; 