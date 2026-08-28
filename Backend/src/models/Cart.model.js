import mongoose from "mongoose"
import priceSchema from "./price.model"


const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    items: [
        {
            products: {
                type: mongoose.Types.ObjectId,
                ref: 'product',
                required: true
            },
            variant: {
                type: mongoose.Types.ObjectId,
                ref: 'variant'
            },
            quantity: {
                type: Number,
                default: 1
            },
            price: {
                type: priceSchema,
                required: true
            }
        }
    ]
})


const cartModel = mongoose.model('cart', cartSchema)



















