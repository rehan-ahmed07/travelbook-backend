const express = require('express');
const { requireAuth } = require('../middlewares/auth.middleware');
const ctrl = require('../controllers/follow.controller');

const router = express.Router();

router.post('/:userId', requireAuth, ctrl.follow);
router.delete('/:userId', requireAuth, ctrl.unfollow);
router.get('/:userId/followers', ctrl.listFollowers);
router.get('/:userId/following', ctrl.listFollowing);

module.exports = router;