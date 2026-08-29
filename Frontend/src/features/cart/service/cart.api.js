import axios from "axios";


const cartApiInstance = axios.create({
    baseURL:"/api/cart",
    withCredentials:true
})


export const addItems = async ({ productId, variantId, quantity = 1 }) => {
    const response = await cartApiInstance.post(`/add/${productId}/${variantId}`, { quantity })
    return response.data
}

export const fetchCart = async () => {
    const response = await cartApiInstance.get("/")
    return response.data
}