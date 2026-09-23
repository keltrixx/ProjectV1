import jwt from 'jsonwebtoken';
import { supabase } from '../supabaseServer.js';

export async function protect(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Please log in to continue.' });

  try {
    // 1. Verify the local JWT token
    const { id } = jwt.verify(token, process.env.JWT_SECRET || 'secret');

    // 2. Fetch profile directly from Supabase DB or Auth
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !profile || profile.banned) {
      return res.status(401).json({ message: 'Account not available.' });
    }

    // 3. Attach profile to req.user for downstream routes
    req.user = profile;
    next();
  } catch {
    res.status(401).json({ message: 'Session expired. Please log in again.' });
  }
}

export function adminOnly(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admins only.' });
  }
  next();
}
