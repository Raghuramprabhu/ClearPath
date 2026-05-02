const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, 'postmessage');

router.post('/google', async (req, res) => {
  try {
    const { credential, code } = req.body;
    let payload;
    let tokens;

    if (code) {
      // Authorization code flow (offline access)
      const { tokens: newTokens } = await client.getToken(code);
      tokens = newTokens;
      const ticket = await client.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } else if (credential) {
      // Implicit flow (just ID token)
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } else {
      return res.status(400).json({ error: 'Missing credential or code' });
    }

    const { sub, email, name, picture } = payload;
    
    // In a real app, you would upsert this user into Firestore here
    const user = { id: sub, email, name, picture };

    // Generate our own JWT
    const appToken = jwt.sign(user, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });

    // Set httpOnly cookie
    res.cookie('auth_token', appToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // If we have refresh tokens from the code flow, we could store them in Firestore securely
    
    res.status(200).json({ message: 'Authentication successful', user });
  } catch (error) {
    console.error('Error during Google authentication:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('auth_token');
  res.status(200).json({ message: 'Logged out successfully' });
});

router.get('/me', (req, res) => {
  const token = req.cookies.auth_token;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    res.status(200).json({ user });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
