import { Router } from "express";
import * as productService from "./product.service.js"
import { authentication, authorization } from "../../Middelwares/auth.middlewares.js";
import { fileUpload } from "../../Utlis/multer.utlis.js"

const router = Router()



/**
 * @swagger
 * /api/product/createProduct:
 *   post:
 *     summary: إنشاء منتج جديد مع Variations وصور
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *                 example: iPhone 15 Pro
 *               description:
 *                 type: string
 *                 example: Latest iPhone model with A17 Pro chip
 *               price:
 *                 type: number
 *                 example: 999.99
 *               category:
 *                 type: string
 *                 description: ID بتاع التصنيف
 *                 example: 507f1f77bcf86cd799439011
 *               variations:
 *                 type: string
 *                 description: "مصفوفة الـ variations محولة لـ String (JSON)"
 *                 example: '[{"colorName":"Black","colorValue":"#000000","stock":50}]'
 *               variant_image_0:
 *                 type: string
 *                 format: binary
 *                 description: صورة الـ Variant الأول
 *               variant_image_1:
 *                 type: string
 *                 format: binary
 *                 description: صورة الـ Variant الثاني (اختياري)
 *     responses:
 *       201:
 *         description: تم إنشاء المنتج بنجاح
 *       400:
 *         description: خطأ في البيانات المدخلة
 */

router.post("/createProduct", fileUpload().any(), productService.createProducts)

/**
 * @swagger
 * /api/product/getAllProducts:
 *   get:
 *     summary: الحصول على جميع المنتجات
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
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       price:
 *                         type: number
 *                       stock:
 *                         type: number
 *                       category:
 *                         type: string
 *                       image:
 *                         type: string
 *       409:
 *         description: لا توجد منتجات
 */
router.get("/getAllProducts", productService.getAllProducts)

/**
 * @swagger
 * /api/product/getProductById/{id}:
 *   get:
 *     summary: الحصول على منتج بواسطة ID
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
 *       409:
 *         description: المنتج غير موجود
 */
router.get("/getProductById/:id", productService.getProductById)

/**
 * @swagger
 * /api/product/updateProduct/{id}:
 *   patch:
 *     summary: تحديث منتج
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
 *               price:
 *                 type: number
 *                 example: 1199.99
 *               stock:
 *                 type: number
 *                 example: 30
 *               category:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: تم التحديث بنجاح
 *       409:
 *         description: المنتج غير موجود
 */
router.patch("/updateProduct/:id", productService.updateProduct)

/**
 * @swagger
 * /api/product/deleteProduct/{id}:
 *   delete:
 *     summary: حذف منتج
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
 *       409:
 *         description: المنتج غير موجود
 */
router.delete("/deleteProduct/:id", productService.deleteProduct)

export default router