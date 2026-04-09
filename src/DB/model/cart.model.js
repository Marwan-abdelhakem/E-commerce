import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users" // تأكد أن اسم الموديل هنا مطابق للي سجلته في User model
    },

    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },

            quantity: {
                type: Number,
                default: 1
            },
            variationId: { type: String }
        }
    ]

}, { timestamps: true });

const CartModel = mongoose.models.Cart || mongoose.model("Cart", cartSchema);

export default CartModel;