import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

const PaymentPage = ({email}) => {

    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
      });
      const [address, setAddress] = useState('');  
      const [isModalOpen, setIsModalOpen] = useState(false)
      const navigate = useNavigate();
    const calculateNetAmount = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
      };
      
      const  handlePlaceOrder =async () => {
    const orderDetails = cart.map(item => ({
          product: item.title, // assuming each item in cart has a title property
          quantity:  parseInt(item.quantity),
          purchasedDate: new Date(),
          address: address
      }));
  
      try {
          const response = await fetch('http://localhost:3000/save-order', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ email ,  orderDetails })
          });
  
          const data = await response.json();
  
          if (response.ok) {
              // Handle successful order placement (e.g., show a success message, clear cart, etc.)
              console.log('Order placed successfully:', data);
              // setIsModalOpen(false); // Close the modal
              setCart([]); // Clear the cart

              //clear the local Storgae cart
              localStorage.removeItem('cart');
          } else {
              // Handle error scenarios
              console.error('Error placing order:', data.error);
          }
      } catch (error) {
          console.error('Error placing order:', error);
      }

        setIsModalOpen(true);
      };
    
      const closeModal = () => {
        setIsModalOpen(false);
        navigate('/');
      };

  return (
    <div className="container mt-5">

    {/* Order Details */}
    <div className="container mt-5">
  <h2>Order Summary </h2>
  <div>
  {cart.map(item => (
    <div key={item.id} className="mb-3 d-flex align-items-center">
      <img src={item.image} alt={item.title} className="mr-2" style={{ width: '30px', height: '30px' }} />
      { item.title &&
      <p>
         {`${item.title.slice(0, 30)}${item.title.length > 30 ? '...' : ''}`} ( x {item.quantity}N)
        
        </p> }
      <hr />
    </div>
  ))}

        {/* Address Input */}
        <div className="mt-3">
                <label htmlFor="address">Address:</label>
                <input
                    type="text"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}  // Step 3: Update state
                    className="form-control"
                    placeholder="Enter your address"
                    required
                />
            </div>


  {/* Modal for Order Confirmation */}
  <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Order Confirmation Modal"
      >
        <h2>Order Placed Successfully!</h2>
        <p>Your order has been successfully placed.</p>
        <button onClick={closeModal}>OK</button>
      </Modal>

</div>


  <div className="mt-4">
    <h5>Net Amount: ${calculateNetAmount()}</h5>
  </div>
</div>


      <h2>Payment Details</h2>
      {/* Payment Options */}
      <div className="payment-options">
        <h4>Select Payment Method:</h4>
        <div className="form-check">
          <input type="radio" id="cod" name="paymentMethod" value="cod" defaultChecked />
          <label htmlFor="cod">Cash On Delivery</label>
        </div>
        <div className="form-check">
          <input type="radio" id="online" name="paymentMethod" value="online" disabled />
          <label htmlFor="online">Online Payment (Disabled)</label>
        </div>
      </div>

      {/* Place Order Button */}
      <button className="btn btn-success mt-3" onClick={handlePlaceOrder}>
        Place Order
      </button>
    </div>
  );
};

export default PaymentPage;
