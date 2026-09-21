import { Router } from 'express';
import User from '../models/User.js';
import Listing from '../models/Listing.js';
import Request from '../models/Request.js';
import Review from '../models/Review.js';
import Report from '../models/Report.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import { uploadBuffer } from '../config/cloudinary.js';

const router = Router();

// My profile stats
router.get('/me/stats', protect, async (req, res, next) => {
  try {
    const [itemsListed, completedExchanges] = await Promise.all([
      Listing.countDocuments({ seller: req.user._id }),
      Request.countDocuments({
        status: 'completed',
        $or: [{ seller: req.user._id }, { buyer: req.user._id }],
      }),
    ]);
    res.json({ itemsListed, completedExchanges });
  } catch (err) {
    next(err);
  }
});

router.put('/me', protect, upload.single('avatar'), async (req, res, next) => {
  try {
    ['fullName', 'program', 'yearLevel'].forEach((k) => req.body[k] && (req.user[k] = req.body[k]));
    if (req.file) req.user.avatar = await uploadBuffer(req.file.buffer, 'uniform-exchange/avatars');
    await req.user.save();
    res.json(req.user);
  } catch (err) {
    next(err);
  }
});

// Leave a review after a completed exchange
router.post('/reviews', protect, async (req, res, next) => {
  try {
    const { requestId, rating, comment } = req.body;
    const request = await Request.findById(requestId);
    if (!request || request.status !== 'completed') {
      return res.status(400).json({ message: 'You can only review completed exchanges.' });
    }
    const isBuyer = request.buyer.equals(req.user._id);
    const isSeller = request.seller.equals(req.user._id);
    if (!isBuyer && !isSeller) return res.status(403).json({ message: 'Not your exchange.' });

    const reviewee = isBuyer ? request.seller : request.buyer;
    const review = await Review.create({ reviewer: req.user._id, reviewee, request: request._id, rating, comment });

    const [{ avg, count }] = await Review.aggregate([
      { $match: { reviewee } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    await User.findByIdAndUpdate(reviewee, { ratingAvg: Math.round(avg * 10) / 10, ratingCount: count });

    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
});

// Report a user or listing
router.post('/reports', protect, async (req, res, next) => {
  try {
    const { targetType, targetId, reason } = req.body;
    res.status(201).json(await Report.create({ reporter: req.user._id, targetType, targetId, reason }));
  } catch (err) {
    next(err);
  }
});

// Public seller profile + reviews (keep last so it doesn't shadow /me and /reviews)
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('fullName avatar program yearLevel ratingAvg ratingCount createdAt');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    const reviews = await Review.find({ reviewee: user._id }).populate('reviewer', 'fullName avatar').sort({ createdAt: -1 }).limit(20);
    res.json({ user, reviews });
  } catch (err) {
    next(err);
  }
});

export default router;
