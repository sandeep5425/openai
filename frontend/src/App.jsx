// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Routes,useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/SignUp';
import VerifyOtp from './components/VerifyOtp';
import Home from './components/Home';
//import profile
import Profile from './components/Profile';
//import productdetail
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import PaymentPage from './components/PaymentPage';
import Modal from 'react-modal';
import ChangePassword from './components/ChangePassword';
import ForgotPassword from './components/ForgotPassword';
Modal.setAppElement('#root');

const App = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [products, setProducts] = useState([]);

  const[email,setEmail] = useState('');
    const token = localStorage.getItem('token'); // Make sure 'jwtToken' is the key you used to store the token

    useEffect(() => { 
             let res = fetch('http://localhost:3000/extract-email', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
    })
    .then(response => response.json())
    .then(data => {
        // console.log('Extracted Email:', data.email);
        setEmail(data.email);
    })
    .catch(error => {
        console.error('Error:', error);
    });
    // console.log("Email for placing order " ,email);
  }, []);
  
 

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://fakestoreapi.com/products');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  };

  // navigate
  const navigate = useNavigate();

  // set the isLoggedIn state to true by calling to api 
  useEffect(() => {
    // Function to check if the user is logged in
    const checkIsLoggedIn = async () => {
      // Get the token from local storage
      const token = localStorage.getItem('token');
      // console.log("Token from App ", token);
      if (token) {
        try {
          // Call the '/isloggedin' API endpoint with the token in the Authorization header
          const response = await fetch('http://localhost:3000/isloggedin', {
            method: 'GET',
            headers: {
              'authorization': `${token}`
            }
          });

          const data = await response.json();

          if (data.loggedin) {
            // Set the isLoggedIn state to true if the user is logged in
            setLoggedIn(true);
          }
        } catch (error) {
          setLoggedIn(false);
          console.error('Error checking authentication status:', error);
        }
      }
      else{
        setLoggedIn(false);
      }
    };
    // Check if the user is logged in when the component mounts
    checkIsLoggedIn();
    const getProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
    };

    getProducts();
    // console.log("App" , isLoggedIn);    
  }, [isLoggedIn]); // Empty dependency array ensures the effect runs once when the component mounts

  return ( 
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
          <Link className="navbar-brand" to="/">
            My App
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          > 
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>
              {!isLoggedIn && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/signup">
                      Signup
                    </Link>
                  </li>
                </>
              )}
             {isLoggedIn && (
  <>
    <li className="nav-item">
      <Link className="nav-link" to="/profile">
        Profile
      </Link>
    </li>
    <li className="nav-item">
      <button
        className="nav-link btn btn-link"
        onClick={() => {
          // Clear the authentication token from local storage
          localStorage.removeItem('token');
          // Update the isLoggedIn state to false
          setLoggedIn(false);
          // Navigate to the '/' route
          navigate('/');
        }}
      >
        Logout
      </button>
    </li>
    <li className="nav-item">
      <Link className="nav-link" to="/cart">
        Cart 
      </Link>
    </li>
  </>
)}
            </ul>
          </div>
        </nav>

        <hr />
        <Routes>
        <Route path="/login" element={<Login isLoggedIn = {isLoggedIn}  />} />
        <Route path="/reset-password" element={<ForgotPassword />} />
        <Route path="/signup" element={<Signup isLoggedIn = {isLoggedIn} />} />
        <Route path="/profile" element={<Profile  isLoggedIn = {isLoggedIn} email={email} />} />
        <Route path="/change-password" element={<ChangePassword  isLoggedIn = {isLoggedIn} email={email} />} />
        <Route path="/product/:id" element={<ProductDetail products={products} />} />
        <Route path="/verifyotp" element={<VerifyOtp/>} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/payment" element={<PaymentPage email={email} products={products}/> } />
        <Route path="/" exact element={<Home  isLoggedIn = {isLoggedIn} products={products} />} />
        </Routes>
      </div>
  );
};

export default App;
