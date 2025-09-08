import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {User} from '../models/user.model.js'
import jwt from "jsonwebtoken"

export const verifyUser = asyncHandler(async (req,res, next) => {
    
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    if(!token){
        console.log("User not found");
        return res.
        status(400)
        .json(new ApiResponse(400, {message: "Unauthorized User"}, "Unauthorized User"))
    }
    
    const decodedToken = await jwt.verify(token, process.env.JWT_TOKEN_SECRET);
    

    const user = await User.findById(decodedToken?._id).select("-password");

    if(!user){
        return res.
        status(400)
        .json(new ApiResponse(400, {message: "Unauthorized User"}, "Unauthorized User"))
    }

    req.user = user;
    
    next();
})

export default verifyUser;