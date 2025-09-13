const Journal = require('../models/Journal.model');
const Post = require('../models/Post.model');
const { isFriends } = require('../utils/relations');

async function canViewJournal(user, journal) {
  if (!journal) return false;
  if (journal.visibility === 'public') return true;
  if (!user) return false;
  if (journal.owner.equals(user._id)) return true;
  if (journal.visibility === 'friends') return await isFriends(user._id, journal.owner);
  return false; // private
}

async function createJournal(req, res, next) {
  try {
    const { title, description, coverMediaUrl, startDate, endDate, visibility } = req.body;
    const journal = await Journal.create({
      owner: req.user._id,
      title,
      description,
      coverMediaUrl,
      startDate,
      endDate,
      visibility,
    });
    res.status(201).json({ journal });
  } catch (err) { next(err); }
}

async function listJournals(req, res, next) {
  try {
    const filter = [{ visibility: 'public' }];
    if (req.user) filter.push({ owner: req.user._id });
    if (req.query.owner) filter.push({ owner: req.query.owner });
    const journals = await Journal.find({ $or: filter }).sort({ createdAt: -1 });
    res.json({ journals });
  } catch (err) { next(err); }
}

async function getJournal(req, res, next) {
  try {
    const journal = await Journal.findById(req.params.id);
    if (!journal) return res.status(404).json({ message: 'Journal not found' });
    if (!(await canViewJournal(req.user, journal))) return res.status(403).json({ message: 'Forbidden' });
    res.json({ journal });
  } catch (err) { next(err); }
}

async function updateJournal(req, res, next) {
  try {
    const journal = await Journal.findById(req.params.id);
    if (!journal) return res.status(404).json({ message: 'Journal not found' });
    if (!journal.owner.equals(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
    const fields = ['title', 'description', 'coverMediaUrl', 'startDate', 'endDate', 'visibility'];
    for (const f of fields) if (typeof req.body[f] !== 'undefined') journal[f] = req.body[f];
    await journal.save();
    res.json({ journal });
  } catch (err) { next(err); }
}

async function deleteJournal(req, res, next) {
  try {
    const journal = await Journal.findById(req.params.id);
    if (!journal) return res.status(404).json({ message: 'Journal not found' });
    if (!journal.owner.equals(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
    await Post.deleteMany({ journal: journal._id });
    await journal.deleteOne();
    res.json({ success: true });
  } catch (err) { next(err); }
}

async function createPost(req, res, next) {
  try {
    const journal = await Journal.findById(req.params.journalId);
    if (!journal) return res.status(404).json({ message: 'Journal not found' });
    if (!journal.owner.equals(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
    const { content, media, location, takenAt } = req.body;
    const post = await Post.create({ journal: journal._id, author: req.user._id, content, media, location, takenAt });
    res.status(201).json({ post });
  } catch (err) { next(err); }
}

async function listPosts(req, res, next) {
  try {
    const journal = await Journal.findById(req.params.journalId);
    if (!journal) return res.status(404).json({ message: 'Journal not found' });
    if (!(await canViewJournal(req.user, journal))) return res.status(403).json({ message: 'Forbidden' });
    const posts = await Post.find({ journal: journal._id }).sort({ createdAt: -1 });
    res.json({ posts });
  } catch (err) { next(err); }
}

async function updatePost(req, res, next) {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (!post.author.equals(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
    const { content, media, location, takenAt } = req.body;
    if (typeof content !== 'undefined') post.content = content;
    if (typeof media !== 'undefined') post.media = media;
    if (typeof location !== 'undefined') post.location = location;
    if (typeof takenAt !== 'undefined') post.takenAt = takenAt;
    await post.save();
    res.json({ post });
  } catch (err) { next(err); }
}

async function deletePost(req, res, next) {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (!post.author.equals(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
    await post.deleteOne();
    res.json({ success: true });
  } catch (err) { next(err); }
}

module.exports = { createJournal, listJournals, getJournal, updateJournal, deleteJournal, createPost, listPosts, updatePost, deletePost };