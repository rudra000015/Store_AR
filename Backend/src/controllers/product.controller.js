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
            price: {
                amount: Number(priceAmount),
                currency: priceCurrency || "INR"
            },
            images,
            seller: seller._id
        })


        res.status(201).json({
            msg: "product created successfully",
            success: true,
            product
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: error.message || "Product creation failed",
            success: false
        })
    }
}



export async function getsellerProducts(req, res) {
    try {
        const seller = req.user;
        const products = await productModel.find({
            seller: seller._id
        }).sort({ createdAt: -1 })

        res.status(200).json({
            msg: "product fetched successfully",
            success: true,
            products
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: error.message || "Products fetch failed",
            success: false
        })
    }

}

export async function allProduct(req, res) {
    try {
        const products = await productModel.find().sort({ createdAt: -1 });


        res.status(200).json({
            msg: "fetched all products successfully",
            success: true,
            products
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: error.message || "Products fetch failed",
            success: false
        })
    }
}


export async function productdetails(req, res) {
    const { id } = req.params;

    const product = await productModel.findById(id);

    if (!product) {
        return res.status(404).json({
            message: "product not found",
            success: false
        })
    }

    return res.status(200).json({
        message: "product",
        success: true,
        product
    })
}

export async function addProductVariant(req, res) {
    try {
        const files = req.files || [];
        const productId = req.params.productId;
        const { priceAmount, priceCurrency, stock } = req.body;
        let attributes = {};
        try {
            attributes = typeof req.body.attributes === "string" ? JSON.parse(req.body.attributes || "{}") : (req.body.attributes || {});
        } catch {
            attributes = {};
        }

        const product = await productModel.findOne({
            _id: productId,
            seller: req.user._id
        });

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                success: false
            });
        }

        const images = await Promise.all(files.map(async (file) => {
            const uploadedImage = await uploadImage({
                buffer: file.buffer,
                fileName: file.originalname
            });

            return {
                url: uploadedImage.url
            };
        }));

        product.variants.push({
            images,
            stock: Number(stock || 0),
            attributes,
            price: {
                amount: Number(priceAmount),
                currency: priceCurrency || product.price?.currency || "INR"
            }
        });
        console.log(product.variants)

        await product.save();

        return res.status(201).json({
            message: "variant created successfully",
            success: true,
            product,
            variant: product.variants[product.variants.length - 1]
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error.message || "Variant creation failed",
            success: false
        });
    }
}

