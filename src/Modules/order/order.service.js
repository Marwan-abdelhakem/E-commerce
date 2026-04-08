import successResponse from "../../Utlis/successResponse.utlis.js";
import ProductModel from "../../DB/model/product.model.js";
import OrderModel from "../../DB/model/order.model.js";

export const createOrder = async (req, res, next) => {
    const { items } = req.body;
    const userId = req.user._id; // بنجيبه من الـ auth middleware

    let finalItems = [];
    let totalPrice = 0;

    // 1. اللف على المنتجات المطلوبة للتأكد من السعر والكمية
    for (const item of items) {
        const product = await ProductModel.findById(item.product);

        if (!product) {
            return next(new Error(`Product with ID ${item.product} not found!`));
        }

        if (product.stock < item.quantity) {
            return next(new Error(`Sorry, only ${product.stock} units of ${product.name} available.`));
        }

        // 2. حسبة السعر (سعر المنتج من الـ DB * الكمية)
        totalPrice += product.price * item.quantity;

        // 3. تجهيز الـ item عشان يتسيف
        finalItems.push({
            product: product._id,
            quantity: item.quantity
        });

        // 4. تحديث الـ Stock (ننقص الكمية)
        product.stock -= item.quantity;
        await product.save();
    }

    // 5. إنشاء الأوردر في الداتابيز
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