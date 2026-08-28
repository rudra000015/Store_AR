import { useCallback } from "react"
import { useDispatch } from "react-redux"
import { createProduct, createProductVariant, getsellerProduct, getallProducts, getproductbyId } from "../services/product.api"
import { setSellerProducts, setProducts } from "../state/product.slice.js"

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


    const handlegetallproducts = useCallback(async function handlegetallproducts() {
        const data = await getallProducts()
        dispatch(setProducts(data.products))
        return data.products
    }, [dispatch])


    const handlegetproductbyId = useCallback(async function handlegetproductbyId(productId) {
        const data = await getproductbyId(productId)
        return data.product
    }, [])

    const handlecreateproductvariant = useCallback(async function handlecreateproductvariant(productId, formData) {
        const data = await createProductVariant(productId, formData)
        return data.product
    }, [])

    return { handlecreateproduct, handlegetsellerproduct, handlegetallproducts, handlegetproductbyId, handlecreateproductvariant }
}
