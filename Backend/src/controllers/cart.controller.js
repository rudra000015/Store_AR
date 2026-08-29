import { stockOfVariant } from '../dao/product.dao.js';
import cartModel from '../models/Cart.model.js'
import productModel from '../models/product.model.js';

export const AddToCart = async (req, res) => {
    const { productId, variantId } = req.params;
    const quantity = Number(req.body?.quantity || 1);
    const product = await productModel.findOne({
        _id: productId,
        "variants._id": variantId
    })

    if (!product) {
        return res.status(404).json({
            message: "Product or Variant Not Found",
            success: false
        })
    }

    const stock = await stockOfVariant(productId, variantId)
    const selectedVariant = product.variants.find(variant => variant._id.toString() === variantId)


    const cart = (await cartModel.findOne({ user: req.user._id })) || await cartModel.create({ user: req.user._id })

    const isProductAlreadyInCart = cart.items.some(item => item.product?.toString() == productId && item.variant?.toString() == variantId)


    if (isProductAlreadyInCart) {
        const qtyInCart = cart.items.find(item => item.product?.toString() == productId && item.variant?.toString() == variantId).quantity;
        if (qtyInCart + quantity > stock) {
            return res.status(400).json({
                msg: `Only ${stock - qtyInCart} items left in stock and you have already ${qtyInCart} items`,
                success: false
            })
        }


        await cartModel.findOneAndUpdate(
            { user: req.user._id, "items.product": productId, "items.variant": variantId },
            { $inc: { "items.$.quantity": quantity } },
            { new: true }
        )

        return res.status(200).json({
            msg: "Item added to Cart Successfully",
            success: true
        })
    }


    if (quantity > stock) {
        return res.status(400).json({
            msg: `Only ${stock} left in stock`,
            success: false
        })
    }

    await cartModel.findOneAndUpdate(
        { user: req.user._id },
        {
            $push: {
                items: {
                    product: productId,
                    variant: variantId,
                    quantity,
                    price: selectedVariant.price
                }
            }
        },
        { new: true }
    )


    return res.status(200).json({
        msg: "Item added to Cart Successfully",
        success: true
    })
}


export const getCart = async (req,res) =>{
    const user = req.user;


    let cart = await cartModel.findOne({ user:user._id}).populate("items.product");


    if(!cart){
        cart = await cartModel.create({user:user._id})
    }


    return res.status(200).json({
        msg:"Cart Fetched Successfully",
        success:true,
        cart
    })
}
