import { Router } from 'express';
import { login, register } from '../controllers/auth.controller';
import passport from '../config/passport';
import { generateToken } from '../utils/jwt';

const router = Router();

// ── Existing routes ─────────────────────────────────────────────────────────
router.post('/login', login);
router.post('/register', register);

// ── Google OAuth routes ──────────────────────────────────────────────────────

// Step 1: redirect user to Google login
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

// Step 2: Google callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=oauth_failed`,
  }),
  (req, res) => {
    const user = req.user as { id: number; email: string; role: string } | undefined;

    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=oauth_failed`);
    }

    const token = generateToken({
      id: user.id,
      name: (user as { id: number; email: string; role: string; name?: string }).name ?? '',
      email: user.email,
      role: user.role,
    });

    // Redirect to frontend with JWT
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/oauth-success?token=${token}`);
  }
);

export default router;
