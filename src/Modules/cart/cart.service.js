import successResponse from "../../Utlis/successResponse.utlis.js";
import CartModel from "../../DB/model/cart.model.js"
import ProductModel from "../../DB/model/product.model.js";



export const addToCart = async (req, res, next) => {
    const { productId, quantity, variationId } = req.body;
    const userId = req.user._id; // هنجيبه من التوكن زي ما اتفقنا

    const product = await ProductModel.findById(productId);
    if (!product) return next(new Error("Product not found", { cause: 404 }));

    let cart = await CartModel.findOne({ user: userId });

    if (!cart) {
        cart = await CartModel.create({
            user: userId,
            items: [{ product: productId, quantity, variationId }]
        });
    } else {
        const itemIndex = cart.items.findIndex(item =>
            item.product.toString() === productId &&
            item.variationId === variationId
        );

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity, variationId });
        }

        await cart.save();
    }

    return successResponse({
        res,
        statusCode: 201,
        message: "Product added to cart",
        data: cart
    });
};

export const removeFromCart = async (req, res, next) => {
    const { productId, variationId } = req.body;
    const userId = req.user._id;

    const cart = await CartModel.findOneAndUpdate(
        { user: userId },
        {
            $pull: {
                items: {
                    product: productId,
                    ...(variationId && { variationId })
                }
            }
        },
        { new: true }
    ).populate({
        path: "items.product",
        model: "Product",
        select: "name price"
    });

    if (!cart) {
        return next(new Error("Cart not found", { cause: 404 }));
    }

    return successResponse({
        res,
        message: "Item removed from cart successfully",
        data: cart
    });
};
