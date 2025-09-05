import mongoose from "mongoose";

const incomeSchema = new mongoose.Schema({
  type: { type: String, required: true },
  amount: { type: Number, required: true },
});

export const Income = mongoose.model("Income", incomeSchema);
