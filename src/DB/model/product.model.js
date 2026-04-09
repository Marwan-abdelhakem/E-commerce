import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        stock: {
            type: Number,
            default: 0,
            min: 0,
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },

        variations: [
            {
                colorName: { 
                    type: String, 
                    required: true,
                    trim: true 
                },
                colorValue: { 
                    type: String, 
                    required: true,
                    match: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, // Hexa code validation
                },
                defaultImage: { 
                    type: String,
                    required: true 
                },
                variationImgs: [{ type: String }],
                isDefault: { 
                    type: Boolean, 
                    default: false 
                },
                stock: { 
                    type: Number, 
                    required: true,
                    min: 0,
                    default: 0 
                },
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

        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

// Middleware لحساب الـ stock الكلي والتأكد من وجود default قبل الحفظ
productSchema.pre('save', function() {
    // حساب الـ stock الكلي
    if (this.variations && this.variations.length > 0) {
        this.stock = this.variations.reduce((total, variant) => total + (variant.stock || 0), 0);
        
        // التأكد من وجود variation واحد على الأقل isDefault
        const hasDefault = this.variations.some(v => v.isDefault === true);
        if (!hasDefault) {
            // لو مفيش default، خلي أول واحد هو الـ default
            this.variations[0].isDefault = true;
        }
    }
});

const ProductModel = mongoose.models.Product || mongoose.model("Product", productSchema);

export default ProductModel;
