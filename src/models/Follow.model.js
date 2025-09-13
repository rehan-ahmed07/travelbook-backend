const { Schema, model, Types } = require('mongoose');

const FollowSchema = new Schema(
  {
    follower: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    following: { type: Types.ObjectId, ref: 'User', required: true, index: true },
  },
  { timestamps: true }
);

FollowSchema.index({ follower: 1, following: 1 }, { unique: true });

module.exports = model('Follow', FollowSchema);