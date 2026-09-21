import { Router } from 'express';
import User from '../models/User.js';
import Listing from '../models/Listing.js';
import Request from '../models/Request.js';
import Report from '../models/Report.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();
router.use(protect, adminOnly);

router.get('/stats', async (_req, res, next) => {
  try {
    const [totalUsers, activeListings, completedExchanges, openReports] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Listing.countDocuments({ status: 'available' }),
      Request.countDocuments({ status: 'completed' }),
      Report.countDocuments({ status: 'open' }),
    ]);
    res.json({ totalUsers, activeListings, completedExchanges, openReports });
  } catch (err) {
    next(err);
  }
});

router.get('/users', async (req, res, next) => {
  try {
    const filter = req.query.verified ? { verified: req.query.verified === 'true' } : {};
    res.json(await User.find(filter).sort({ createdAt: -1 }).limit(200));
  } catch (err) {
    next(err);
  }
});

// { verified?: boolean, banned?: boolean }
router.patch('/users/:id', async (req, res, next) => {
  try {
    const update = {};
    if (typeof req.body.verified === 'boolean') update.verified = req.body.verified;
    if (typeof req.body.banned === 'boolean') update.banned = req.body.banned;
    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.get('/listings', async (_req, res, next) => {
  try {
    res.json(await Listing.find().populate('seller', 'fullName').sort({ createdAt: -1 }).limit(200));
  } catch (err) {
    next(err);
  }
});

router.delete('/listings/:id', async (req, res, next) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.json({ message: 'Listing removed.' });
  } catch (err) {
    next(err);
  }
});

router.get('/reports', async (_req, res, next) => {
  try {
    res.json(await Report.find().populate('reporter', 'fullName').sort({ createdAt: -1 }).limit(200));
  } catch (err) {
    next(err);
  }
});

router.patch('/reports/:id', async (req, res, next) => {
  try {
    res.json(await Report.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }));
  } catch (err) {
    next(err);
  }
});

export default router;
