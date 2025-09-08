import { validationResult } from "express-validator";
import { ApiResponse } from "../utils/ApiResponse.js";
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
    const {username, age} = req.body;
    await updateUserName(req.user._id, username);
    await updateAge(req.user._id, age);

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "Successfully Updated username and age"
        )
    )
  } catch (error) {
    console.log(error);
    return res
    .status(400)
    .json(
        new ApiResponse(
            400,
            {},
            "Unknown error occured"
        )
    )
  }


});

export {updateUserNameAndAge};