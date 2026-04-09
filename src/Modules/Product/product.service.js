import successResponse from "../../Utlis/successResponse.utlis.js";
import ProductModel from "../../DB/model/product.model.js"

export const createProducts = async (req, res, next) => {
    try {
        let { name, description, price, category, variations } = req.body;

        // Validation: التأكد من وجود variations
        if (!variations || !Array.isArray(variations) || variations.length === 0) {
            return next(new Error("At least one variation is required", { cause: 400 }));
        }

        // معالجة كل variation
        const finalVariations = variations.map((variant, i) => {
            // Validation: التأكد من البيانات الأساسية
            if (!variant.colorName || !variant.colorValue || !variant.defaultImage) {
                throw new Error(`Variation ${i}: colorName, colorValue, and defaultImage are required`);
            }

            // Validation: التأكد من صحة الـ hexa code
            const hexaPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
            if (!hexaPattern.test(variant.colorValue)) {
                throw new Error(`Variation ${i}: Invalid hexa code format for colorValue`);
            }

            return {
                colorName: variant.colorName.trim(),
                colorValue: variant.colorValue.trim().toUpperCase(),
                defaultImage: variant.defaultImage,
                variationImgs: variant.variationImgs || [],
                isDefault: variant.isDefault === true,
                stock: Number(variant.stock) || 0
            };
        });

        // التأكد من وجود variation واحد على الأقل isDefault
        const hasDefault = finalVariations.some(v => v.isDefault === true);
        if (!hasDefault) {
            finalVariations[0].isDefault = true;
        }

        // التأكد من وجود default واحد فقط
        const defaultCount = finalVariations.filter(v => v.isDefault).length;
        if (defaultCount > 1) {
            return next(new Error("Only one variation can be set as default", { cause: 400 }));
        }

        // إنشاء المنتج (الـ stock هيتحسب تلقائياً في الـ pre-save middleware)
        const newProduct = await ProductModel.create({
            name,
            description,
            price,
            category,
            variations: finalVariations
        });

        return successResponse({
            res,
            statusCode: 201,
            message: "Product Created Successfully",
            data: newProduct
        });
    } catch (error) {
        return next(error);
    }
};

export const getAllProducts = async (req, res, next) => {
    const products = await ProductModel.find()
    if (products.length === 0) {
        return next(new Error("products Not Founded", { cause: 409 }))
    }
    return successResponse({ res, statusCode: 200, message: "successfully", data: products })
}

export const getProductById = async (req, res, next) => {
    const { id } = req.params
    const product = await ProductModel.find({ _id: id })
    if (product.length === 0) {
        return next(new Error("product Not Founded", { cause: 409 }))
    }
    return successResponse({ res, statusCode: 200, message: "successfully", data: product })
}


export const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        // لو في variations في الـ update، نعالجها
        if (updateData.variations && Array.isArray(updateData.variations)) {
            const finalVariations = updateData.variations.map((variant, i) => {
                // Validation: التأكد من البيانات الأساسية
                if (!variant.colorName || !variant.colorValue || !variant.defaultImage) {
                    throw new Error(`Variation ${i}: colorName, colorValue, and defaultImage are required`);
                }

                // Validation: التأكد من صحة الـ hexa code
                const hexaPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
                if (!hexaPattern.test(variant.colorValue)) {
                    throw new Error(`Variation ${i}: Invalid hexa code format for colorValue`);
                }

                return {
                    colorName: variant.colorName.trim(),
                    colorValue: variant.colorValue.trim().toUpperCase(),
                    defaultImage: variant.defaultImage,
                    variationImgs: variant.variationImgs || [],
                    isDefault: variant.isDefault === true,
                    stock: Number(variant.stock) || 0
                };
            });

            // التأكد من وجود variation واحد على الأقل isDefault
            const hasDefault = finalVariations.some(v => v.isDefault === true);
            if (!hasDefault) {
                finalVariations[0].isDefault = true;
            }

            // التأكد من وجود default واحد فقط
            const defaultCount = finalVariations.filter(v => v.isDefault).length;
            if (defaultCount > 1) {
                return next(new Error("Only one variation can be set as default", { cause: 400 }));
            }

            updateData.variations = finalVariations;
        }

        const product = await ProductModel.findOneAndUpdate(
            { _id: id }, 
            { $set: updateData }, 
            { new: true, runValidators: true }
        );

        if (!product) {
            return next(new Error("product Not Founded", { cause: 409 }));
        }

        return successResponse({ 
            res, 
            statusCode: 200, 
            message: "product Update successffully", 
            data: product 
        });
    } catch (error) {
        return next(error);
    }
}

export const deleteProduct = async (req, res, next) => {
    const { id } = req.params
    const product = await ProductModel.findOneAndDelete({ _id: id })
    if (!product) {
        return next(new Error("product Not Founded", { cause: 409 }))
    }
    return successResponse({ res, statusCode: 200, message: "product Deleted Successfully" })

}