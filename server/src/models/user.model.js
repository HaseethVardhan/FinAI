import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  password: {
    type: String,
  },
  authType: {
    type: String,
  },
  age: {
    type: Number,
    // required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  },
  income: {
    sources: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Income",
    }],
    // required: true,
  },
  expenses: {
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Expense",
    }],
    // required: true,
  },
  assets: {
    bankBalance: {
      type: Number,
      // required: true,
    },
    investments: {
      type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Investment",
    }],
    },
    otherAssets: { 
      type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Investment",
    }],
    },
  },
  liabilities: {
    loans: {
      type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Loan",
    }],
    },
    creditCards: {
      type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "CreditCard",
    }],
    },
  },
  insurance: {
    lifeInsurance: {
      coverageAmount: { type: Number},
      premium: { type: Number},
    },
    healthInsurance: {
      coverageAmount: { type: Number},
      premium: { type: Number},
    },
  },
  dependents: {
    count: {
      type: Number,
      default: 0,
    },
    details: {
      type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dependent",
    }],
    },
  },
  goals: {
    type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Goal",
    }],
  },
  emergencyFund: {
    type: Number,
    default: 0,
  },
  creditScore: {
    type: Number,
  },
  insights: {
    type: [
      String,
    ]
  },
},{
    timestamps: true
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAuthToken = async function () {
  const token = await jwt.sign(
    { _id: this._id },
    process.env.JWT_TOKEN_SECRET,
    { expiresIn: "10d" }
  );
  return token;
};

export const User = mongoose.model("User", userSchema);
