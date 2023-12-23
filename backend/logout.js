const express = require('express');
const router = express.Router();

// Logout route
router.post('/logout', (req, res) => {
  // Remove the Authorization header from the request
  delete req.headers.authorization;

  res.status(200).json({ message: 'Logout successful', headers: req.headers });
});

module.exports = {router};
