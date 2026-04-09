import { Router } from "express";
import * as cartService from "./cart.service.js";
import { authentication } from "../../Middelwares/auth.middlewares.js";


const router = Router()

/**
 * @swagger
 * /api/cart/addToCart:
 *   post:
 *     summary: إضافة منتج إلى السلة
 *     description: |
 *       إضافة منتج إلى سلة المستخدم الحالي.
 *       
 *       **ملاحظات:**
 *       - إذا كان المنتج موجود بالفعل في السلة، سيتم تحديث الكمية
 *       - يمكن تحديد variation معين (لون/مقاس) للمنتج
 *       - إذا لم يكن للمستخدم سلة، سيتم إنشاء واحدة تلقائياً
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 pattern: '^[0-9a-fA-F]{24}$'
 *                 description: معرف المنتج (MongoDB ObjectId)
 *                 example: 507f1f77bcf86cd799439011
 *               quantity:
 *                 type: number
 *                 minimum: 1
 *                 description: الكمية المطلوبة
 *                 example: 2
 *               variationId:
 *                 type: string
 *                 pattern: '^[0-9a-fA-F]{24}$'
 *                 description: معرف الـ variation (اللون/المقاس) - اختياري
 *                 example: 507f1f77bcf86cd799439012
 *           example:
 *             productId: "507f1f77bcf86cd799439011"
 *             quantity: 2
 *             variationId: "507f1f77bcf86cd799439012"
 *     responses:
 *       200:
 *         description: تمت الإضافة بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product added to cart successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: معرف السلة
 *                     user:
 *                       type: string
 *                       description: معرف المستخدم
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           product:
 *                             type: string
 *                             description: معرف المنتج
 *                           quantity:
 *                             type: number
 *                           variationId:
 *                             type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: خطأ في البيانات المدخلة
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid product ID or quantity
 *       401:
 *         description: غير مصرح - Token مطلوب
 *       404:
 *         description: المنتج غير موجود
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product not found
 */
router.post("/addToCart", authentication, cartService.addToCart)

/**
 * @swagger
 * /api/cart/remove:
 *   patch:
 *     summary: إزالة منتج من السلة
 *     description: |
 *       إزالة منتج من سلة المستخدم الحالي.
 *       
 *       **ملاحظات:**
 *       - يمكن إزالة المنتج بالكامل أو تقليل الكمية
 *       - إذا كان هناك variation محدد، سيتم إزالة هذا الـ variation فقط
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *                 pattern: '^[0-9a-fA-F]{24}$'
 *                 description: معرف المنتج المراد إزالته (MongoDB ObjectId)
 *                 example: 507f1f77bcf86cd799439011
 *               variationId:
 *                 type: string
 *                 pattern: '^[0-9a-fA-F]{24}$'
 *                 description: معرف الـ variation المراد إزالته - اختياري
 *                 example: 507f1f77bcf86cd799439012
 *               removeAll:
 *                 type: boolean
 *                 description: إزالة المنتج بالكامل (true) أو تقليل الكمية بواحد (false)
 *                 default: false
 *                 example: false
 *           example:
 *             productId: "507f1f77bcf86cd799439011"
 *             variationId: "507f1f77bcf86cd799439012"
 *             removeAll: false
 *     responses:
 *       200:
 *         description: تمت الإزالة بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product removed from cart successfully
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
 *       400:
 *         description: خطأ في البيانات المدخلة
 *       401:
 *         description: غير مصرح - Token مطلوب
 *       404:
 *         description: السلة أو المنتج غير موجود
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cart not found or Product not in cart
 */
router.patch("/remove", authentication, cartService.removeFromCart);

/**
 * @swagger
 * /api/cart/getMyCart:
 *   get:
 *     summary: الحصول على سلة المستخدم الحالي
 *     description: |
 *       استرجاع سلة المستخدم الحالي مع تفاصيل المنتجات والـ variations.
 *       
 *       **ملاحظات:**
 *       - يتم populate المنتجات مع تفاصيلها الكاملة
 *       - يتم عرض فقط الـ variation المختار لكل منتج
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: بيانات السلة
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cart fetched successfully
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
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                               name:
 *                                 type: string
 *                                 example: iPhone 15 Pro
 *                               description:
 *                                 type: string
 *                               price:
 *                                 type: number
 *                                 example: 999.99
 *                               stock:
 *                                 type: number
 *                               category:
 *                                 type: string
 *                               variations:
 *                                 type: array
 *                                 description: فقط الـ variation المختار
 *                                 items:
 *                                   type: object
 *                                   properties:
 *                                     _id:
 *                                       type: string
 *                                     colorName:
 *                                       type: string
 *                                       example: أسود
 *                                     colorValue:
 *                                       type: string
 *                                       example: "#000000"
 *                                     defaultImage:
 *                                       type: string
 *                                       example: https://res.cloudinary.com/...
 *                                     variationImgs:
 *                                       type: array
 *                                       items:
 *                                         type: string
 *                                     stock:
 *                                       type: number
 *                           quantity:
 *                             type: number
 *                             example: 2
 *                           variationId:
 *                             type: string
 *                     totalPrice:
 *                       type: number
 *                       description: السعر الإجمالي لكل المنتجات في السلة
 *                       example: 1999.98
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: غير مصرح - Token مطلوب
 *       404:
 *         description: السلة فارغة أو غير موجودة
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cart is empty or not found
 */
router.get("/getMyCart", authentication, cartService.getMyCart);

/**
 * @swagger
 * /api/cart/clearCart:
 *   delete:
 *     summary: مسح السلة بالكامل
 *     description: حذف جميع المنتجات من سلة المستخدم الحالي
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: تم مسح السلة بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cart cleared successfully
 *       401:
 *         description: غير مصرح - Token مطلوب
 *       404:
 *         description: السلة غير موجودة
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cart not found
 */
router.delete("/clearCart", authentication, cartService.clearCart);

export default router