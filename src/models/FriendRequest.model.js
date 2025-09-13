const { Schema, model, Types } = require('mongoose');

const FriendRequestSchema = new Schema(
  {
    from: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    to: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
  },
  { timestamps: true }
);

FriendRequestSchema.index({ from: 1, to: 1 }, { unique: true });

module.exports = model('FriendRequest', FriendRequestSchema);