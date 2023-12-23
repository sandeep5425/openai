// components/Home.js

import React, {   useEffect } from 'react';
import ProductCard from './ProductCard';
//import navigate
import { useNavigate } from'react-router-dom';

const Home = ({isLoggedIn,products}) => {
  
  //navigate
  const navigate = useNavigate();

 

  useEffect(() => {
    if(!isLoggedIn) {
      // Redirect to the '/home' page if the user is logged in
      navigate('/login');
      // console.log("Login",isLoggedIn);
    } 
  }, [isLoggedIn]);



  
  

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Products</h1>
      <div className="row">
        {products.map(product => (
          <div className="col-md-4" key={product.id}>
            <ProductCard  product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
