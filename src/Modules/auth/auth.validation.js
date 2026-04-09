import joi from "joi";

// Validation schema للتسجيل
export const signUpValidation = joi.object({
    role: joi.string().valid("user", "admin").optional(),
    fullName: joi.string().min(3).max(20).required().messages({
        "string.min": "Full name must be at least 3 characters",
        "string.max": "Full name cannot exceed 20 characters",
        "any.required": "Full name is required",
        "string.empty": "Full name cannot be empty"
    }),
    userName: joi.string().min(3).max(20).required().messages({
        "string.min": "Username must be at least 3 characters",
        "string.max": "Username cannot exceed 20 characters",
        "any.required": "Username is required",
        "string.empty": "Username cannot be empty"
    }),
    age: joi.number().min(0).required().messages({
        "number.min": "Age cannot be negative",
        "any.required": "Age is required"
    }),
    phone: joi.string().required().messages({
        "any.required": "Phone number is required",
        "string.empty": "Phone number cannot be empty"
    }),
    email: joi.string().email().required().messages({
        "string.email": "Please provide a valid email address",
        "any.required": "Email is required",
        "string.empty": "Email cannot be empty"
    }),
    password: joi.string()
        .min(6)
        .pattern(/[A-Z]/)
        .pattern(/[!@#$%^&*(),.?":{}|<>_\-]/)
        .required()
        .messages({
            "string.min": "Password must be at least 6 characters",
            "string.pattern.base": "Password must contain at least one capital letter and one special character",
            "any.required": "Password is required",
            "string.empty": "Password cannot be empty"
        })
}).required();

// Validation schema لتسجيل الدخول
export const loginValidation = joi.object({
    email: joi.string().email().required().messages({
        "string.email": "Please provide a valid email address",
        "any.required": "Email is required",
        "string.empty": "Email cannot be empty"
    }),
    password: joi.string().required().messages({
        "any.required": "Password is required",
        "string.empty": "Password cannot be empty"
    })
}).required();
