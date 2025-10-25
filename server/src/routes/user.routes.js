import { Router } from "express";
import { body } from "express-validator";
import verifyUser from "../middleware/auth.middleware.js"
import { changeStatus, getAssets, getDashboardSummary, getDependents, getExpenseDetails, getIncomeDetails, getInsurance, getLiabilities, getOtherDetails, getUserNameAndAge, updateAssets, updateDependents, updateExpenseDetails, updateIncomeDetails, updateInsurance, updateLiabilities, updateOtherDetails, updateUserNameAndAge } from "../controllers/user.controller.js";

const router = Router();

router.route("/updateUserNameAndAge").post([
    body('username').isString().notEmpty().withMessage("Username is required"),
    body('username').matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain a-z, A-Z, 0-9 and _'),
    body('age').isNumeric().isInt({ min: 16, max: 60 }).withMessage('Age must be between 16 and 60')
], verifyUser, updateUserNameAndAge)

router.route("/updateIncomeDetails").post([
    body('incomeDetails').isArray().withMessage("Income details should be array")
],verifyUser, updateIncomeDetails);

router.route("/updateExpenseDetails").post([
    body('expenseDetails').isArray().withMessage("Expense details should be array")
],verifyUser, updateExpenseDetails);

router.route("/updateAssets").post(verifyUser, updateAssets)

router.route("/updateLiabilities").post(verifyUser, updateLiabilities)

router.route("/updateInsurance").post(verifyUser, updateInsurance)

router.route("/updateDependents").post(verifyUser, updateDependents)

router.route("/updateOtherDetails").post(verifyUser, updateOtherDetails)

router.route("/getUserNameAndAge").post(verifyUser, getUserNameAndAge);

router.route("/getIncomeDetails").post(verifyUser, getIncomeDetails);

router.route("/getExpenseDetails").post(verifyUser, getExpenseDetails);

router.route("/getAssets").post(verifyUser, getAssets);

router.route("/getLiabilities").post(verifyUser, getLiabilities);

router.route("/getInsurance").post(verifyUser, getInsurance);

router.route("/getDependents").post(verifyUser, getDependents);

router.route("/getOtherDetails").post(verifyUser, getOtherDetails);

router.route("/getDashboardSummary").post(verifyUser, getDashboardSummary)

router.route("/changeStatus").post(verifyUser, changeStatus)

export default router;