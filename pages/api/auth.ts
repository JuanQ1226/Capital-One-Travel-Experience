import { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

interface LoginRequestBody {
  email: string;
  password: string;
}

// Mock user database - in a real app, this would be a database call
const MOCK_USERS = [
  { email: 'test@example.com', password: 'password123', name: 'Test User', id: 1 },
  { email: 'admin@example.com', password: 'admin123', name: 'Admin User', id: 2 },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Extract email and password from request body
    const { email, password } = req.body as LoginRequestBody;

    // Validate request body
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user in mock database
    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    // If user not found, return authentication error
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate mock token - in a real app, use a JWT library
    const token = JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name,
      // Add any other user info you want to include in the token
    });

    // Set cookie options
    const cookieOptions = {
      httpOnly: true, // Prevents client-side JS from reading the cookie
      secure: process.env.NODE_ENV === 'production' || false, // Only send cookie over HTTPS in production
      sameSite: 'strict' as const, // Prevents the cookie from being sent in cross-site requests
      maxAge: 60 * 60 * 24 * 7, // 1 week in seconds
      path: '/', // Cookie is available for all routes
    };

    // Set auth token cookie
    res.setHeader('Set-Cookie', serialize('authToken', token, cookieOptions));

    // Return success response with user info (excluding password)
    return res.status(200).json({
      success: true,
      user: {
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}