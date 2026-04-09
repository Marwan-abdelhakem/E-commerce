import Joi from "joi";

// Validation schema للـ variation
const variationSchema = Joi.object({
    colorName: Joi.string().trim().required().messages({
        'string.empty': 'Color name is required',
        'any.required': 'Color name is required'
    }),
    colorValue: Joi.string().trim().pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).required().messages({
        'string.pattern.base': 'Color value must be a valid hexa code (e.g., #FF5733 or #F57)',
        'any.required': 'Color value is required'
    }),
    isDefault: Joi.boolean().default(false),
    stock: Joi.number().min(0).required().messages({
        'number.min': 'Stock cannot be negative',
        'any.required': 'Stock is required for each variation'
    })
});

// Validation schema لإنشاء منتج
export const createProductSchema = Joi.object({
    name: Joi.string().trim().min(3).max(200).required().messages({
        'string.empty': 'Product name is required',
        'string.min': 'Product name must be at least 3 characters',
        'string.max': 'Product name cannot exceed 200 characters',
        'any.required': 'Product name is required'
    }),
    description: Joi.string().trim().max(2000).optional().messages({
        'string.max': 'Description cannot exceed 2000 characters'
    }),
    price: Joi.number().min(0).required().messages({
        'number.min': 'Price cannot be negative',
        'any.required': 'Price is required'
    }),
    category: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
        'string.pattern.base': 'Invalid category ID format',
        'any.required': 'Category is required'
    }),
    variations: Joi.string().required().custom((value, helpers) => {
        try {
            const parsed = JSON.parse(value);
            if (!Array.isArray(parsed) || parsed.length === 0) {
                return helpers.error('any.invalid');
            }
            
            // Validate each variation
            for (const variation of parsed) {
                const { error } = variationSchema.validate(variation);
                if (error) {
                    return helpers.error('any.invalid', { message: error.message });
                }
            }
            
            return value;
        } catch (error) {
            return helpers.error('any.invalid');
        }
    }).messages({
        'any.required': 'At least one variation is required',
        'any.invalid': 'Invalid variations format or data'
    })
});

// Validation schema لتحديث منتج
export const updateProductSchema = Joi.object({
    name: Joi.string().trim().min(3).max(200).optional(),
    description: Joi.string().trim().max(2000).optional(),
    price: Joi.number().min(0).optional(),
    category: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
    featured: Joi.boolean().optional(),
    visible: Joi.boolean().optional()
}).min(1).messages({
    'object.min': 'At least one field must be provided for update'
});

// Validation schema للـ MongoDB ObjectId
export const mongoIdSchema = Joi.object({
    id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
        'string.pattern.base': 'Invalid ID format',
        'any.required': 'ID is required'
    })
}).required();

