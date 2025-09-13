const { Schema, model, Types } = require('mongoose');

const PostSchema = new Schema(
  {
    journal: { type: Types.ObjectId, ref: 'Journal', required: true, index: true },
    author: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    content: { type: String, default: '' },
    media: [
      {
        url: String,
        type: { type: String, enum: ['image', 'video'] },
      },
    ],
    location: {
      name: String,
      coordinates: { type: [Number], index: '2dsphere' },
    },
    takenAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = model('Post', PostSchema);