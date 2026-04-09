import { Router } from "express";
import * as cartService from "./cart.service.js"
import { authentication, authorization } from "../../Middelwares/auth.middlewares.js";


const router = Router()

router.post("/addToCart", authentication, cartService.addToCart)

router.patch("/remove", authentication, cartService.removeFromCart);


export default router