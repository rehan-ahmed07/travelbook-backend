const express = require('express');
const { requireAuth } = require('../middlewares/auth.middleware');
const ctrl = require('../controllers/chat.controller');

const router = express.Router();

router.post('/conversations', requireAuth, ctrl.getOrCreateConversation);
router.get('/conversations', requireAuth, ctrl.listConversations);
router.post('/conversations/:conversationId/messages', requireAuth, ctrl.sendMessage);
router.get('/conversations/:conversationId/messages', requireAuth, ctrl.listMessages);

module.exports = router;