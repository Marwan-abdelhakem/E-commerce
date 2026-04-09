import { Router } from "express";
import { authentication, authorization } from "../../Middelwares/auth.middlewares.js";
import * as orderService from "./order.service.js"

const router = Router()

/**
 * @swagger
 * /api/order/createOrder:
 *   post:
 *     summary: إنشاء طلب جديد
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 description: قائمة المنتجات المطلوبة
 *                 items:
 *                   type: object
 *                   required:
 *                     - product
 *                     - quantity
 *                   properties:
 *                     product:
 *                       type: string
 *                       description: ID المنتج
 *                       example: 507f1f77bcf86cd799439011
 *                     quantity:
 *                       type: number
 *                       description: الكمية المطلوبة
 *                       example: 2
 *                     variationId:
 *                       type: string
 *                       description: ID الـ variation (اللون/المقاس) - اختياري
 *                       example: 507f1f77bcf86cd799439012
 *           example:
 *             items:
 *               - product: "507f1f77bcf86cd799439011"
 *                 quantity: 2
 *                 variationId: "507f1f77bcf86cd799439012"
 *               - product: "507f1f77bcf86cd799439013"
 *                 quantity: 1
 *     responses:
 *       200:
 *         description: تم إنشاء الطلب بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     user:
 *                       type: string
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           product:
 *                             type: string
 *                           quantity:
 *                             type: number
 *                           variationId:
 *                             type: string
 *                     totalPrice:
 *                       type: number
 *                     status:
 *                       type: string
 *                       enum: [pending, processing, shipped, delivered, cancelled]
 *                     paymentStatus:
 *                       type: string
 *                       enum: [paid, unpaid]
 *       400:
 *         description: خطأ في البيانات المدخلة
 *       401:
 *         description: غير مصرح - Token مطلوب
 *       404:
 *         description: المنتج غير موجود أو الـ variation غير موجود
 */
router.post("/createOrder", authentication, orderService.createOrder)

/**
 * @swagger
 * /api/order/getOrderById/{id}:
 *   get:
 *     summary: الحصول على طلب بواسطة ID
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: معرف الطلب (MongoDB ObjectId)
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: بيانات الطلب مع تفاصيل المنتجات والـ variations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           product:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                               name:
 *                                 type: string
 *                               price:
 *                                 type: number
 *                               variations:
 *                                 type: array
 *                                 description: فقط الـ variation المختار
 *                           quantity:
 *                             type: number
 *                           variationId:
 *                             type: string
 *                     totalPrice:
 *                       type: number
 *                     status:
 *                       type: string
 *                     paymentStatus:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: غير مصرح - Token مطلوب
 *       404:
 *         description: الطلب غير موجود
 */
router.get("/getOrderById/:id", authentication, orderService.getOrderById)

/**
 * @swagger
 * /api/order/getUserOrders:
 *   get:
 *     summary: الحصول على جميع طلبات المستخدم الحالي
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: قائمة الطلبات مرتبة من الأحدث للأقدم
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User orders fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       user:
 *                         type: string
 *                       items:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             product:
 *                               type: object
 *                               properties:
 *                                 _id:
 *                                   type: string
 *                                 name:
 *                                   type: string
 *                                 price:
 *                                   type: number
 *                                 defaultImg:
 *                                   type: string
 *                                 variations:
 *                                   type: array
 *                                   description: فقط الـ variation المختار
 *                             quantity:
 *                               type: number
 *                             variationId:
 *                               type: string
 *                       totalPrice:
 *                         type: number
 *                       status:
 *                         type: string
 *                         enum: [pending, processing, shipped, delivered, cancelled]
 *                       paymentStatus:
 *                         type: string
 *                         enum: [paid, unpaid]
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: غير مصرح - Token مطلوب
 */
router.get("/getUserOrders", authentication, orderService.getUserOrders)

export default router