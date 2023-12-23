import React, { useState } from 'react';
import { navigate } from 'react-router-dom';
import Modal from 'react-modal';

const PlaceOrder = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handlePlaceOrder = async () => {
    try {
      // Logic to send order details to backend and save to database
      // ...

      // Open the confirmation modal
      setModalIsOpen(true);
    } catch (error) {
      console.error("Error placing order:", error);
      // Handle error scenarios as needed
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    navigate('/');
  };

  return (
    <div className="place-order-container">
      <h2>Place Your Order</h2>
      <button onClick={handlePlaceOrder}>Place Order</button>

      {/* Modal for confirmation */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Order Placed Modal"
      >
        <h2>Order Placed Successfully!</h2>
        <p>Your order has been successfully placed.</p>
        <button onClick={closeModal}>OK</button>
      </Modal>
    </div>
  );
};

export default PlaceOrder;
