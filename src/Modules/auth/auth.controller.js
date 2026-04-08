import { Router } from "express";
import * as authServeice from "./auth.service.js"
import { signUpValidation } from "./auth.validation.js";
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
 *                 example: Ahmed Ali Mohamed
 *               userName:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 20
 *                 example: ahmed_ali
 *               age:
 *                 type: number
 *                 minimum: 0
 *                 example: 25
 *               phone:
 *                 type: string
 *                 example: "01012345678"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ahmed@example.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 description: يجب أن يحتوي على حرف كبير ورمز خاص
 *                 example: Password@123
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
 *                 example: ahmed@example.com
 *               password:
 *                 type: string
 *                 example: Password@123
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
router.post("/login", authServeice.login)

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


export default router