import mongoose from "mongoose";

const creditCardSchema = new mongoose.Schema({
  cardName: { type: String, required: true },
  balance: { type: Number, required: true },
  creditLimit: { type: Number, required: true }
});

export const CreditCard = mongoose.model("CreditCard", creditCardSchema);
