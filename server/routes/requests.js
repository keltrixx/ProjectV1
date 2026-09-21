import { Router } from 'express';
import Request from '../models/Request.js';
import Listing from '../models/Listing.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);

const populate = [
  { path: 'listing', select: 'title price size condition images status' },
  { path: 'buyer', select: 'fullName program yearLevel ratingAvg ratingCount avatar' },
  { path: 'seller', select: 'fullName ratingAvg ratingCount avatar' },
];

// Buyer creates a request
router.post('/', async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.body.listing);
    if (!listing || listing.status !== 'available') {
      return res.status(400).json({ message: 'This uniform is no longer available.' });
    }
    if (listing.seller.equals(req.user._id)) {
      return res.status(400).json({ message: "You can't request your own listing." });
    }
    const existing = await Request.findOne({ listing: listing._id, buyer: req.user._id, status: 'pending' });
    if (existing) return res.status(409).json({ message: 'You already have a pending request for this item.' });

    const request = await Request.create({
      listing: listing._id,
      buyer: req.user._id,
      seller: listing.seller,
      option: req.body.option,
      message: req.body.message,
    });
    res.status(201).json(request);
  } catch (err) {
    next(err);
  }
});

router.get('/incoming', async (req, res, next) => {
  try {
    res.json(await Request.find({ seller: req.user._id }).populate(populate).sort({ createdAt: -1 }));
  } catch (err) {
    next(err);
  }
});

router.get('/outgoing', async (req, res, next) => {
  try {
    res.json(await Request.find({ buyer: req.user._id }).populate(populate).sort({ createdAt: -1 }));
  } catch (err) {
    next(err);
  }
});

// PATCH /api/requests/:id/status  { status: 'accepted' | 'declined' | 'cancelled' | 'completed' }
router.patch('/:id/status', async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found.' });

    const { status } = req.body;
    const isSeller = request.seller.equals(req.user._id);
    const isBuyer = request.buyer.equals(req.user._id);

    // who may move the request to which status, and from where
    const rules = {
      accepted: { who: isSeller, from: ['pending'] },
      declined: { who: isSeller, from: ['pending'] },
      cancelled: { who: isBuyer, from: ['pending', 'accepted'] },
      completed: { who: isSeller, from: ['accepted'] },
    };
    const rule = rules[status];
    if (!rule || !rule.who || !rule.from.includes(request.status)) {
      return res.status(400).json({ message: 'That change is not allowed.' });
    }

    const wasAccepted = request.status === 'accepted';
    request.status = status;
    await request.save();

    // keep the listing in sync
    let listingStatus = { accepted: 'reserved', completed: 'sold' }[status];
    if (status === 'cancelled' && wasAccepted) listingStatus = 'available';
    if (listingStatus) await Listing.findByIdAndUpdate(request.listing, { status: listingStatus });

    res.json(request);
  } catch (err) {
    next(err);
  }
});

export default router;
