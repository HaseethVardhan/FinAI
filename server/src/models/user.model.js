import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  income: {
    sources: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Income",
    }],
    required: true,
  },
  expenses: {
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Expense",
    }],
    required: true,
  },
  assets: {
    bankBalance: {
      type: Number,
      required: true,
    },
    investments: {
      type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Investment",
    }],
      required: false,
    },
    otherAssets: {
      type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Investment",
    }],
      required: false,
    },
  },
  liabilities: {
    loans: {
      type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Loan",
    }],
      required: false,
    },
    creditCards: {
      type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "CreditCard",
    }],
      required: false,
    },
  },
  insurance: {
    lifeInsurance: {
      coverageAmount: { type: Number},
      premium: { type: Number},
      required: false,
    },
    healthInsurance: {
      coverageAmount: { type: Number},
      premium: { type: Number},
      required: false,
    },
  },
  dependents: {
    count: {
      type: Number,
      required: false,
      default: 0,
    },
    details: {
      type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dependent",
    }],
      required: false,
    },
  },
  goals: {
    type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Goal",
    }],
    required: false,
  },
  emergencyFund: {
    type: Number,
    required: false,
    default: 0,
  },
  creditScore: {
    type: Number,
    required: false,
  },
},{
    timestamps: true
});

export const User = mongoose.model("User", userSchema);
