const FriendRequest = require('../models/FriendRequest.model');

async function isFriends(userIdA, userIdB) {
  if (!userIdA || !userIdB) return false;
  const count = await FriendRequest.countDocuments({
    status: 'accepted',
    $or: [
      { from: userIdA, to: userIdB },
      { from: userIdB, to: userIdA },
    ],
  });
  return count > 0;
}

module.exports = { isFriends };