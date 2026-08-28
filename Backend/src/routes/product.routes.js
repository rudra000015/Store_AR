import express from "express"

import { authenticateSeller } from "../middlewares/auth.middleware.js"
import { addProductVariant, allProduct, createProduct, getsellerProducts, productdetails } from "../controllers/product.controller.js"
import multer from "multer"
import { createProductValidator } from "../validators/product.validator.js"

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    }
})

const router = express.Router()

router.post(
    "/",
    authenticateSeller,
    upload.array("images", 7),
    createProductValidator,
    createProduct
)

router.get(
    "/seller/",
    authenticateSeller,
    getsellerProducts
)
router.get("/",
    allProduct
)

router.get("/detail/:id",productdetails)

router.post(
    "/:productId/variants",
    authenticateSeller,
    upload.array("images", 7),
    addProductVariant
)

export default router
