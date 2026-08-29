import { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addItems, fetchCart } from "../service/cart.api"
import { addItems as addcartitems, setItems } from "../state/cart.slice"

export const useCart = () => {
    const dispatch = useDispatch()
    const cartItems = useSelector((state) => state.cart?.items || [])

    const handleAddToCart = useCallback(async function handleAddToCart({ productId, variantId, quantity = 1 }) {
        const data = await addItems({ productId, variantId, quantity })
        dispatch(addcartitems({ productId, variantId, quantity }))
        return data
    }, [dispatch])

    const handleGetCart = useCallback(async function handleGetCart() {
        try {
            const data = await fetchCart()
            if (data?.cart?.items) {
                dispatch(setItems(data.cart.items))
            }
            return data.cart
        } catch {
            return null
        }
    }, [dispatch])

    return {
        cartItems,
        handleAddToCart,
        handleaAddToCart: handleAddToCart,
        handleGetCart
    }
}
