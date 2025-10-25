import mongoose from "mongoose";

const investmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true }
});

export const Investment = mongoose.model("Investment", investmentSchema);
