const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (items, totalPrice) => {
  const lineItems = items.map((item) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.product.name,
        description: item.product.description,
      },
      unit_amount: item.product.price * 100, // Stripe expects the amount in cents
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${process.env.CLIENT_URL}/checkout/success`,
    cancel_url: `${process.env.CLIENT_URL}/cart`,
  });

  return session;
};

module.exports = { createCheckoutSession };
