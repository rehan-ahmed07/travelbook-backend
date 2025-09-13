const User = require('../models/User.model');
const FriendRequest = require('../models/FriendRequest.model');

async function sendRequest(req, res, next) {
  try {
    if (req.user._id.equals(req.body.to)) return res.status(400).json({ message: 'Cannot friend yourself' });
    const fr = await FriendRequest.create({ from: req.user._id, to: req.body.to });
    res.status(201).json({ request: fr });
  } catch (err) { next(err); }
}

async function respondRequest(req, res, next) {
  try {
    const fr = await FriendRequest.findById(req.params.id);
    if (!fr) return res.status(404).json({ message: 'Request not found' });
    if (!fr.to.equals(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
    const { action } = req.body; // 'accept' | 'decline'
    fr.status = action === 'accept' ? 'accepted' : 'declined';
    await fr.save();
    res.json({ request: fr });
  } catch (err) { next(err); }
}

async function listFriends(req, res, next) {
  try {
    const userId = req.params.userId || req.user._id;

    // Find all accepted friend requests involving the user
    const friendships = await FriendRequest.find({
      status: 'accepted',
      $or: [{ from: userId }, { to: userId }],
    })
    // 💡 POPULATE the 'from' and 'to' fields with user data
    // We select only the fields we need, like name and email
    .populate('from', 'name email profilePicture') 
    .populate('to', 'name email profilePicture');

    // Now, 'friendships' is an array of requests where 'from' and 'to'
    // are full user objects, not just IDs.

    const friends = friendships.map((friendship) => {
      // Check if the 'from' user is the target user
      if (friendship.from._id.equals(userId)) {
        return friendship.to; // If so, the friend is the 'to' user
      } else {
        return friendship.from; // Otherwise, the friend is the 'from' user
      }
    });

    res.json({ friends });
  } catch (err) {
    next(err);
  }
}

module.exports = { sendRequest, respondRequest, listFriends };