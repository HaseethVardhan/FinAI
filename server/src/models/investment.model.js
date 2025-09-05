import mongoose from "mongoose";

const investmentSchema = new mongoose.Schema({
  type: { type: String, required: true },
  value: { type: Number, required: true }
});

export const Investment = mongoose.model("Investment", investmentSchema);
