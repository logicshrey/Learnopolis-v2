import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    
    // Get the User collection
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    
    // Drop the problematic index
    await usersCollection.dropIndex('username_1');
    
    // Create a new sparse index
    await usersCollection.createIndex({ username: 1 }, { unique: true, sparse: true });
    
    res.status(200).json({ message: 'User index fixed successfully' });
  } catch (error) {
    console.error('Error fixing user index:', error);
    res.status(500).json({ message: 'Error fixing user index', error: error.message });
  }
} 