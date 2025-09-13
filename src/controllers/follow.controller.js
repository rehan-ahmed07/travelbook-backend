const Follow = require('../models/Follow.model');

async function follow(req, res, next) {
  try {
    if (req.user._id.equals(req.body.userId)) return res.status(400).json({ message: 'Cannot follow yourself' });
    const doc = await Follow.findOneAndUpdate(
      { follower: req.user._id, following: req.body.userId },
      { $setOnInsert: { follower: req.user._id, following: req.body.userId } },
      { new: true, upsert: true }
    );
    res.status(201).json({ follow: doc });
  } catch (err) { next(err); }
}

async function unfollow(req, res, next) {
  try {
    await Follow.findOneAndDelete({ follower: req.user._id, following: req.params.userId });
    res.json({ success: true });
  } catch (err) { next(err); }
}

async function listFollowers(req, res, next) {
  try {
    const followers = await Follow.find({ following: req.params.userId });
    res.json({ followers });
  } catch (err) { next(err); }
}

async function listFollowing(req, res, next) {
  try {
    const following = await Follow.find({ follower: req.params.userId });
    res.json({ following });
  } catch (err) { next(err); }
}

module.exports = { follow, unfollow, listFollowers, listFollowing };