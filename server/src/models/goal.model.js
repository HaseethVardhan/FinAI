import mongoose from "mongoose";

const goalSchema = new mongoose.Schema({
  goalType: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  currentAmount: { type: Number, required: true },
  deadline: { type: Date, required: true },
  priority: { type: String, enum: ["low", "medium", "high"], required: false },
});

export const Goal = mongoose.model("Goal", goalSchema);
