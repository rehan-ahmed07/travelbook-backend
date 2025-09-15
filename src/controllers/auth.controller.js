const User = require('../models/User.model');
const { signToken } = require('../utils/jwt');
const { hashPassword, comparePassword } = require('../utils/bcrypt');

async function register(req, res, next) {
  try {
    const { name, email, username, password } = req.body;
    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) return res.status(409).json({ message: 'Email or username already in use' });
    const hashedPassword = await hashPassword(password);
    const user = await User.create({ name, email, username, password: hashedPassword });
    const token = signToken({ sub: user._id });
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax', secure: false });
    return res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, username: user.username }, token });
  } catch (err) { next(err); }
}

async function login(req, res, next) {
  try {
    const { emailOrUsername, password } = req.body;
    const user = await User.findOne({ $or: [{ email: emailOrUsername }, { username: emailOrUsername }] }).select('+password');
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await comparePassword(password, user.password);
    const hashedPassword = await hashPassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    user.lastLoginAt = new Date();
    await user.save();
    const token = signToken({ sub: user._id });
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax', secure: false });
    return res.json({ user: { id: user._id, name: user.name, email: user.email, username: user.username }, token });
  } catch (err) { next(err); }
}

async function logout(req, res) {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
}


async function me(req, res) {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  const u = req.user;
  res.json({ user: { id: u._id, name: u.name, email: u.email, username: u.username, avatarUrl: u.avatarUrl } });
}

module.exports = { register, login, logout, me };