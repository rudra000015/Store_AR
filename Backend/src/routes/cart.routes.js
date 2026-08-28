import express, { Router } from "express"
import { authenticateUser } from "../middlewares/auth.middleware";
import { validateAddToCart } from "../validators/card.validator";
import { AddToCart } from "../controllers/cart.controller";

const router = Router();

router.post('/add/:productId/:variantId',authenticateUser,validateAddToCart,AddToCart)

export default router;