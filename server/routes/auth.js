import { Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = Router();
const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

router.post('/register', async (req, res, next) => {
  try {
    const { fullName, studentId, email, program, yearLevel, password, confirmPassword } = req.body;
    if (password !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match.' });

    // role and verified are never taken from the request body
    const user = await User.create({ fullName, studentId, email, program, yearLevel, password });
    res.status(201).json({ token: sign(user._id), user: { ...user.toObject(), password: undefined } });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Incorrect email or password.' });
    }
    if (user.banned) return res.status(403).json({ message: 'This account has been suspended.' });
    res.json({ token: sign(user._id), user: { ...user.toObject(), password: undefined } });
  } catch (err) {
    next(err);
  }
});

router.get('/me', protect, (req, res) => res.json(req.user));

export default router;
