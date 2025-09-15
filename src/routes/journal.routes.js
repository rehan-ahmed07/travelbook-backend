const express = require('express');
const { body } = require('express-validator');
const { requireAuth } = require('../middlewares/auth.middleware');
const ctrl = require('../controllers/journal.controller');
const upload = require('../middlewares/upload.middleware');

const router = express.Router();

// journals
router.post('/', requireAuth, body('title').notEmpty(), upload.single('coverMedia'), ctrl.createJournal);
router.get('/', ctrl.listJournals);
router.get('/:id', ctrl.getJournal);
router.patch('/:id', requireAuth, upload.single('coverMedia'), ctrl.updateJournal);
router.delete('/:id', requireAuth, ctrl.deleteJournal);

// posts within a journal
router.post('/:journalId/posts', requireAuth, ctrl.createPost);
router.get('/:journalId/posts', ctrl.listPosts);
router.patch('/:journalId/posts/:postId', requireAuth, ctrl.updatePost);
router.delete('/:journalId/posts/:postId', requireAuth, ctrl.deletePost);

module.exports = router;