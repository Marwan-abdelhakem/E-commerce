import { Router } from "express";
import { authentication, authorization } from "../../Middelwares/auth.middlewares.js";
import * as orderService from "./order.service.js"


const router = Router()

router.post("/createOrder", authentication, orderService.createOrder)

router.get("/getOrderById/:id", authentication, orderService.getOrderById)

router.get("/getUserOrders", authentication, orderService.getUserOrders)



export default router