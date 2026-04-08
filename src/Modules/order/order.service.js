import successResponse from "../../Utlis/successResponse.utlis.js";
import ProductModel from "../../DB/model/product.model.js";
import OrderModel from "../../DB/model/order.model.js";
import UserModel from "../../DB/model/User.model.js";

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

export const getOrderById = async (req, res, next) => {
    const { id } = req.params;

    const order = await OrderModel.findById(id)


    if (!order) {
        return next(new Error("Order not found", { cause: 404 }));
    }

    return successResponse({
        res,
        message: "Order fetched successfully",
        data: order
    });
};

export const getUserOrders = async (req, res, next) => {
    const userId = req.user._id;

    const orders = await OrderModel.find({ user: userId })
        .sort({ createdAt: -1 });
    return successResponse({
        res,
        message: "User orders fetched successfully",
        data: orders
    });
};