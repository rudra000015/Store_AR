import express, { Router } from "express"
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { validateAddToCart } from "../validators/card.validator.js";
import { AddToCart, getCart, updateCartItemQuantity, removeFromCart } from "../controllers/cart.controller.js";

const router = Router();

router.post('/add/:productId/:variantId',authenticateUser,validateAddToCart,AddToCart)
router.get("/",authenticateUser,getCart)
router.patch('/update/:productId/:variantId',authenticateUser,updateCartItemQuantity)
router.delete('/remove/:productId/:variantId',authenticateUser,removeFromCart)

export default router;