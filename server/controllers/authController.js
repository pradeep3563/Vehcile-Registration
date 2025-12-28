import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendEmail.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const registerUser = async (req, res) => {
  const { name, email, password, phone, address, role, secretKey } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Admin Registration Validation
    if (role === 'admin') {
      // Check if this is the first admin
      const adminCount = await User.countDocuments({ role: 'admin' });
      
      // If admins exist, require secret key
      if (adminCount > 0) {
        const ADMIN_SECRET = process.env.ADMIN_SECRET || 'admin123'; // Default secret if env not set
        if (secretKey !== ADMIN_SECRET) {
          return res.status(403).json({ message: 'Invalid Admin Secret Key. Please contact an existing admin or system owner.' });
        }
      }
      // If adminCount === 0, allow registration without secret key (First Admin Privilege)
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      address,
      role: role || 'user',
    });

    if (user) {
      // Send welcome email
      try {
        await sendEmail({
          email: user.email,
          subject: 'Welcome to Vehicle Registration System',
          message: `Hi ${user.name},\n\nThank you for registering with us. You can now login and register your vehicles.\n\nRegards,\nVehicle Registration Team`,
        });
      } catch (error) {
        console.error('Email sending failed:', error);
        // Don't fail registration if email fails
      }

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      user.address = req.body.address || user.address;
      
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
