import passport from "passport";
import { Router } from "express";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { isUserExists, userStatus, createNewUser } from "../services/user.services.js";
import {isValidToken, generateToken} from "../services/auth.services.js"

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/landing`,
    session: false,
  }),
  async (req, res) => {
    try {
      const email = req.user;
      const authType = "google";
      let status = "pending";

      const bol = await isUserExists(email);
      
      if(!bol) {
        createNewUser(email, authType, "");
      }else {
        status = await userStatus(email);
      }

      const token = await generateToken(email);

      res.redirect(
        `${process.env.CLIENT_URL}/auth/redirect?token=${token}&status=${status}`
      );
    } catch (error) {
      console.log(error);
      res.redirect(`${process.env.CLIENT_URL}/landing`);
    }
  }
);

router.route("/get-token").post(async (req, res) => {
  try {
    const { user } = req.body;
    if (!user) {
      return res.status(401).json(new ApiResponse(401, null, "Unauthorized"));
    }
    const findUser = await User.findById(user);
    const token = await findUser.generateAuthToken();
    res
      .status(200)
      .json(new ApiResponse(200, { token }, "Token retrieved successfully"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
  }
});

router.route("/checkValidToken").post(async (req, res) => {
  const {token} = req.body;
  if(isValidToken(token)) {
    return res 
    .status(200)
    .json(new ApiResponse(
      200,
      {isValid : "true"},
      "Valid token"
    ))
  } else {
    return res
    .status(200)
    .json(new ApiResponse(
      200,
      {isValid : "false"},
      "Invalid token"
    ))
  }
})

export default router;
