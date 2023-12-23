const jwt = require('jsonwebtoken');
const isLoggedIn = (req, res, next) => {
    // Get the token from the request headers
    const token = req.headers.authorization;
    // console.log("Token ",token);
    if (!token) {
      return res.status(401).json({ error: 'Token is required' });
    }
  
    try {
      // Verify the token
      const decoded = jwt.verify(token, 'SECERT_KEY'); // Replace with your actual secret key
      req.user = decoded; // Attach the decoded user information to the request object
      next(); // User is authenticated, proceed to the next middleware/route
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };

  const extractEmailFromToken = (req) => {
    try {
      // Get the token from the Authorization header
      const token = req.headers.authorization; 
      // Verify and decode the JWT token
      const decoded = jwt.verify(token, 'SECERT_KEY'); // Replace with your actual JWT secret key
      
      return decoded.email; // Extract the email from the decoded token payload
    } catch (error) {
      // Handle invalid tokens or other errors
      console.error('Error extracting email from token:', error);
      return null;
    }
  };

// Export the functions for use in other files
module.exports = {
    isLoggedIn,
    extractEmailFromToken,
};