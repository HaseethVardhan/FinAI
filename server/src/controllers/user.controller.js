import { validationResult } from "express-validator";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Income } from "../models/income.model.js";
import { Expense } from "../models/expense.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { updateAge, updateUserName } from "../services/user.services.js";

const updateUserNameAndAge = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          { errors: errors.array() },
          "Please ensure all fields are filled correctly."
        )
      );
  }

  try {
    const { username, age } = req.body;
    await updateUserName(req.user._id, username);
    await updateAge(req.user._id, age);

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Successfully Updated username and age"));
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Unknown error occured"));
  }
});

const updateIncomeDetails = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          { errors: errors.array() },
          "Please ensure all fields are filled correctly."
        )
      );
  }

  const { incomeDetails } = req.body;
  const user = req.user;

  if (!Array.isArray(incomeDetails)) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Income details must be an array."));
  }

  try {
    const oldIncomeIds = user.income.sources;

    if (oldIncomeIds && oldIncomeIds.length > 0) {
      await Income.deleteMany({ _id: { $in: oldIncomeIds } });
    }

    const newIncomeIds = [];

    for (const detail of incomeDetails) {
      if (detail.type && detail.amount) {
        const newIncome = new Income({
          type: detail.type,
          amount: detail.amount,
        });
        const savedDoc = await newIncome.save();
        newIncomeIds.push(savedDoc._id);
      }
    }
    user.income.sources = newIncomeIds;
    await user.save({ validateBeforeSave: false });
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Income details updated successfully."));
  } catch (error) {
    console.log("Error updating income details:", error);
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          {},
          "Internal server error while updating income details."
        )
      );
  }
});

const updateExpenseDetails = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          { errors: errors.array() },
          "Please ensure all fields are filled correctly."
        )
      );
  }

  const { expenseDetails } = req.body;
  const user = req.user;

  if (!Array.isArray(expenseDetails)) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Expense details must be an array."));
  }

  try {
    const oldExpenseIds = user.expenses.categories;

    if (oldExpenseIds && oldExpenseIds.length > 0) {
      await Expense.deleteMany({ _id: { $in: oldExpenseIds } });
    }

    const newExpenseIds = [];

    for (const detail of expenseDetails) {
      if (detail.name && detail.amount) {
        const newExpense = new Expense({
          name: detail.name,
          amount: detail.amount,
        });
        const savedDoc = await newExpense.save();
        newExpenseIds.push(savedDoc._id);
      }
    }
    user.expenses.categories = newExpenseIds;
    await user.save({ validateBeforeSave: false });
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Expense details updated successfully."));
  } catch (error) {
    console.log("Error updating expense details:", error);
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          {},
          "Internal server error while updating expense details."
        )
      );
  }
});

export { updateUserNameAndAge, updateIncomeDetails, updateExpenseDetails };
