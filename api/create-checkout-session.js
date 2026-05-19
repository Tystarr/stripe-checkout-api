const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
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
    const { line_items, success_url, cancel_url } = req.body;

    const session = await stripe.checkout.sessions.create({
      success_url: success_url || 'https://your-store.com/success',
      cancel_url: cancel_url || 'https://your-store.com/cancel',
      line_items: line_items,
      mode: 'payment',
      
      // COMPLETELY DISABLE SHIPPING
      shipping_address_collection: null,
      
      // Force billing only
      billing_address_collection: 'required',
      
      // Prevent any shipping rates
      automatic_tax: { enabled: false },
      
      // Add custom text explaining no shipping
      custom_text: {
        submit: {
          message: "Local pickup only - no shipping available"
        }
      }
    });
    
    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(400).json({ error: error.message });
  }
};
