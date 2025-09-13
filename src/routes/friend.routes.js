const express = require('express');
const { requireAuth } = require('../middlewares/auth.middleware');
const ctrl = require('../controllers/friend.controller');

const router = express.Router();

router.post('/requests', requireAuth, ctrl.sendRequest);
router.post('/requests/:id/respond', requireAuth, ctrl.respondRequest);
router.get('/list/:userId', requireAuth, ctrl.listFriends);

module.exports = router;