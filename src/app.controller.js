import connectDb from "./DB/connectDB.js";
import globalErrorHandler from "./Utlis/errorHandler.utlis.js"
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./Modules/auth/auth.controller.js"
import productRouter from "./Modules/Product/product.controller.js"
import categoryRouter from "./Modules/Category/categort.controller.js"
import orderRouter from "./Modules/order/order.controller.js"


const bootStrap = async (app, express) => {
    // CORS - Enhanced configuration
    app.use(cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);
            
            // Allow all origins in development/production
            return callback(null, true);
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
        exposedHeaders: ['Content-Range', 'X-Content-Range'],
        maxAge: 86400 // 24 hours
    }))

    // Handle preflight requests explicitly
    app.options('*', cors())

    // Additional CORS headers middleware
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
        
        // Handle preflight
        if (req.method === 'OPTIONS') {
            return res.sendStatus(200);
        }
        next();
    })

    app.use(express.json())
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    await connectDb()

    // Root endpoint
    app.get("/", (req, res) => {
        res.json({
            message: "E-Commerce API is running",
            documentation: "/api-docs"
        })
    })

    app.use("/api/auth", authRouter)
    app.use("/api/product", productRouter)
    app.use("/api/category", categoryRouter)
    app.use("/api/order", orderRouter)


    // 404 handler - must be after all routes
    app.use((req, res, next) => {
        return next(new Error("Not found Handler !!!!", { cause: 404 }))
    })

    app.use(globalErrorHandler)

}

export default bootStrap