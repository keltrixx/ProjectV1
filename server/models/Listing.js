import mongoose from 'mongoose';

export const CATEGORIES = ['Uniform Shirt', 'Pants / Skirt', 'PE Uniform', 'Accessories'];
export const CONDITIONS = ['New', 'Like New', 'Good', 'Fair'];
export const EXCHANGE_OPTIONS = ['Buy Only', 'Exchange Only', 'Buy or Exchange'];

const listingSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, default: '', maxlength: 1000 },
    category: { type: String, enum: CATEGORIES, required: true },
    size: { type: String, required: true },
    condition: { type: String, enum: CONDITIONS, required: true },
    price: { type: Number, min: 0, default: 0 },
    exchangeOption: { type: String, enum: EXCHANGE_OPTIONS, default: 'Buy Only' },
    quantity: { type: Number, min: 1, default: 1 },
    images: { type: [String], validate: (v) => v.length <= 5 },
    status: { type: String, enum: ['available', 'reserved', 'sold'], default: 'available', index: true },
  },
  { timestamps: true }
);

listingSchema.index({ title: 'text', description: 'text' });

export default mongoose.model('Listing', listingSchema);
