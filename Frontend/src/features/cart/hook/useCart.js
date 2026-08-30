import { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addItems, fetchCart, updateCartItemQuantity, removeCartItem } from "../service/cart.api"
import { addItems as addcartitems, setItems, removeItem, updateItemQuantity } from "../state/cart.slice"

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

    const handleUpdateCartItemQuantity = useCallback(async function handleUpdateCartItemQuantity({ productId, variantId, quantity }) {
        try {
            const data = await updateCartItemQuantity({ productId, variantId, quantity })
            if (data?.success && data?.cart?.items) {
                dispatch(setItems(data.cart.items))
            } else {
                dispatch(updateItemQuantity({ productId, variantId, quantity }))
            }
            return data
        } catch (error) {
            console.error("Update quantity failed:", error)
            throw error
        }
    }, [dispatch])

    const handleRemoveFromCart = useCallback(async function handleRemoveFromCart({ productId, variantId }) {
        try {
            const data = await removeCartItem({ productId, variantId })
            if (data?.success && data?.cart?.items) {
                dispatch(setItems(data.cart.items))
            } else {
                dispatch(removeItem({ productId, variantId }))
            }
            return data
        } catch (error) {
            console.error("Remove from cart failed:", error)
            throw error
        }
    }, [dispatch])

    return {
        cartItems,
        handleAddToCart,
        handleaAddToCart: handleAddToCart,
        handleGetCart,
        handleUpdateCartItemQuantity,
        handleRemoveFromCart
    }
}
