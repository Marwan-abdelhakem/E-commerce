import joi from "joi";

// Validation schema لإنشاء تصنيف
export const createCategorySchema = joi.object({
    name: joi.string().trim().min(2).max(50).required().messages({
        "string.empty": "Category name is required",
        "string.min": "Category name must be at least 2 characters",
        "string.max": "Category name cannot exceed 50 characters",
        "any.required": "Category name is required"
    })
}).required();

// Validation schema لتحديث تصنيف
export const updateCategorySchema = joi.object({
    name: joi.string().trim().min(2).max(50).required().messages({
        "string.empty": "Category name is required",
        "string.min": "Category name must be at least 2 characters",
        "string.max": "Category name cannot exceed 50 characters",
        "any.required": "Category name is required"
    })
}).required();

// Validation schema للـ MongoDB ObjectId
export const mongoIdSchema = joi.object({
    id: joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
        "string.pattern.base": "Invalid ID format",
        "any.required": "ID is required"
    })
}).required();
