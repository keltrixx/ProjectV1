import mongoose from 'mongoose';

// An "exchange request" = a buyer asking to buy or swap for a listing.
const requestSchema = new mongoose.Schema(
  {
    listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    option: { type: String, enum: ['Buy', 'Exchange'], default: 'Buy' },
    message: { type: String, default: '', maxlength: 500 },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'cancelled', 'completed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Request', requestSchema);
