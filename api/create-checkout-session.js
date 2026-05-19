const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Allow both GET and POST
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      success_url: 'https://artyssweettalkcupcakes.com/success',
      cancel_url: 'https://artyssweettalkcupcakes.com/cart',
      line_items: [{
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
      billing_address_collection: 'required',
    });
    
    // If it's a GET request, redirect directly
    if (req.method === 'GET') {
      res.redirect(302, session.url);
      return;
    }
    
    // If it's POST, return JSON
    return res.status(200).json({ 
      id: session.id, 
      url: session.url 
    });

  } catch (error) {
    console.error('Stripe error:', error);
    return res.status(500).json({ 
      error: error.message 
    });
  }
}
