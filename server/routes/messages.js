import { Router } from 'express';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import { uploadBuffer } from '../config/cloudinary.js';

const router = Router();
router.use(protect);

async function getMyConversation(id, userId) {
  return Conversation.findOne({ _id: id, participants: userId });
}

// Start (or reuse) a conversation with another user about a listing
router.post('/conversations', async (req, res, next) => {
  try {
    const { userId, listingId } = req.body;
    if (userId === String(req.user._id)) return res.status(400).json({ message: "You can't message yourself." });

    let convo = await Conversation.findOne({
      participants: { $all: [req.user._id, userId] },
      listing: listingId,
    });
    if (!convo) convo = await Conversation.create({ participants: [req.user._id, userId], listing: listingId });
    res.status(201).json(convo);
  } catch (err) {
    next(err);
  }
});

router.get('/conversations', async (req, res, next) => {
  try {
    const convos = await Conversation.find({ participants: req.user._id })
      .populate('participants', 'fullName avatar')
      .populate('listing', 'title images')
      .sort({ lastMessageAt: -1 });
    res.json(convos);
  } catch (err) {
    next(err);
  }
});

router.get('/conversations/:id/messages', async (req, res, next) => {
  try {
    if (!(await getMyConversation(req.params.id, req.user._id))) {
      return res.status(404).json({ message: 'Conversation not found.' });
    }
    res.json(await Message.find({ conversation: req.params.id }).sort({ createdAt: 1 }));
  } catch (err) {
    next(err);
  }
});

// Send a message (text and/or one photo). Also pushed live via Socket.io.
router.post('/conversations/:id/messages', upload.single('photo'), async (req, res, next) => {
  try {
    const convo = await getMyConversation(req.params.id, req.user._id);
    if (!convo) return res.status(404).json({ message: 'Conversation not found.' });

    const text = (req.body.text || '').trim();
    const image = req.file ? await uploadBuffer(req.file.buffer, 'uniform-exchange/chat') : '';
    if (!text && !image) return res.status(400).json({ message: 'Write a message or attach a photo.' });

    const message = await Message.create({ conversation: convo._id, sender: req.user._id, text, image });
    convo.lastMessage = text || 'Sent a photo';
    convo.lastMessageAt = new Date();
    await convo.save();

    req.app.get('io').to(`conv:${convo._id}`).emit('message:new', message);
    res.status(201).json(message);
  } catch (err) {
    next(err);
  }
});

export default router;
