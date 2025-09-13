const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

async function auth(req, res, next) {
  try {
    const token = req.cookies.token || (req.headers.authorization ? req.headers.authorization.split(' ')[1] : null);
    if (!token) return next();
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub);
    if (user) req.user = user;
    next();
  } catch (err) {
    next();
  }
}

function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  next();
}

module.exports = { auth, requireAuth };