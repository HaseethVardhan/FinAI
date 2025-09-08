import { Router } from "express";
import { body } from "express-validator";
import verifyUser from "../middleware/auth.middleware.js"
import { updateUserNameAndAge } from "../controllers/user.controller.js";

const router = Router();

router.route("/updateUserNameAndAge").post([
    body('username').isString().notEmpty().withMessage("Username is required"),
    body('username').matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain a-z, A-Z, 0-9 and _'),
    body('age').isNumeric().isInt({ min: 16, max: 60 }).withMessage('Age must be between 16 and 60')
], verifyUser, updateUserNameAndAge)

export default router;