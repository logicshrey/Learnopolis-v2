import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';

// Create a feedback schema if you don't have one
const FeedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  feedback: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Get the model or create it if it doesn't exist
const Feedback = mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  
  try {
    await connectDB();
    
    const { rating, feedback } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Invalid rating' });
    }
    
    const newFeedback = new Feedback({
      userId: session?.user?.id || null,
      rating,
      feedback,
    });
    
    await newFeedback.save();
    
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ message: 'Error submitting feedback' });
  }
} 