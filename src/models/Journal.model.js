const { Schema, model, Types } = require('mongoose');

const JournalSchema = new Schema(
  {
    owner: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    type: { type: String, enum: ['Family Tour', 'Adventure Tour', 'Solo Trip'], default: 'Solo Trip' },
    description: { type: String },
    coverMediaUrl: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    groupMembers: { type: String },
    visibility: { type: String, enum: ['private', 'friends', 'public'], default: 'public' },
  },
  { timestamps: true }
);

module.exports = model('Journal', JournalSchema);