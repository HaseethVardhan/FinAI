import { User } from "../models/user.model.js";

const isUserExists = async (email) => {
  const user = await User.findOne({ email });
  if (user) {
    return true;
  } else {
    return false;
  }
};

const userStatus = async (email) => {
  const user = await User.findOne({ email });
  return user.status;
};

const createNewUser = async (email, authType, password) => {
  const userPayload = {
    email,
    authType,
  };

  if (String(authType).toLowerCase() !== "google") {
    userPayload.password = password;
  }

  try {
    const newUser = await User.create(userPayload);
    console.log(newUser)
  } catch (error) {
    console.log(error);
  }
};

const updateUserName = async (userId, username) => {
  try {
    const user = await User.findByIdAndUpdate(userId, { username: username });
  } catch (error) {
    console.log(error);
  }
}

const updateAge = async (userId, age) => {
  try {
    const user = await User.findByIdAndUpdate(userId, {age : age});
  } catch (error) {
    console.log(error);
  }
}

const getAgeService = async (user) => {
  if(user.age) {
    return user.age;
  }

  return null;
}

const getUsernameService = async (user) => {
  if (user.username) {
    return user.username;
  }
  return null;
};

const getEmailService = async (user) => {
  if (user.email) {
    return user.email;
  }
  return null;
};

const getPasswordService = async (user) => {
  if (user.password) {
    return user.password;
  }
  return null;
};

const getAuthTypeService = async (user) => {
  if (user.authType) {
    return user.authType;
  }
  return null;
};

const getStatusService = async (user) => {
  if (user.status) {
    return user.status;
  }
  return null;
};

const getIncomeService = async (user) => {
  if (user.income && user.income.sources && user.income.sources.length > 0) {
    await user.populate('income.sources');
    return user.income;
  }
  return null;
};

const getExpensesService = async (user) => {
  if (user.expenses && user.expenses.categories && user.expenses.categories.length > 0) {
    await user.populate('expenses.categories');
    return user.expenses;
  }
  return null;
};

const getAssetsService = async (user) => {
  if (user.assets) {
    await user.populate([
        { path: 'assets.investments' },
        { path: 'assets.otherAssets' }
    ]);
    return user.assets;
  }
  return null;
};

const getLiabilitiesService = async (user) => {
  if (user.liabilities) {
    await user.populate([
        { path: 'liabilities.loans' },
        { path: 'liabilities.creditCards' }
    ]);
    return user.liabilities;
  }
  return null;
};

const getInsuranceService = async (user) => {
  if (user.insurance) {
    return user.insurance;
  }
  return null;
};

const getDependentsService = async (user) => {
  if (user.dependents && user.dependents.details && user.dependents.details.length > 0) {
    await user.populate('dependents.details');
    return user.dependents;
  }
  if (user.dependents) {
      return user.dependents;
  }
  return null;
};

const getGoalsService = async (user) => {
  if (user.goals && user.goals.length > 0) {
    await user.populate('goals');
    return user.goals;
  }
  return null;
};

const getEmergencyFundService = async (user) => {
  if (user.emergencyFund && user.emergencyFund !== undefined) {
    return user.emergencyFund;
  }
  return null;
};

const getCreditScoreService = async (user) => {
  if (user.creditScore) {
    return user.creditScore;
  }
  return null;
};


export { isUserExists, userStatus, createNewUser, updateUserName, updateAge, getAgeService, getAssetsService, getAuthTypeService, getCreditScoreService, getDependentsService, getEmailService, getEmergencyFundService, getExpensesService, getGoalsService, getIncomeService, getInsuranceService, getLiabilitiesService, getPasswordService, getStatusService, getUsernameService };
