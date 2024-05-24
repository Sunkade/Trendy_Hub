const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const auth = require('../middleware/auth');
const stripe = require('../utils/stripe');

// Get all orders for a user
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('items.product');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new order
router.post('/', auth, async (req, res) => {
  const { items, totalPrice } = req.body;

  try {
    // Create a Stripe checkout session
    const session = await stripe.createCheckoutSession(items, totalPrice);

    const newOrder = new Order({
      user: req.user._id,
      items,
      totalPrice,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ orderId: savedOrder._id, sessionId: session.id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
