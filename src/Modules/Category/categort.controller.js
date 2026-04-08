import { Router } from "express";
import * as categoryService from "./categort.service.js"
import { authentication, authorization } from "../../Middelwares/auth.middlewares.js";


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
 *                 example: Electronics
 *     responses:
 *       201:
 *         description: تم إنشاء التصنيف بنجاح
 *       409:
 *         description: التصنيف موجود بالفعل
 *       401:
 *         description: غير مصرح - Token مطلوب
 */
router.post("/createCategory", authentication, categoryService.createCategory)

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
router.get("/getAllCategory", authentication, categoryService.getAllCategory)

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
 *         description: معرف التصنيف (MongoDB ObjectId)
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: بيانات التصنيف
 *       409:
 *         description: التصنيف غير موجود
 *       401:
 *         description: غير مصرح
 */
router.get("/getCategoryById/:id", authentication, categoryService.getCategoryById)

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
 *         description: معرف التصنيف
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
 *                 example: Updated Electronics
 *     responses:
 *       200:
 *         description: تم التحديث بنجاح
 *       409:
 *         description: التصنيف غير موجود
 *       401:
 *         description: غير مصرح
 */
router.patch("/updateCategory/:id", authentication, categoryService.updateCategory)

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
 *         description: معرف التصنيف
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: تم الحذف بنجاح
 *       409:
 *         description: التصنيف غير موجود
 *       401:
 *         description: غير مصرح
 */
router.delete("/deleteCategory/:id", authentication, categoryService.deleteCategory)

export default router