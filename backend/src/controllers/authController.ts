import { Request, Response } from 'express';
import { query } from '../config/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || '256296087011-p5181g6n7evnbg24pmgpj79tkhou1kot.apps.googleusercontent.com');

import { signupSchema, loginSchema } from '../utils/validators';
import { sendVerificationEmail } from '../utils/emailService';

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = signupSchema.parse(req.body);

    const userExists = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

    const newUser = await query(
      'INSERT INTO users (email, password_hash, provider, is_verified, verification_token, verification_token_expires_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email',
      [email, passwordHash, 'email', false, verificationToken, expiresAt]
    );

    // SEND VERIFICATION EMAIL
    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({ 
      message: 'Signup successful! Please check your email to verify your account.',
      user: { id: newUser.rows[0].id, email: newUser.rows[0].email }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Validation error', errors: error.issues });
    } else {
      res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
  }
};

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body;
    if (!token) {
      res.status(400).json({ message: 'No token provided' });
      return;
    }

    const result = await query('SELECT * FROM users WHERE verification_token = $1', [token]);
    if (result.rows.length === 0) {
      res.status(400).json({ message: 'Invalid or expired verification token' });
      return;
    }

    const user = result.rows[0];

    // CHECK IF TOKEN EXPIRED
    if (user.verification_token_expires_at && new Date() > new Date(user.verification_token_expires_at)) {
      res.status(400).json({ message: 'Verification link has expired. Please request a new one.' });
      return;
    }

    await query('UPDATE users SET is_verified = TRUE, verification_token = NULL, verification_token_expires_at = NULL WHERE id = $1', [user.id]);

    res.json({ message: 'Email verified successfully! You can now log in.' });
  } catch (error) {
    res.status(500).json({ message: 'Verification failed', error: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = signupSchema.parse(req.body);

    const userResult = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const user = userResult.rows[0];

    // BLOCK LOGIN IF NOT VERIFIED
    if (user.provider === 'email' && !user.is_verified) {
      res.status(403).json({ message: 'Please verify your email before logging in.' });
      return;
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '7d',
    });

    res.json({
      user: { id: user.id, email: user.email, name: user.name, picture: user.picture },
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Validation error', errors: error.issues });
    } else {
      res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
  }
};

export const resendVerification = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ message: 'Email is required' });
      return;
    }

    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const user = result.rows[0];
    if (user.is_verified) {
      res.status(400).json({ message: 'Email is already verified' });
      return;
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await query(
      'UPDATE users SET verification_token = $1, verification_token_expires_at = $2 WHERE id = $3',
      [verificationToken, expiresAt, user.id]
    );

    await sendVerificationEmail(email, verificationToken);

    res.json({ message: 'Verification email resent! Please check your inbox.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to resend verification email', error: (error as Error).message });
  }
};



export const googleLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body;
    if (!token) {
      res.status(400).json({ message: 'No token provided' });
      return;
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID || '256296087011-p5181g6n7evnbg24pmgpj79tkhou1kot.apps.googleusercontent.com',
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      res.status(400).json({ message: 'Invalid Google token' });
      return;
    }

    const email = payload.email;
    const name = payload.name;
    const picture = payload.picture;
    
    const user = await query('SELECT * FROM users WHERE email = $1', [email]);

    let userData;

    if (user.rows.length === 0) {
      // User doesn't exist, create one
      const newUser = await query(
        'INSERT INTO users (email, name, picture, provider) VALUES ($1, $2, $3, $4) RETURNING id, email, name, picture',
        [email, name, picture, 'google']
      );
      userData = newUser.rows[0];
    } else {
      userData = user.rows[0];
      // Optionally update picture/name if it changed
      if (userData.provider === 'google') {
        await query('UPDATE users SET name = $1, picture = $2 WHERE id = $3', [name, picture, userData.id]);
      }
    }

    const jwtToken = jwt.sign({ id: userData.id }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '7d',
    });

    res.json({
      user: { id: userData.id, email: userData.email, name: userData.name, picture: userData.picture },
      token: jwtToken,
    });
  } catch (error) {
    res.status(500).json({ message: 'Google Authentication failed', error: (error as Error).message });
  }
};

