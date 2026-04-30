import { Request, Response } from 'express';
import { query } from '../config/db';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || '256296087011-p5181g6n7evnbg24pmgpj79tkhou1kot.apps.googleusercontent.com');

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

