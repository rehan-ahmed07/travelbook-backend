const express = require('express');
const { body } = require('express-validator');
const { register, login, logout, me } = require('../controllers/auth.controller');
const { auth } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/register',
  body('name').notEmpty(),
  body('email').isEmail(),
  body('username').isLength({ min: 3 }),
  body('password').isLength({ min: 6 }),
  register
);

router.post('/login',
  body('emailOrUsername').notEmpty(),
  body('password').isLength({ min: 6 }),
  login
);

router.get('/logout', logout);

router.get('/me', auth, me);

module.exports = router;