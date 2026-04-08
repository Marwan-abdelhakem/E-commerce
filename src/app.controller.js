import connectDb from "./DB/connectDB.js";
import globalErrorHandler from "./Utlis/errorHandler.utlis.js"
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./Modules/auth/auth.controller.js"
import productRouter from "./Modules/Product/product.controller.js"
import categoryRouter from "./Modules/Category/categort.controller.js"

const bootStrap = async (app, express) => {
    // CORS - Allow all origins
    app.use(cors({
        origin: '*',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }))

    app.use(express.json())
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


    // 404 handler - must be after all routes
    app.use((req, res, next) => {
        return next(new Error("Not found Handler !!!!", { cause: 404 }))
    })

    app.use(globalErrorHandler)

}

export default bootStrap