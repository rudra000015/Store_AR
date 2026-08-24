import productModel from "../models/product.model.js";
import { uploadImage } from "../services/storage.service.js";


export async function createProduct(req, res) {
    try {
        const { title, description, priceAmount, priceCurrency } = req.body;
        const seller = req.user;
        const images = await Promise.all((req.files || []).map(async (file) => {
            const uploadedImage = await uploadImage({
                buffer: file.buffer,
                fileName: file.originalname
            })

            return {
                url: uploadedImage.url
            }
        }))

        const product = await productModel.create({
            title,
            description,
            price:{
                amount:Number(priceAmount),
                currency: priceCurrency || "INR"
            },
            images,
            seller:seller._id
        })


        res.status(201).json({
            msg:"product created successfully",
            success:true,
            product
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg:error.message || "Product creation failed",
            success:false
        })
    }
} 



export async function getProducts(req,res) {
    try {
        const seller = req.user;
        const products = await productModel.find({
            seller:seller._id
        }).sort({ createdAt: -1 })

        res.status(200).json({
            msg:"product fetched successfully",
            success:true,
            products
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg:error.message || "Products fetch failed",
            success:false
        })
    }
    
}
