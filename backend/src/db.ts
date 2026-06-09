// db.ts – MongoDB connection using Mongoose
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' }); // Load .env from project root

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('MONGODB_URI not defined in .env');
}

export const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      // Mongoose 7+ options are inferred; explicit options omitted for brevity
    });
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};
