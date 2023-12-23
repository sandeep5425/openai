const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {User} = require('./models/model');
//jwt
const jwt = require('jsonwebtoken');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/userdb', {});

router.use(bodyParser.json());

// Register a new user
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  
  // Simple validation
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required',register : "failed"});
  }
  
  try {
    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered' ,register : "failed"});
    }
    
    // Create a new user
    const newUser = new User({ username, email, password });
    await newUser.save();
    console.log("User registered successfully");
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
      res.status(200).json({ message: 'User registered successfully and OTP sent' ,token,register : "successful"});
    } else {
      console.log("Failed to generate OTP");
      res.status(500).json({ error: 'Failed to send OTP',register : "failed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error',register : "failed"});
  }
});


router.post('/user-details', async (req, res) => {
  const { email } = req.body;

  try {
      // Find the user by email and project only the email and username fields
      const user = await User.findOne({ email: email }, 'email username');
      
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }
      
      // Send back the user details
      res.status(200).json({
          email: user.email,
          username: user.username
      });
  } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = {router};
