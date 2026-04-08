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
    let { name, description, price, category, variations } = req.body;

    let parsedVariations = [];
    if (variations) {
        try {
            parsedVariations = typeof variations === 'string' ? JSON.parse(variations) : variations;
        } catch (error) {
            return next(new Error("Invalid variations format. Expected a JSON array."));
        }
    }

    let totalStock = 0;
    const finalVariations = [];

    if (Array.isArray(parsedVariations)) {
        for (let i = 0; i < parsedVariations.length; i++) {
            let variant = parsedVariations[i];

            totalStock += (Number(variant.stock) || 0);

            if (req.files) {
                const targetFile = req.files.find(f => f.fieldname === `variant_image_${i}`);
                if (targetFile) {
                    variant.defaultImg = await uploadToCloudinary(targetFile.buffer);
                }
            }
            finalVariations.push(variant);
        }
    }

    const newProduct = await ProductModel.create({
        name,
        description,
        price,
        category,
        variations: finalVariations,
        stock: totalStock
    });

    return successResponse({
        res,
        statusCode: 201,
        message: "Product Created Successfully",
        data: newProduct
    });
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
    const { id } = req.params
    const product = await ProductModel.findOneAndUpdate({ _id: id }, { $set: { ...req.body } }, { new: true })
    if (!product) {
        return next(new Error("product Not Founded", { cause: 409 }))
    }
    return successResponse({ res, statusCode: 200, message: "product Update successffully", data: product })
}

export const deleteProduct = async (req, res, next) => {
    const { id } = req.params
    const product = await ProductModel.findOneAndDelete({ _id: id })
    if (!product) {
        return next(new Error("product Not Founded", { cause: 409 }))
    }
    return successResponse({ res, statusCode: 200, message: "product Deleted Successfully" })

}