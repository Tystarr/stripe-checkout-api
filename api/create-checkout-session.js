const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  // More specific CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://artyssweettalkcupcakes.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { line_items, success_url, cancel_url } = req.body;

    console.log('Received request:', { line_items, success_url, cancel_url });

    const session = await stripe.checkout.sessions.create({
      success_url: success_url || 'https://artyssweettalkcupcakes.com/success',
      cancel_url: cancel_url || 'https://artyssweettalkcupcakes.com/cart',
      line_items: line_items || [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Sweet Talk Cupcakes (Pickup Only)',
            description: 'Local pickup - no shipping'
          },
          unit_amount: 1200
        },
        quantity: 1
      }],
      mode: 'payment',
      billing_address_collection: 'required',
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
