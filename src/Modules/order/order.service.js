import successResponse from "../../Utlis/successResponse.utlis.js";
import ProductModel from "../../DB/model/product.model.js";
import OrderModel from "../../DB/model/order.model.js";
import UserModel from "../../DB/model/User.model.js";


export const createOrder = async (req, res, next) => {
    const { items } = req.body; // اليوزر هيبعت [{ product, quantity, variationId }]
    const userId = req.user._id;

    let finalItems = [];
    let totalPrice = 0;

    for (const item of items) {
        const product = await ProductModel.findById(item.product);
        if (!product) return next(new Error("Product not found"));

        // 1. لو اليوزر مختار variation معين
        if (item.variationId) {
            const variation = product.variations.find(v => v._id.toString() === item.variationId);

            if (!variation) return next(new Error("Variation not found"));

            // التأكد من الـ stock بتاع الـ variation
            if (variation.stock < item.quantity) {
                return next(new Error(`Only ${variation.stock} left for this color/size`));
            }

            // خصم من الـ stock بتاع الـ variation
            variation.stock -= item.quantity;
        } else {
            // لو مفيش variation (منتج بسيط)، نخصم من الـ stock العام
            if (product.stock < item.quantity) return next(new Error("Out of stock"));
            product.stock -= item.quantity;
        }

        totalPrice += product.price * item.quantity;
        finalItems.push({
            product: product._id,
            quantity: item.quantity,
            variationId: item.variationId // نسيف الـ ID عشان نعرف اليوزر اختار إيه
        });

        await product.save();
    }

    const order = await OrderModel.create({
        user: userId,
        items: finalItems,
        totalPrice
    });

    return successResponse({ res, data: order });
};

export const getOrderById = async (req, res, next) => {
    const { id } = req.params;

    let order = await OrderModel.findById(id)
        .populate("user", "name email")
        .populate("items.product", "name price variations");

    if (!order) return next(new Error("Order not found"));

    const orderObj = order.toObject();

    orderObj.items = orderObj.items.map(item => {
        if (item.variationId && item.product.variations) {
            item.product.variations = item.product.variations.filter(
                v => v._id.toString() === item.variationId.toString()
            );
        }
        return item;
    });

    return successResponse({ res, data: orderObj });
};

export const getUserOrders = async (req, res, next) => {
    const userId = req.user._id;

    const orders = await OrderModel.find({ user: userId })
        .populate({
            path: "items.product",
            model: "Product",
            select: "name price variations defaultImg"
        })
        .sort({ createdAt: -1 });

    const ordersObj = orders.map(order => {
        const orderData = order.toObject();

        orderData.items = orderData.items.map(item => {
            if (item.variationId && item.product && item.product.variations) {
                item.product.variations = item.product.variations.filter(
                    v => v._id.toString() === item.variationId.toString()
                );
            }
            return item;
        });

        return orderData;
    });

    return successResponse({
        res,
        message: "User orders fetched successfully",
        data: ordersObj
    });
};

export const getAllOrders = async (req, res, next) => {
    try {
        // جلب جميع الطلبات بدون فلاتر
        const orders = await OrderModel.find()
            .populate("user", "name email phone")
            .populate({
                path: "items.product",
                model: "Product",
                select: "name price variations"
            })
            .sort({ createdAt: -1 });

        // معالجة الـ variations
        const ordersObj = orders.map(order => {
            const orderData = order.toObject();

            orderData.items = orderData.items.map(item => {
                if (item.variationId && item.product && item.product.variations) {
                    item.product.variations = item.product.variations.filter(
                        v => v._id.toString() === item.variationId.toString()
                    );
                }
                return item;
            });

            return orderData;
        });

        return successResponse({
            res,
            message: "All orders fetched successfully",
            data: ordersObj
        });
    } catch (error) {
        return next(error);
    }
};
