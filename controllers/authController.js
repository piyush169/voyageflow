// controllers/authController.js
const jwt = require('jsonwebtoken');
const usersService = require('../services/usersService');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

async function register(req, res) {
  try {
    const { name, email, phone, pincode, password } = req.body;
    // Basic validation (server-side)
    if (!name || !email || !phone || !pincode) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (!/^\d{10}$/.test(phone)) return res.status(400).json({ message: 'Phone must be 10 digits' });
    if (!/^\d{6}$/.test(pincode)) return res.status(400).json({ message: 'Pincode must be 6 digits' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ message: 'Invalid email' });

    // Default password if not provided (demo)
    const pwd = password || Math.random().toString(36).slice(2, 10);

    const user = usersService.createUser({ name, email, phone, pincode, password: pwd });
    const token = signToken({ email: user.email, name: user.name });

    return res.json({ token, user: { name: user.name, email: user.email } });
  } catch (err) {
    if (err.code === 'USER_EXISTS') return res.status(409).json({ message: 'User already exists' });
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
    const user = usersService.getUserByEmail(email);
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = signToken({ email: user.email, name: user.name });
    return res.json({ token, user: { name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { register, login };
