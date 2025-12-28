import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';

// Load env vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const updateAdminPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const email = process.argv[2];
    const newPassword = process.argv[3];

    if (!email || !newPassword) {
      console.log('Usage: node scripts/updateAdminPassword.js <email> <new_password>');
      // List admins to help
      const admins = await User.find({ role: 'admin' }).select('name email');
      if (admins.length > 0) {
        console.log('\nExisting Admins:');
        admins.forEach(admin => console.log(`- ${admin.name} (${admin.email})`));
      } else {
        console.log('\nNo admins found in database.');
      }
      process.exit(1);
    }

    const user = await User.findOne({ email });

    if (!user) {
      console.log(`User with email ${email} not found`);
      process.exit(1);
    }

    // Optional: Check if user is actually an admin, though the request just says "change admin password"
    // it implies the target is an admin. If they select a non-admin, maybe we should warn but proceed?
    // Let's enforce role check to be safe.
    if (user.role !== 'admin') {
      console.log(`User ${email} is not an admin (Role: ${user.role})`);
      process.exit(1);
    }

    user.password = newPassword;
    await user.save();

    console.log(`Success! Password updated for admin: ${user.name} (${user.email})`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

updateAdminPassword();
