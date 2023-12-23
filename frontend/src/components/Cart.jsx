import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const Cart = () => {
  // Fetch cart items from local storage when the component mounts
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

    

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(storedCart);
  }, []);


  const handleRemoveItem = (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  return (
    <div className="container mt-5">
      <h2>Your Cart</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cart.map(item => (
            <tr key={item.id}>
              <td>{item.title}</td>
              <td>${item.price}</td>
              <td>{item.quantity}</td>
              <td>${item.price * item.quantity}</td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => handleRemoveItem(item.id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-between">
        {
          cart.length>0 ?
          <div>

          <button className="btn btn-primary" onClick={() =>navigate("/payment") } >Proceed to Buy</button>
        <h4>Total: ${cart.reduce((acc, item) => acc + item.price * item.quantity, 0)}</h4>
        </div>:
        <div>
        <h3>Cart feels light</h3>
        <button className="btn btn-primary" onClick={() =>navigate("/") } >Shop Now</button>
        </div>
        }
      </div>
    </div>
  );
};

export default Cart;
