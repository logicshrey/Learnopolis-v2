import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import DailyChallenge from '@/models/DailyChallenge';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  if (req.method === 'GET') {
    try {
      await connectDB();

      // Get today's challenge
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let challenge = await DailyChallenge.findOne({
        date: today
      });

      if (!challenge) {
        // Generate new challenge if none exists
        challenge = await DailyChallenge.create({
          date: today,
          title: 'Daily Learning Sprint',
          description: 'Complete 3 modules today',
          requirements: {
            type: 'modules_completed',
            count: 3
          },
          reward: {
            points: 100,
            streak: 1
          }
        });
      }

      // Get user's progress
      const user = await User.findById(session.user.id);
      const progress = user.dailyChallenges.find(
        c => c.challengeId.toString() === challenge._id.toString()
      );

      res.status(200).json({
        challenge,
        progress: progress || { completed: false, progress: 0 }
      });
    } catch (error) {
      console.error('Error fetching daily challenge:', error);
      res.status(500).json({ message: 'Error fetching daily challenge' });
    }
  } else if (req.method === 'POST') {
    // Handle challenge completion
    try {
      await connectDB();

      const { challengeId } = req.body;
      const user = await User.findById(session.user.id);
      const challenge = await DailyChallenge.findById(challengeId);

      if (!challenge) {
        return res.status(404).json({ message: 'Challenge not found' });
      }

      // Update user progress and rewards
      user.points += challenge.reward.points;
      user.streak += challenge.reward.streak;
      user.dailyChallenges.push({
        challengeId: challenge._id,
        completed: true,
        completedAt: new Date()
      });

      await user.save();

      res.status(200).json({ message: 'Challenge completed', rewards: challenge.reward });
    } catch (error) {
      console.error('Error completing challenge:', error);
      res.status(500).json({ message: 'Error completing challenge' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
} 