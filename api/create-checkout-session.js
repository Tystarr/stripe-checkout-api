// In your checkout code, replace existing line_items with:
const cartItems = [
  {
    price_data: {
      currency: 'usd',
      product_data: {
        name: 'Sweet Talk Cupcakes - Local Pickup',
        description: 'Pickup only - no shipping',
        images: ['https://artyssweettalkcupcakes.com/your-cupcake-image.jpg']
      },
      unit_amount: 1200, // Replace with actual price in cents
    },
    quantity: 1,
  }
];
