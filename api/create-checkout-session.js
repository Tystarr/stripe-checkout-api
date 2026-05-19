const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      success_url: 'https://your-remixer-site.com/success',
      cancel_url: 'https://your-remixer-site.com/cancel',
      line_items: [{
        price: 'price_1TYlynQ2eirQ4xIQEbfTcaYm',
        quantity: 1,
      }],
      mode: 'payment',
    });
    
    res.json({ id: session.id, url: session.url });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
