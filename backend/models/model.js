const mongoose = require('mongoose');

// Define a user schema
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
  });
  
const User = mongoose.model('User', userSchema);

  // Define an OTP schema
const otpSchema = new mongoose.Schema({
    email: String,
    otp: String,
  });
  
const OTP = mongoose.model('OTP', otpSchema);

//Define Order Schema
const orderSchema = new mongoose.Schema({
  email: String,
  orderDetails: [{
      product: String,
      quantity: Number,
      purchasedDate: Date,
      address: String
  }]
});

const Order = mongoose.model('Order', orderSchema);
 

//export the models
module.exports = {User, OTP, Order};
