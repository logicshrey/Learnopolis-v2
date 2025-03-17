import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    // Instead of generating a canvas certificate, we'll create a simple certificate object
    const certificate = {
      userId: session.user?.id,
      courseName: req.body.courseName,
      completionDate: new Date(),
      certificateId: `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    return res.status(200).json({ certificate });
  } catch (error) {
    console.error('Error generating certificate:', error);
    return res.status(500).json({ message: 'Error generating certificate' });
  }
} 