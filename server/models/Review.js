import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reviewee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    request: { type: mongoose.Schema.Types.ObjectId, ref: 'Request', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, default: '', maxlength: 300 },
  },
  { timestamps: true }
);

// one review per person per completed exchange
reviewSchema.index({ reviewer: 1, request: 1 }, { unique: true });

export default mongoose.model('Review', reviewSchema);
