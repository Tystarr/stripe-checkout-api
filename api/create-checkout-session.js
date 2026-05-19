const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  // Allow requests from your domain
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { line_items } = req.body || {};

    const session = await stripe.checkout.sessions.create({
      success_url: 'https://artyssweettalkcupcakes.com/success',
      cancel_url: 'https://artyssweettalkcupcakes.com/cart',
      line_items: line_items || [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Sweet Talk Cupcakes (Pickup Only)',
            description: 'Local pickup - no shipping available'
          },
          unit_amount: 1200
        },
        quantity: 1
      }],
      mode: 'payment',
      billing_address_collection: 'required'
    });
    
    res.status(200).json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: error.message });
  }
};
