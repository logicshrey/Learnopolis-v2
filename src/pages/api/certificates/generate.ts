import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import Course from '@/models/Course';
import { createCanvas, loadImage } from 'canvas';
import path from 'path';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    await connectDB();

    const { courseId } = req.body;
    const user = await User.findById(session.user.id);
    const course = await Course.findById(courseId);

    // Verify course completion
    const progress = user.progress.find(
      p => p.courseId.toString() === courseId
    );

    if (!progress?.completed) {
      return res.status(400).json({ message: 'Course not completed' });
    }

    // Generate certificate
    const canvas = createCanvas(1000, 700);
    const ctx = canvas.getContext('2d');

    // Load certificate template
    const template = await loadImage(
      path.join(process.cwd(), 'public', 'certificate-template.png')
    );
    ctx.drawImage(template, 0, 0, 1000, 700);

    // Add text
    ctx.font = '48px Arial';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.fillText(user.name, 500, 300);
    ctx.fillText(course.title, 500, 400);

    const date = new Date().toLocaleDateString();
    ctx.font = '24px Arial';
    ctx.fillText(date, 500, 500);

    // Convert to buffer
    const buffer = canvas.toBuffer('image/png');

    // Save certificate reference
    user.certificates.push({
      courseId,
      issuedAt: new Date(),
      certificateUrl: `/certificates/${user._id}_${courseId}.png`
    });
    await user.save();

    // Send certificate
    res.setHeader('Content-Type', 'image/png');
    res.send(buffer);
  } catch (error) {
    console.error('Error generating certificate:', error);
    res.status(500).json({ message: 'Error generating certificate' });
  }
} 