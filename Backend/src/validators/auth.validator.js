import { body, validationResult } from "express-validator"



function validateRequest(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }
    next()
}

export const validRegisterUser = [
    body("email")
        .isEmail().withMessage("Invalid Message Format"),
    body("contact")
        .notEmpty().withMessage("Contact is required")
        .matches(/^\d{10}$/).withMessage("Contact must be of 10 Digits Only"),
    body("password")
        .isLength({ min: 6 }).withMessage("Password must contain atleast 6 letters"),
    body("fullname")
        .notEmpty().withMessage("Fullname is required")
        .isLength({ min: 3 }).withMessage("Fullname must contain atleast 3 letters"),
    body("isSeller")
        .isBoolean().withMessage("isSeller must be a boolean value"),
    validateRequest
]

export const validateLoginUser = [
    body("email")
        .isEmail().withMessage("Invalid Message Format"),
    body("password")
        .isLength({ min: 6 }).withMessage("Password must contain atleast 6 letters"),
validateRequest
]
