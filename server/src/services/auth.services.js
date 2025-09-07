import {User} from '../models/user.model.js'
import jwt from "jsonwebtoken"

const isValidToken = async(token) => {
    const decodedToken = await jwt.verify(token, process.env.JWT_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select("-password");

    if(user) return true;
    else return false;
}

const generateToken = async(email) => {
    const user = await User.findOne({email});
    const token = await user.generateAuthToken();

    return token;
}

export {isValidToken, generateToken};