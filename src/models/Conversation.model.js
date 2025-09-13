const { Schema, model, Types } = require('mongoose');

const ConversationSchema = new Schema(
  {
    participants: [{ type: Types.ObjectId, ref: 'User', index: true }],
    lastMessageAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = model('Conversation', ConversationSchema);