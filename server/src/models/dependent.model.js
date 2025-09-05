import mongoose from "mongoose";

const dependentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  relationship: { type: String, required: true }
});

export const Dependent = mongoose.model("Dependent", dependentSchema);
