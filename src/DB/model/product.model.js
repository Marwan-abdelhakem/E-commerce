import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true, // زيادة جدعنة عشان يشيل المسافات الزايدة
        },

        description: {
            type: String,
        },

        price: {
            type: Number,
            required: true,
        },

        stock: {
            type: Number,
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },

        variations: [
            {
                colorName: { type: String },
                colorValue: { type: String },
                defaultImg: { type: String },
                variantImages: [{ type: String }], // Array of strings (links)
                defaultVariant: { type: Boolean, default: false },
                stock: { type: Number, default: 0 },
            },
        ],

        featured: {
            type: Boolean,
            default: false,
        },

        visible: {
            type: Boolean,
            default: true,
        },

        deleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const ProductModel = mongoose.models.Product || mongoose.model("Product", productSchema);

export default ProductModel;