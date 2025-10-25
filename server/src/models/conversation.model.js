import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  id: {type: String, required: true, index:true},
  title: { type: String, default: '' },
}, {
  timestamps: true 
});

conversationSchema.index({ user: 1, updatedAt: -1 });

export const Conversation = new mongoose.model('Conversation', conversationSchema);