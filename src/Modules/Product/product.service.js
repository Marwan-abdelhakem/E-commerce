import successResponse from "../../Utlis/successResponse.utlis.js";
import ProductModel from "../../DB/model/product.model.js"
import cloudinary from "../../config/cloudinary.js"
import streamifier from "streamifier";

const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "ecommerce_products" },
            (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url);
            }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
    });
};

export const createProducts = async (req, res, next) => {
    try {
        let { name, description, price, category, variations } = req.body;

        // Parse variations (لو جاية كـ string من FormData)
        let parsedVariations = [];
        try {
            parsedVariations = typeof variations === 'string' ? JSON.parse(variations) : variations;
        } catch (error) {
            return next(new Error("Invalid variations format. Expected a JSON array.", { cause: 400 }));
        }

        // Validation: التأكد من وجود variation واحد على الأقل
        if (!Array.isArray(parsedVariations) || parsedVariations.length === 0) {
            return next(new Error("At least one variation is required", { cause: 400 }));
        }

        const finalVariations = [];

        // معالجة كل variation
        for (let i = 0; i < parsedVariations.length; i++) {
            let variant = parsedVariations[i];

            // Validation: التأكد من البيانات الأساسية
            if (!variant.colorName || !variant.colorValue) {
                return next(new Error(`Variation ${i}: colorName and colorValue are required`, { cause: 400 }));
            }

            // Validation: التأكد من صحة الـ hexa code
            const hexaPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
            if (!hexaPattern.test(variant.colorValue)) {
                return next(new Error(`Variation ${i}: Invalid hexa code format for colorValue`, { cause: 400 }));
            }

            // رفع الصورة الأساسية للـ variation
            let defaultImage = null;
            if (req.files) {
                const defaultImgFile = req.files.find(f => f.fieldname === `variation_${i}_defaultImage`);
                if (defaultImgFile) {
                    defaultImage = await uploadToCloudinary(defaultImgFile.buffer);
                }
            }

            if (!defaultImage) {
                return next(new Error(`Variation ${i}: Default image is required`, { cause: 400 }));
            }

            // رفع الصور الإضافية للـ variation
            const variationImgs = [];
            if (req.files) {
                const additionalImages = req.files.filter(f => 
                    f.fieldname.startsWith(`variation_${i}_image_`)
                );
                
                for (const imgFile of additionalImages) {
                    const uploadedUrl = await uploadToCloudinary(imgFile.buffer);
                    variationImgs.push(uploadedUrl);
                }
            }

            finalVariations.push({
                colorName: variant.colorName.trim(),
                colorValue: variant.colorValue.trim().toUpperCase(),
                defaultImage,
                variationImgs,
                isDefault: variant.isDefault === true || variant.isDefault === 'true',
                stock: Number(variant.stock) || 0
            });
        }

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
    // if (products.length === 0) {
    //     return next(new Error("products Not Founded", { cause: 409 }))
    // }
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