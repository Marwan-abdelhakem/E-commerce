import successResponse from "../../Utlis/successResponse.utlis.js";
import ProductModel from "../../DB/model/product.model.js";
import OrderModel from "../../DB/model/order.model.js";

export const createOrder = async (req, res, next) => {
    const { items } = req.body;
    const userId = req.user._id;

    let finalItems = [];
    let totalPrice = 0;

    for (const item of items) {
        const product = await ProductModel.findById(item.product);

        if (!product) {
            return next(new Error(`Product with ID ${item.product} not found!`));
        }

        if (product.stock < item.quantity) {
            return next(new Error(`Sorry, only ${product.stock} units of ${product.name} available.`));
        }

        totalPrice += product.price * item.quantity;

        finalItems.push({
            product: product._id,
            quantity: item.quantity
        });

        product.stock -= item.quantity;
        await product.save();
    }

    const order = await OrderModel.create({
        user: userId,
        items: finalItems,
        totalPrice,
        status: "pending",
        paymentStatus: "unpaid"
    });

    return successResponse({
        res,
        statusCode: 201,
        message: "Order placed successfully",
        data: order
    });
};