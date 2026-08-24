import { useCallback } from "react"
import { useDispatch } from "react-redux"
import { createProduct, getsellerProduct } from "../services/product.api"
import { setSellerProducts } from "../state/product.slice.js"

export const useProduct = () => {
    const dispatch = useDispatch()

    const handlecreateproduct = useCallback(async function handlecreateproduct(formData) {
        const data = await createProduct(formData)
        return data.product
    }, [])

    const handlegetsellerproduct = useCallback(async function handlegetsellerproduct() {
        const data = await getsellerProduct()
        dispatch(setSellerProducts(data.products))
        return data.products
    }, [dispatch])

    return { handlecreateproduct, handlegetsellerproduct }
}
