import Stripe from 'stripe';
import { clerkClient } from '@clerk/clerk-sdk-node';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const userId = session.metadata.userId;
    const credits = parseInt(session.metadata.credits);

    try {
      // Get current user credits from Clerk
      const user = await clerkClient.users.getUser(userId);
      const currentCredits = user.publicMetadata?.credits || 0;

      // Add purchased credits
      await clerkClient.users.updateUser(userId, {
        publicMetadata: {
          ...user.publicMetadata,
          credits: currentCredits + credits,
          lastPurchase: new Date().toISOString(),
          totalSpent: (user.publicMetadata?.totalSpent || 0) + (session.amount_total / 100)
        }
      });

      console.log(`✅ Added ${credits} credits to user ${userId}. New balance: ${currentCredits + credits}`);
    } catch (error) {
      console.error('Error updating user credits:', error);
      return res.status(500).json({ error: 'Failed to update credits' });
    }
  }

  res.status(200).json({ received: true });
}
