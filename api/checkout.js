import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { priceId, credits, amount } = req.body;
    
    // Get user from Clerk (via session token)
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${credits} HM6 Query Credits`,
              description: `DRIS1 - Distributed Relational Intelligence System`,
              images: ['https://your-domain.com/logo.png'], // Add your logo
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/?session_id={CHECKOUT_SESSION_ID}&credits=${credits}`,
      cancel_url: `${req.headers.origin}/`,
      metadata: {
        userId,
        credits: credits.toString(),
        priceId
      },
      client_reference_id: userId,
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: error.message });
  }
}
