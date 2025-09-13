const { Schema, model, Types } = require('mongoose');

const JournalSchema = new Schema(
  {
    owner: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    description: { type: String },
    coverMediaUrl: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    visibility: { type: String, enum: ['private', 'friends', 'public'], default: 'friends' },
  },
  { timestamps: true }
);

module.exports = model('Journal', JournalSchema);