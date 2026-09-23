import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../supabaseServer.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Utility function to generate JWT token for AuthContext
const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

// REGISTER ROUTE
router.post('/register', async (req, res, next) => {
  try {
    const { 
      fullName, 
      studentId, 
      email, 
      program, 
      yearLevel, 
      password, 
      confirmPassword, 
      confirm_password 
    } = req.body;

    const confirmation = confirmPassword || confirm_password;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    if (confirmation && password !== confirmation) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    // 1. Create user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          student_id: studentId,
          program: program,
          year_level: yearLevel,
        },
      },
    });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const user = data.user;

    if (!user) {
      return res.status(400).json({ message: 'Registration failed. Please check your details.' });
    }

    // 2. Return JWT token and user details to AuthContext
    res.status(201).json({
      token: signToken(user.id),
      user: {
        id: user.id,
        email: user.email,
        fullName,
        studentId,
        program,
        yearLevel,
      },
    });
  } catch (err) {
    next(err);
  }
});

// LOGIN ROUTE
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password.' });
    }

    // 1. Authenticate using Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      return res.status(401).json({ message: 'Invalid credentials or account does not exist.' });
    }

    const user = data.user;

    // 2. Check metadata for banned status
    if (user.user_metadata?.banned) {
      return res.status(403).json({ message: 'This account has been suspended.' });
    }

    // 3. Return signed JWT token and user details
    res.json({
      token: signToken(user.id),
      user: {
        id: user.id,
        email: user.email,
        fullName: user.user_metadata?.full_name || '',
        studentId: user.user_metadata?.student_id || '',
        program: user.user_metadata?.program || '',
        yearLevel: user.user_metadata?.year_level || '',
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET CURRENT USER ROUTE
router.get('/me', protect, (req, res) => {
  res.json({
    id: req.user.id,
    email: req.user.email,
    fullName: req.user.full_name || req.user.fullName || '',
    studentId: req.user.student_id || req.user.studentId || '',
    program: req.user.program || '',
    yearLevel: req.user.year_level || req.user.yearLevel || '',
    role: req.user.role || 'user',
  });
});

export default router;