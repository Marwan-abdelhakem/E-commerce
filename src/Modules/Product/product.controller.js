import { Router } from "express";
import * as productService from "./product.service.js"
import { authentication, authorization } from "../../Middelwares/auth.middlewares.js";
import { fileUpload } from "../../Utlis/multer.utlis.js"
import { validation } from "../../Middelwares/validation.middelwares.js";
import { createProductSchema, updateProductSchema, mongoIdSchema } from "./product.validation.js";

const router = Router()



/**
 * @swagger
 * /api/product/createProduct:
 *   post:
 *     summary: إنشاء منتج جديد مع Variations
 *     description: |
 *       إنشاء منتج جديد مع variations (ألوان مختلفة).
 *       
 *       **ملاحظات مهمة:**
 *       - كل variation لازم يكون له colorName, colorValue (hexa code), defaultImage (URL), وصور إضافية
 *       - الـ stock الكلي للمنتج بيتحسب تلقائياً من مجموع stock كل الـ variations
 *       - لازم يكون في variation واحد على الأقل isDefault: true
 *       - لو مفيش default محدد، أول variation هيبقى هو الـ default تلقائياً
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - category
 *               - variations
 *             properties:
 *               name:
 *                 type: string
 *                 description: اسم المنتج
 *                 example: iPhone 15 Pro
 *               description:
 *                 type: string
 *                 description: وصف المنتج
 *                 example: أحدث إصدار من iPhone مع معالج A17 Pro وكاميرا محسنة
 *               price:
 *                 type: number
 *                 description: سعر المنتج
 *                 example: 999.99
 *               category:
 *                 type: string
 *                 description: معرف التصنيف (MongoDB ObjectId)
 *                 example: 507f1f77bcf86cd799439011
 *               variations:
 *                 type: array
 *                 description: مصفوفة الـ variations
 *                 items:
 *                   type: object
 *                   required:
 *                     - colorName
 *                     - colorValue
 *                     - defaultImage
 *                   properties:
 *                     colorName:
 *                       type: string
 *                       example: أسود
 *                     colorValue:
 *                       type: string
 *                       example: "#000000"
 *                     defaultImage:
 *                       type: string
 *                       example: https://example.com/image.jpg
 *                     variationImgs:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["https://example.com/img1.jpg", "https://example.com/img2.jpg"]
 *                     isDefault:
 *                       type: boolean
 *                       example: true
 *                     stock:
 *                       type: number
 *                       example: 50
 *     responses:
 *       201:
 *         description: تم إنشاء المنتج بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product Created Successfully
 *                 data:
 *                   type: object
 *       400:
 *         description: خطأ في البيانات المدخلة
 */
router.post("/createProduct", validation(createProductSchema), productService.createProducts)

/**
 * @swagger
 * /api/product/getAllProducts:
 *   get:
 *     summary: الحصول على جميع المنتجات
 *     description: استرجاع قائمة بجميع المنتجات المتاحة مع تفاصيل الـ variations
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: قائمة المنتجات
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 507f1f77bcf86cd799439011
 *                       name:
 *                         type: string
 *                         example: iPhone 15 Pro
 *                       description:
 *                         type: string
 *                         example: أحدث إصدار من iPhone
 *                       price:
 *                         type: number
 *                         example: 999.99
 *                       stock:
 *                         type: number
 *                         example: 80
 *                         description: مجموع stock كل الـ variations
 *                       category:
 *                         type: string
 *                         example: 507f1f77bcf86cd799439011
 *                       variations:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             colorName:
 *                               type: string
 *                               example: أسود
 *                             colorValue:
 *                               type: string
 *                               example: "#000000"
 *                             defaultImage:
 *                               type: string
 *                               example: https://res.cloudinary.com/...
 *                             variationImgs:
 *                               type: array
 *                               items:
 *                                 type: string
 *                               example: ["https://res.cloudinary.com/..."]
 *                             isDefault:
 *                               type: boolean
 *                               example: true
 *                             stock:
 *                               type: number
 *                               example: 50
 *                       featured:
 *                         type: boolean
 *                         example: false
 *                       visible:
 *                         type: boolean
 *                         example: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       409:
 *         description: لا توجد منتجات
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: products Not Founded
 */
router.get("/getAllProducts", productService.getAllProducts)

/**
 * @swagger
 * /api/product/getProductById/{id}:
 *   get:
 *     summary: الحصول على منتج بواسطة ID
 *     description: استرجاع تفاصيل منتج معين مع جميع الـ variations والصور
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: معرف المنتج (MongoDB ObjectId)
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: بيانات المنتج
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                         example: iPhone 15 Pro
 *                       description:
 *                         type: string
 *                       price:
 *                         type: number
 *                       stock:
 *                         type: number
 *                       category:
 *                         type: object
 *                       variations:
 *                         type: array
 *                         items:
 *                           type: object
 *       409:
 *         description: المنتج غير موجود
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: product Not Founded
 */
router.get("/getProductById/:id", validation(mongoIdSchema, 'params'), productService.getProductById)

/**
 * @swagger
 * /api/product/updateProduct/{id}:
 *   patch:
 *     summary: تحديث منتج
 *     description: |
 *       تحديث بيانات منتج موجود (يمكن تحديث أي حاجة بما فيها الـ variations).
 *       
 *       **ملاحظة:** يمكنك تحديث أي field بما فيها الـ variations كاملة أو جزء منها
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: معرف المنتج
 *         example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: iPhone 15 Pro Max
 *               description:
 *                 type: string
 *                 example: وصف محدث للمنتج
 *               price:
 *                 type: number
 *                 example: 1199.99
 *               category:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               variations:
 *                 type: array
 *                 description: تحديث الـ variations (اختياري)
 *                 items:
 *                   type: object
 *                   properties:
 *                     colorName:
 *                       type: string
 *                     colorValue:
 *                       type: string
 *                     defaultImage:
 *                       type: string
 *                     variationImgs:
 *                       type: array
 *                       items:
 *                         type: string
 *                     isDefault:
 *                       type: boolean
 *                     stock:
 *                       type: number
 *               featured:
 *                 type: boolean
 *                 example: true
 *               visible:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: تم التحديث بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: product Update successffully
 *                 data:
 *                   type: object
 *       409:
 *         description: المنتج غير موجود
 *       400:
 *         description: خطأ في البيانات المدخلة
 */
router.patch("/updateProduct/:id", validation(mongoIdSchema, 'params'), validation(updateProductSchema), productService.updateProduct)

/**
 * @swagger
 * /api/product/deleteProduct/{id}:
 *   delete:
 *     summary: حذف منتج
 *     description: حذف منتج نهائياً من قاعدة البيانات
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: معرف المنتج
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: تم الحذف بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: product Deleted Successfully
 *       409:
 *         description: المنتج غير موجود
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: product Not Founded
 */
router.delete("/deleteProduct/:id", validation(mongoIdSchema, 'params'), productService.deleteProduct)

export default router