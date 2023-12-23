import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Profile = ({ isLoggedIn ,email}) => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  const navigate = useNavigate();
 
  useEffect(() => {
    // Fetch user details
    if (!isLoggedIn) {
      navigate('/login');
    } 

    console.log("Email from profile",email);

    fetch('http://localhost:3000/user-details', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: email })
    })
    .then(response => response.json())
    .then(data => setUser(data))
    .catch(error => console.error('Error fetching user details:', error));


    // Fetch orders
    fetch(`http://localhost:3000/get-orders/${email}`)
      .then(response => response.json())
      .then(data => setOrders(data.orders))
      .catch(error => console.error('Error fetching orders:', error));
  }, [user?.email]);

 

  return (
    <div className="container mt-5">
    <h2>User Profile</h2>
    {user && (
        <div className="card mb-4">
            <div className="card-body">
                <h4 className="card-title">Username: {user.username}</h4>
                <p className="card-text">Email: {user.email}</p>
                <button className="btn btn-primary" onClick={() => navigate('/change-password')}>Change Password</button>
            </div>
        </div>
    )}

<h3>My Orders</h3>
<ul className="list-group">
    {orders && orders.map(order => (
        <li key={order._id} className="list-group-item">
          <h6> Order Contents</h6>
            <div className="d-flex justify-content-between align-items-center">
                {/* Display Product Details */}
                <div>
                    {order.orderDetails.map((detail, index) => (
                        <div key={index} className="mb-3">
                            <p className="mb-1"><strong>Order Name: {detail.product}</strong></p>
                            <small>Quantity: {detail.quantity}</small>
                            <br />
                            <small>Order Date: {new Date(detail.purchasedDate).toLocaleDateString()}</small>
                        </div>
                    ))}
                </div>
                
            </div>
        </li>
    ))}
</ul>

</div>

  );
}

export default Profile;
