import bcrypt from 'bcryptjs';
import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { UserData, ApiError } from '@/types/api';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ user: UserData } | ApiError>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username, name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Check if username is taken (if provided)
    if (name) {
      const existingUsername = await User.findOne({ username: name });
      if (existingUsername) {
        return res.status(400).json({ message: 'Username already taken' });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    const userData: UserData = {
      username,
      name,
      email,
      password: hashedPassword,
      points: 0,
      level: 1,
      streak: 0,
      progress: [],
      achievements: [],
      dailyChallenges: [],
      certificates: []
    };

    // Only add username if name is provided and not empty
    if (name && name.trim() !== '') {
      userData.username = name;
    }

    // Create and save the user
    const user = await User.create(userData);

    return res.status(201).json({ user });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: 'An unexpected error occurred' });
  }
} 