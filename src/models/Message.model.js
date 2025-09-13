const { Schema, model, Types } = require('mongoose');

const MessageSchema = new Schema(
  {
    conversation: { type: Types.ObjectId, ref: 'Conversation', required: true, index: true },
    sender: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    text: { type: String, default: '' },
    media: [
      {
        url: String,
        type: { type: String, enum: ['image', 'video'] },
      },
    ],
    readBy: [{ type: Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

module.exports = model('Message', MessageSchema);