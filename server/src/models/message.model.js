import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

  role: { type: String, enum: ['user', 'assistant', 'system', 'summary'], required: true },

  text: { type: String, required: true },

}, {
  timestamps: true 
});

messageSchema.index({ conversation: 1, createdAt: 1 });
messageSchema.index({ user: 1, createdAt: -1 });

export const Message = mongoose.model('Message', messageSchema);