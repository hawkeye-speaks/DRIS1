import { clerkClient } from '@clerk/clerk-sdk-node';

export default async function handler(req, res) {
  try {
    const userId = req.auth?.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method === 'GET') {
      // Get user credits
      const user = await clerkClient.users.getUser(userId);
      const credits = user.publicMetadata?.credits || 0;
      
      return res.status(200).json({ credits });
    }

    if (req.method === 'POST') {
      // Deduct a credit (called after successful query)
      const user = await clerkClient.users.getUser(userId);
      const currentCredits = user.publicMetadata?.credits || 0;

      if (currentCredits < 1) {
        return res.status(402).json({ error: 'Insufficient credits' });
      }

      // Deduct 1 credit
      await clerkClient.users.updateUser(userId, {
        publicMetadata: {
          ...user.publicMetadata,
          credits: currentCredits - 1,
          lastQuery: new Date().toISOString(),
          totalQueries: (user.publicMetadata?.totalQueries || 0) + 1
        }
      });

      return res.status(200).json({ 
        credits: currentCredits - 1,
        message: 'Credit deducted successfully'
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Credits API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
