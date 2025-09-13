const Conversation = require('../models/Conversation.model');
const Message = require('../models/Message.model');

async function getOrCreateConversation(req, res, next) {
  try {
    const { participantId } = req.body;
    let convo = await Conversation.findOne({ participants: { $all: [req.user._id, participantId] } });
    if (!convo) {
      convo = await Conversation.create({ participants: [req.user._id, participantId], lastMessageAt: new Date() });
    }
    res.status(201).json({ conversation: convo });
  } catch (err) { next(err); }
}

async function listConversations(req, res, next) {
  try {
    const convos = await Conversation.find({ participants: req.user._id }).sort({ updatedAt: -1 });
    res.json({ conversations: convos });
  } catch (err) { next(err); }
}

async function sendMessage(req, res, next) {
  try {
    const { conversationId } = req.params;
    const { text, media } = req.body;
    const message = await Message.create({ conversation: conversationId, sender: req.user._id, text, media });
    await Conversation.findByIdAndUpdate(conversationId, { lastMessageAt: new Date() });
    res.status(201).json({ message });
  } catch (err) { next(err); }
}

async function listMessages(req, res, next) {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversation: conversationId }).sort({ createdAt: 1 });
    res.json({ messages });
  } catch (err) { next(err); }
}

module.exports = { getOrCreateConversation, listConversations, sendMessage, listMessages };