import connectDb from "./DB/connectDB.js";
import globalErrorHandler from "./Utlis/errorHandler.utlis.js"
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import authRouter from "./Modules/auth/auth.controller.js"
import productRouter from "./Modules/Product/product.controller.js"
import categoryRouter from "./Modules/Category/categort.controller.js"
import orderRouter from "./Modules/order/order.controller.js"
import cartRouter from "./Modules/cart/cart.controller.js"

const bootStrap = async (app, express) => {
    // CORS Configuration
    // Define allowed origins (يمكنك تخصيصها حسب احتياجك)
    const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:5173', // Vite default
        'http://localhost:5174',
        'http://localhost:4200',
        'https://e-commerce-a6cz.onrender.com',
        // أضف الـ frontend domains هنا
    ];

    app.use(cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (mobile apps, Postman, curl)
            if (!origin) return callback(null, true);
            
            // في الـ development، اسمح لكل الـ origins
            if (process.env.NODE_ENV !== 'production') {
                return callback(null, true);
            }
            
            // في الـ production، تحقق من الـ origin
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            } else {
                return callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true, // للسماح بإرسال cookies
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: [
            'Content-Type', 
            'Authorization', 
            'X-Requested-With', 
            'Accept',
            'Origin'
        ],
        exposedHeaders: ['Content-Range', 'X-Content-Range'],
        maxAge: 86400, // 24 hours - cache preflight requests
        optionsSuccessStatus: 200 // للتوافق مع المتصفحات القديمة
    }));

    // Body parsers
    app.use(express.json({ limit: '10mb' })); // حد أقصى لحجم الـ JSON
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    app.use(cookieParser());

    await connectDb()

    // Health check endpoint (مهم لـ Render)
    app.get("/health", (req, res) => {
        const healthCheck = {
            uptime: process.uptime(),
            status: 'OK',
            timestamp: Date.now(),
            database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
        };
        res.status(200).json(healthCheck);
    });

    // Root endpoint
    app.get("/", (req, res) => {
        res.json({
            message: "E-Commerce API is running",
            documentation: "/api-docs",
            health: "/health"
        })
    })

    app.use("/api/auth", authRouter)
    app.use("/api/product", productRouter)
    app.use("/api/category", categoryRouter)
    app.use("/api/order", orderRouter)
    app.use("/api/cart", cartRouter)


    // 404 handler - must be after all routes
    app.use((req, res, next) => {
        return next(new Error("Not found Handler !!!!", { cause: 404 }))
    })

    app.use(globalErrorHandler)

}

export default bootStrap