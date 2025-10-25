import { validationResult } from "express-validator";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Income } from "../models/income.model.js";
import { Loan } from "../models/loan.model.js"
import { CreditCard } from "../models/creditcard.model.js"
import {Dependent} from "../models/dependent.model.js"
import { Expense } from "../models/expense.model.js";
import { Investment } from "../models/investment.model.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { getExpensesService, getIncomeService, updateAge, updateUserName, getAssetsService, getLiabilitiesService, getDependentsService, getEmergencyFundService, getCreditScoreService } from "../services/user.services.js";

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
      if (detail.name && detail.amount) {
        const newIncome = new Income({
          type: detail.name,
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

const updateAssets = asyncHandler(async (req,res) => {
  const user = req.user;
  const { bankBalance, investments, otherAssets } = req.body;

  try {
    const oldAssetIds = [
        ...(user.assets.investments || []), 
        ...(user.assets.otherAssets || [])
      ];
  
    if (oldAssetIds.length > 0) {
      await Investment.deleteMany({ _id: { $in: oldAssetIds } });
    }
  
    if (investments && Array.isArray(investments) && investments.length > 0) {
      const createdInvestments = await Investment.insertMany(investments);
      user.assets.investments = createdInvestments.map(inv => inv._id);
    } else {
      user.assets.investments = [];
    }
  
    if (otherAssets && Array.isArray(otherAssets) && otherAssets.length > 0) {
      const createdOtherAssets = await Investment.insertMany(otherAssets);
      user.assets.otherAssets = createdOtherAssets.map(asset => asset._id);
    } else {
      user.assets.otherAssets = [];
    }
  
    if (bankBalance !== undefined) {
      user.assets.bankBalance = bankBalance;
    }
  
    const updatedUser = await user.save();
  } catch (error) {
    console.log(error)
    return res
    .status(400)
    .json(
      new ApiResponse(
        400,
        {},
        "Internal error occured"
      )
    )
  }

   return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "Assets Updated Successfully"
      )
    )

});

const updateLiabilities = asyncHandler(async (req, res) => {
  const user = req.user;
  const { loans, creditCards } = req.body;

  try {
    if (user.liabilities.loans && user.liabilities.loans.length > 0) {
      await Loan.deleteMany({ _id: { $in: user.liabilities.loans } });
    }
    if (user.liabilities.creditCards && user.liabilities.creditCards.length > 0) {
      await CreditCard.deleteMany({ _id: { $in: user.liabilities.creditCards } });
    }
  
    if (loans && Array.isArray(loans)) {
      const createdLoans = await Loan.insertMany(loans);
      user.liabilities.loans = createdLoans.map(loan => loan._id);
    } else {
      user.liabilities.loans = [];
    }
  
    if (creditCards && Array.isArray(creditCards)) {
      const createdCreditCards = await CreditCard.insertMany(creditCards);
      user.liabilities.creditCards = createdCreditCards.map(cc => cc._id);
    } else {
      user.liabilities.creditCards = [];
    }
  
    const updatedUser = await user.save();
  } catch (error) {
    console.log(error)
    return res
    .status(400)
    .json(
      new ApiResponse(
        400,
        {},
        "Internal error occured"
      )
    )
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "Liabilities Updated Successfully"
      )
    )

});

const updateInsurance = asyncHandler(async (req, res) => {
  const user = req.user;
  const { lifeInsurance, healthInsurance } = req.body;

  try {
    if (!user.insurance) {
      user.insurance = {};
    }else{
      if(user.insurance.lifeInsurance) {
        user.insurance.lifeInsurance = {};
      }
      if(user.insurance.healthInsurance) {
        user.insurance.healthInsurance = {};
      }
    }
    

    if (lifeInsurance) {
      user.insurance.lifeInsurance = {
        coverageAmount: lifeInsurance.coverageAmount ?? user.insurance.lifeInsurance?.coverageAmount,
        premium: lifeInsurance.premium ?? user.insurance.lifeInsurance?.premium,
      };
    }

    if (healthInsurance) {
      user.insurance.healthInsurance = {
        coverageAmount: healthInsurance.coverageAmount ?? user.insurance.healthInsurance?.coverageAmount,
        premium: healthInsurance.premium ?? user.insurance.healthInsurance?.premium,
      };
    }
    await user.save({ validateModifiedOnly: true });

  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          {},
          "Internal error occurred while updating insurance"
        )
      );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "Insurance Updated Successfully"
      )
    );
})

const updateDependents = asyncHandler(async (req, res) => {
  const user = req.user;
  const { details } = req.body;

  try {
    if (user.dependents && user.dependents.details && user.dependents.details.length > 0) {
      await Dependent.deleteMany({ _id: { $in: user.dependents.details } });
    }
    
    if (!user.dependents) {
        user.dependents = {};
    }

    if (details && Array.isArray(details) && details.length > 0) {
      const createdDependents = await Dependent.insertMany(details);
      user.dependents.details = createdDependents.map(dep => dep._id);
      user.dependents.count = createdDependents.length;
    } else {
      user.dependents.details = [];
      user.dependents.count = 0;
    }

    await user.save({ validateModifiedOnly: true });

  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          {},
          "Internal error occurred while updating dependents"
        )
      );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "Dependents Updated Successfully"
      )
    );
})

const updateOtherDetails = asyncHandler(async (req, res) => {
  const user = req.user;
  const { emergencyFund, creditScore } = req.body;

  try {
    if (emergencyFund) {
      user.emergencyFund = emergencyFund;
    } else {
      user.emergencyFund = 0;
    }

    if (creditScore) {
      user.creditScore = creditScore;
    } else {
      user.creditScore = null;
    }

    await user.save({ validateModifiedOnly: true });

  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          {},
          "Internal error occurred while updating details"
        )
      );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "Details Updated Successfully"
      )
    );
})

const getUserNameAndAge = asyncHandler(async (req, res) => {
  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      {
        username,
        age
      },
      "Details fetched successfully"
    )
  )
})

const getIncomeDetails = asyncHandler(async (req, res) => {
  const income = await getIncomeService(user);
  if(income === null) {
    return res
    .status(400)
    .json(
      new ApiResponse(
        400,
        {},
        "No income details found"
      )
    )
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        income,
        "Income details fetched successfully"
      )
    )
})

const getExpenseDetails = asyncHandler(async (req, res) => {
  const expense = await getExpensesService(user);
  if(expense === null) {
    return res
    .status(400)
    .json(
      new ApiResponse(
        400,
        {},
        "No expense details found"
      )
    )
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        expense,
        "Expense details fetched successfully"
      )
    )
})

const getAssets = asyncHandler(async (req, res) => {
  const assets = await getAssetsService(req.user);
  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      assets,
      "Assets fetched successfully"
    )
  )
})

const getLiabilities = asyncHandler(async (req, res) => {
  const liabilities = await getLiabilitiesService(req.user);
  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      liabilities,
      "Liabilities fetched successfully"
    )
  )
})

const getInsurance = asyncHandler(async (req, res) => {
  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      req.user.insurance,
      "Insurance fetched successfully"
    )
  )
})

const getDependents = asyncHandler(async (req, res) => {
  const dependents = await getDependentsService(req.user);
  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      dependents,
      "Dependents fetched successfully"
    )
  )
})

const getOtherDetails = asyncHandler(async (req, res) => {
  const emergencyFund = await getEmergencyFundService(req.user);
  const creditScore = await getCreditScoreService(req.user);
  const otherDetails = {
    emergencyFund : emergencyFund || 0,
    creditScore : creditScore || 0
  }
  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      otherDetails,
      "OtherDetails fetched successfully"
    )
  )
})

const getDashboardSummary = asyncHandler(async (req, res) => {
  const user = req.user;
  const [incomeData, expensesData, assetsData, liabilitiesData] =
    await Promise.all([
      getIncomeService(user),
      getExpensesService(user),
      getAssetsService(user),
      getLiabilitiesService(user),
    ]);

  const totalIncome =
    incomeData?.sources?.reduce((acc, source) => acc + source.amount, 0) || 0;
  const totalExpenses =
    expensesData?.categories?.reduce(
      (acc, category) => acc + category.amount,
      0
    ) || 0;

  const totalAssets =
    (assetsData?.investments?.reduce(
      (acc, asset) => acc + asset.currentValue,
      0
    ) || 0) +
    (assetsData?.otherAssets?.reduce(
      (acc, asset) => acc + asset.currentValue,
      0
    ) || 0);

  const totalLiabilities =
    (liabilitiesData?.loans?.reduce(
      (acc, loan) => acc + loan.outstandingBalance,
      0
    ) || 0) +
    (liabilitiesData?.creditCards?.reduce(
      (acc, card) => acc + card.outstandingBalance,
      0
    ) || 0);


  const netSavings = totalIncome - totalExpenses;
  const netWorth = totalAssets - totalLiabilities;

  const expensesByCategory =
    expensesData?.categories?.map((category) => ({
      name: category.name,
      value: category.amount,
    })) || [];

  const expensesTable =
    expensesData?.categories?.map((category) => ({
      category: category.name,
      amount: category.amount,
      percentage:
        totalExpenses > 0
          ? parseFloat(((category.amount / totalExpenses) * 100).toFixed(2))
          : 0,
    })) || [];

    const incomesByCategory =
    incomeData?.sources?.map((category) => ({
      name: category.name,
      value: category.amount,
    })) || [];

  const incomesTable =
    incomeData?.sources?.map((source) => ({
      source: source.name,
      amount: source.amount,
      percentage:
        totalIncome > 0
          ? parseFloat(((source.amount / totalIncome) * 100).toFixed(2))
          : 0,
    })) || [];

  const summary = {
    totalIncome,
    totalExpenses,
    netSavings,
    netWorth,
    totalLiabilities,
    expensesByCategory, 
    expensesTable,
    incomesByCategory,
    incomesTable,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(200, summary, "Financial summary fetched successfully")
    );
});

const changeStatus = asyncHandler(async (req, res) => {
  const user = req.user;

  user.status = "completed";

  await user.save({ validateModifiedOnly: true });

  return res
  .status(200)
  .json(
    new ApiResponse(200, {}, "Success")
  )
})

export { 
  updateUserNameAndAge, 
  updateIncomeDetails, 
  updateExpenseDetails, 
  updateAssets, 
  updateLiabilities, 
  updateInsurance, 
  updateDependents, 
  updateOtherDetails,
  getUserNameAndAge,
  getIncomeDetails,
  getExpenseDetails,
  getAssets,
  getLiabilities,
  getInsurance,
  getDependents,
  getOtherDetails,
  getDashboardSummary,
  changeStatus
};
