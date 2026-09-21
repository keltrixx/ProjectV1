// Run once:  npm run seed
// Creates an admin, two students and a few sample listings (no photos).
import 'dotenv/config';
import connectDB from './config/db.js';
import User from './models/User.js';
import Listing from './models/Listing.js';

await connectDB();
await Promise.all([User.deleteMany({}), Listing.deleteMany({})]);

await User.create({
  fullName: 'Admin', studentId: 'ADMIN-001', email: 'admin@school.edu',
  password: 'admin123', program: 'Administration', yearLevel: '-', role: 'admin', verified: true,
});
const maria = await User.create({
  fullName: 'Maria Santos', studentId: '2026-00002', email: 'maria@school.edu',
  password: 'student123', program: 'BSIT', yearLevel: '4th Year', verified: true,
});
await User.create({
  fullName: 'Juan Dela Cruz', studentId: '2026-00001', email: 'juan@school.edu',
  password: 'student123', program: 'BS Information Technology', yearLevel: '3rd Year', verified: true,
});

await Listing.insertMany([
  { seller: maria._id, title: 'School Polo Shirt', category: 'Uniform Shirt', size: 'M', condition: 'Good', price: 250, exchangeOption: 'Buy or Exchange', description: 'Used but in good condition. Clean and well maintained.' },
  { seller: maria._id, title: 'Navy Skirt', category: 'Pants / Skirt', size: 'L', condition: 'Like New', price: 300, exchangeOption: 'Buy Only' },
  { seller: maria._id, title: 'PE Shirt', category: 'PE Uniform', size: 'M', condition: 'Good', price: 200, exchangeOption: 'Exchange Only' },
  { seller: maria._id, title: 'PE Pants', category: 'PE Uniform', size: 'L', condition: 'Good', price: 250, exchangeOption: 'Buy Only' },
]);

console.log('Seeded. Admin: admin@school.edu / admin123   Student: juan@school.edu / student123');
process.exit(0);
