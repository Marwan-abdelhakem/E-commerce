import { Router } from "express";
import * as authServeice from "./auth.service.js"
import { signUpValidation, loginValidation } from "./auth.validation.js";
import { validation } from "../../Middelwares/validation.middelwares.js";
import { authentication, authorization } from "../../Middelwares/auth.middlewares.js";

const router = Router()

/**
 * @swagger
 * /api/auth/signUp:
 *   post:
 *     summary: تسجيل مستخدم جديد
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - userName
 *               - age
 *               - phone
 *               - email
 *               - password
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 default: user
 *                 example: user
 *               fullName:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 20
 *                 example: Marawan Abd ElHakeem
 *               userName:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 20
 *                 example: marawan_abdo
 *               age:
 *                 type: number
 *                 minimum: 0
 *                 example: 25
 *               phone:
 *                 type: string
 *                 example: "01000765096"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: marawan@example.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 description: يجب أن يحتوي على حرف كبير ورمز خاص
 *                 example: Password123!
 *     responses:
 *       201:
 *         description: تم التسجيل بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       409:
 *         description: البريد الإلكتروني موجود بالفعل
 *       400:
 *         description: خطأ في البيانات المدخلة
 */
router.post("/signUp", validation(signUpValidation), authServeice.signUp)

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: تسجيل الدخول
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: marawan@example.com
 *               password:
 *                 type: string
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: تم تسجيل الدخول بنجاح
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
 *                     accessToken:
 *                       type: string
 *                       description: صالح لمدة يوم واحد
 *                     refreshToken:
 *                       type: string
 *                       description: صالح لمدة 7 أيام
 *       404:
 *         description: المستخدم غير موجود
 *       400:
 *         description: كلمة المرور غير صحيحة
 */
router.post("/login", validation(loginValidation), authServeice.login)

/**
 * @swagger
 * /api/auth/getAlluser:
 *   get:
 *     summary: الحصول على جميع المستخدمين (Admin فقط)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: قائمة المستخدمين
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
 *       401:
 *         description: غير مصرح - Token مطلوب
 *       403:
 *         description: ليس لديك صلاحية Admin
 *       404:
 *         description: لا يوجد مستخدمين
 */
router.get("/getAlluser", authentication, authorization({ role: ["admin"] }), authServeice.getAllUsers)

/**
 * @swagger
 * /api/auth/getMyProfile:
 *   get:
 *     summary: الحصول على بيانات المستخدم الحالي
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: بيانات المستخدم
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       401:
 *         description: غير مصرح - Token مطلوب
 *       404:
 *         description: المستخدم غير موجود
 */
router.get("/getMyProfile", authentication, authServeice.getMyProfile)

/**
 * @swagger
 * /api/auth/getUserById/{id}:
 *   get:
 *     summary: الحصول على معلومات مستخدم بواسطة ID (Admin فقط)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: معرف المستخدم (MongoDB ObjectId)
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: معلومات المستخدم
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       401:
 *         description: غير مصرح - Token مطلوب
 *       403:
 *         description: ليس لديك صلاحية Admin
 *       404:
 *         description: المستخدم غير موجود
 */
router.get("/getUserById/:id", authentication, authorization({ role: ["admin"] }), authServeice.getUserById)

export default router