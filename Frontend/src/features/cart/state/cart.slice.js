import { createSlice } from "@reduxjs/toolkit";


const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: []
    },
    reducers: {
        setItems: (state, action) => {
            state.items = action.payload
        },
        addItems: (state, action) => {
            state.items.push(action.payload)
        },
        removeItem: (state, action) => {
            const { productId, variantId } = action.payload;
            state.items = state.items.filter(item => {
                const pId = item.product?._id || item.product;
                const vId = item.variant?._id || item.variant;
                return !(pId === productId && vId === variantId);
            });
        },
        updateItemQuantity: (state, action) => {
            const { productId, variantId, quantity } = action.payload;
            const item = state.items.find(item => {
                const pId = item.product?._id || item.product;
                const vId = item.variant?._id || item.variant;
                return pId === productId && vId === variantId;
            });
            if (item) {
                item.quantity = quantity;
            }
        }
    }
})


export const {setItems,addItems,removeItem,updateItemQuantity} = cartSlice.actions;
export default cartSlice.reducer