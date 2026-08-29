import axios from "axios"

const productApiInstance = axios.create({
    baseURL: "/api/products",
    withCredentials: true
})

export async function createProduct(formData) {
    const response = await productApiInstance.post("/", formData)

    return response.data
}

export async function getsellerProduct() {
    const response = await productApiInstance.get("/seller")
    return response.data
}

export async function getallProducts(){
     const response = await productApiInstance.get("")
    return response.data
}

export async function getproductbyId(productId){
    const response = await productApiInstance(`/detail/${productId}`);
    return response.data
}

function buildVariantFormData(variantData) {
    const payload = new FormData()
    const attributes = {
        color: variantData.color,
        size: variantData.size,
        material: variantData.material,
    }

    payload.append("attributes", JSON.stringify(attributes))
    payload.append("stock", variantData.stock || "0")
    payload.append("priceAmount", variantData.priceAmount)
    payload.append("priceCurrency", variantData.priceCurrency || "INR")
    
    if (variantData.images && variantData.images.length > 0) {
        variantData.images.forEach((image) => payload.append("images", image))
    }

    return payload
}

export async function createProductVariant(productId, variantData) {
    const response = await productApiInstance.post(
        `/${productId}/variants`,
        buildVariantFormData(variantData)
    )
    return response.data
}
