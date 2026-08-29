import express, { Router } from "express"
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { validateAddToCart } from "../validators/card.validator.js";
import { AddToCart, getCart } from "../controllers/cart.controller.js";

const router = Router();

router.post('/add/:productId/:variantId',authenticateUser,validateAddToCart,AddToCart)
router.get("/",authenticateUser,getCart)

export default router;