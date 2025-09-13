const bcryptjs = require('bcryptjs');

async function hashPassword(password) {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(password, salt);
}

async function comparePassword(password, hashedPassword) {
  return bcryptjs.compare(password, hashedPassword);
}

module.exports = { hashPassword, comparePassword };