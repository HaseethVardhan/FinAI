import { User } from "../models/user.model.js";
import {asyncHandler} from '../utils/asyncHandler.js'

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

export { isUserExists, userStatus, createNewUser };
