const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Order } = require('./models/model'); // Assuming you have a model for Order

const router = express.Router();

// Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/orderDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware
router.use(bodyParser.json());

// Define a route for order creation
router.post('/save-order', async (req, res) => {
    const { email, orderDetails } = req.body;

    // Simple validation
    if (!email || !orderDetails) {
        return res.status(400).json({ error: 'Email and order details are required.' });
    }

    try {
        // Create a new order
        const order = new Order({
            email,
            orderDetails
        });

        await order.save();
        res.status(201).json({ message: 'Order Saved successfully.', orderId: order._id });
    } catch (error) {
        res.status(500).json({ error: 'Error saving order to database.' });
    }
});

router.get('/get-orders/:email', async (req, res) => {
    const { email } = req.params;

    try {
        // Fetch all orders associated with the given email
        const orders = await Order.find({ email });

        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for the provided email.' });
        }

        // Convert each order's orderDetails from ObjectId to actual details
        const formattedOrders = orders.map(order => {
            return {
                _id: order._id,
                email: order.email,
                orderDetails: order.orderDetails.map(detail => ({
                    product: detail.product,
                    quantity: detail.quantity,
                    purchasedDate: detail.purchasedDate,
                    address: detail.address
                }))
            };
        });

        res.status(200).json({ orders: formattedOrders });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching orders from database.' });
    }
});

module.exports = { router };



module.exports = {router};
