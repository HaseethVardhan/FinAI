import mongoose from "mongoose";

const loanSchema = new mongoose.Schema({
  type: { type: String, required: true },
  outstanding: { type: Number, required: true },
  monthlyEMI: { type: Number, required: true }
});

export const Loan = mongoose.model("Loan", loanSchema);
