import { Router } from 'express';
import Listing from '../models/Listing.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import { uploadBuffer } from '../config/cloudinary.js';

const router = Router();
const SELLER_FIELDS = 'fullName avatar ratingAvg ratingCount program';

// GET /api/listings?q=&category=&size=&condition=&minPrice=&maxPrice=&page=&limit=
router.get('/', async (req, res, next) => {
  try {
    const { q, category, size, condition, minPrice, maxPrice, sort = 'newest' } = req.query;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 12, 50);

    const filter = { status: 'available' };
    if (q) filter.$text = { $search: q };
    if (category) filter.category = category;
    if (size) filter.size = size;
    if (condition) filter.condition = condition;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const sortBy = { newest: { createdAt: -1 }, 'price-asc': { price: 1 }, 'price-desc': { price: -1 } }[sort] || { createdAt: -1 };

    const [items, total] = await Promise.all([
      Listing.find(filter).populate('seller', SELLER_FIELDS).sort(sortBy).skip((page - 1) * limit).limit(limit),
      Listing.countDocuments(filter),
    ]);
    res.json({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
});

router.get('/mine', protect, async (req, res, next) => {
  try {
    res.json(await Listing.find({ seller: req.user._id }).sort({ createdAt: -1 }));
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('seller', SELLER_FIELDS);
    if (!listing) return res.status(404).json({ message: 'Listing not found.' });
    res.json(listing);
  } catch (err) {
    next(err);
  }
});

router.post('/', protect, upload.array('photos', 5), async (req, res, next) => {
  try {
    const images = await Promise.all((req.files || []).map((f) => uploadBuffer(f.buffer)));
    const { title, description, category, size, condition, price, exchangeOption, quantity } = req.body;
    const listing = await Listing.create({
      seller: req.user._id, title, description, category, size, condition,
      price, exchangeOption, quantity, images,
    });
    res.status(201).json(listing);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', protect, async (req, res, next) => {
  try {
    const listing = await Listing.findOne({ _id: req.params.id, seller: req.user._id });
    if (!listing) return res.status(404).json({ message: 'Listing not found.' });
    const editable = ['title', 'description', 'category', 'size', 'condition', 'price', 'exchangeOption', 'quantity', 'status'];
    editable.forEach((k) => req.body[k] !== undefined && (listing[k] = req.body[k]));
    await listing.save();
    res.json(listing);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', protect, async (req, res, next) => {
  try {
    const listing = await Listing.findOneAndDelete({ _id: req.params.id, seller: req.user._id });
    if (!listing) return res.status(404).json({ message: 'Listing not found.' });
    res.json({ message: 'Listing deleted.' });
  } catch (err) {
    next(err);
  }
});

export default router;
