// routes index
const express = require('express');
const { auth } = require('../middlewares/auth.middleware');
const router = express.Router();

// hydrate req.user if token exists (non-blocking)
router.use(auth);

router.get('/health', (req, res) => res.json({ status: 'ok' }));

router.use('/auth', require('./auth.routes'));
router.use('/journals', require('./journal.routes'));
router.use('/friends', require('./friend.routes'));
router.use('/follows', require('./follow.routes'));
router.use('/chats', require('./chat.routes'));

module.exports = router;