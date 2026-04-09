import { Router } from "express";
import * as categoryService from "./categort.service.js"
import { authentication, authorization } from "../../Middelwares/auth.middlewares.js";
import { validation } from "../../Middelwares/validation.middelwares.js";
import { createCategorySchema, updateCategorySchema, mongoIdSchema } from "./categort.validation.js";

const router = Router()

/**
 * @swagger
 * /api/category/createCategory:
 *   post:
 *     summary: إنشاء تصنيف جديد
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: Electronics
 *     responses:
 *       201:
 *         description: تم إنشاء التصنيف بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: خطأ في البيانات المدخلة (Validation Error)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Validation Error
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                       message:
 *                         type: string
 *       409:
 *         description: التصنيف موجود بالفعل
 *       401:
 *         description: غير مصرح - Token مطلوب
 */
router.post("/createCategory", authentication, validation(createCategorySchema), categoryService.createCategory)

/**
 * @swagger
 * /api/category/getAllCategory:
 *   get:
 *     summary: الحصول على جميع التصنيفات
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: قائمة التصنيفات
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
 *       409:
 *         description: لا توجد تصنيفات
 *       401:
 *         description: غير مصرح
 */
router.get("/getAllCategory", categoryService.getAllCategory)

/**
 * @swagger
 * /api/category/getCategoryById/{id}:
 *   get:
 *     summary: الحصول على تصنيف بواسطة ID
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: معرف التصنيف (MongoDB ObjectId)
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: بيانات التصنيف
 *       400:
 *         description: Invalid ID format
 *       409:
 *         description: التصنيف غير موجود
 *       401:
 *         description: غير مصرح
 */
router.get("/getCategoryById/:id", authentication, validation(mongoIdSchema, 'params'), categoryService.getCategoryById)

/**
 * @swagger
 * /api/category/updateCategory/{id}:
 *   patch:
 *     summary: تحديث تصنيف
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: معرف التصنيف (MongoDB ObjectId)
 *         example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: Updated Electronics
 *     responses:
 *       200:
 *         description: تم التحديث بنجاح
 *       400:
 *         description: خطأ في البيانات المدخلة (Validation Error)
 *       409:
 *         description: التصنيف غير موجود
 *       401:
 *         description: غير مصرح
 */
router.patch("/updateCategory/:id", authentication, validation(mongoIdSchema, 'params'), validation(updateCategorySchema), categoryService.updateCategory)

/**
 * @swagger
 * /api/category/deleteCategory/{id}:
 *   delete:
 *     summary: حذف تصنيف
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: معرف التصنيف (MongoDB ObjectId)
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: تم الحذف بنجاح
 *       400:
 *         description: Invalid ID format
 *       409:
 *         description: التصنيف غير موجود
 *       401:
 *         description: غير مصرح
 */
router.delete("/deleteCategory/:id", authentication, validation(mongoIdSchema, 'params'), categoryService.deleteCategory)

export default router