// server.js
const express = require('express');
const cors = require('cors');

const  {router: signupRoutes} = require('./signup');
const {router:loginRoutes} = require('./login');
const { router: logoutRoute} = require('./logout');
const { router: orderRoutes } = require('./order');  // Import the order route



const app = express();
const PORT = process.env.PORT || 3000;

// Use the signup and login routes
app.use(cors());
app.use(signupRoutes);
app.use(loginRoutes);
app.use(logoutRoute);
app.use(orderRoutes); 


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
