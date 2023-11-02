// cartReducer.js
import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  SAVE_SHIPPING_INFO,
  UPDATE_CART_ITEM,
  UPDATE_TOTAL_PRICE,
  UPDATE_WISHLIST_ITEM,
} from "../constants/cartConstants";

const initialState = {
  cartItems:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("cartItems")) || []
      : [],
  totalPrice:
    typeof window !== "undefined"
      ? localStorage.getItem("totalPrice")
        ? parseFloat(localStorage.getItem("totalPrice"))
        : 0
      : 0,
  shippingInfo:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("shippingInfo")) || {}
      : {},
};

const calculateTotalPrice = (cartItems) => {
  return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
};

const updateLocalStorage = (cartItems) => {
  const updatedTotalPrice = calculateTotalPrice(cartItems);
  if (typeof window !== "undefined") {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    localStorage.setItem("totalPrice", updatedTotalPrice);
  }
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const newItem = action.payload;
      const existingItemIndex = state.cartItems.findIndex(
        (item) => item._id === newItem._id
      );

      if (existingItemIndex !== -1) {
        const updatedCart = state.cartItems.map((item, index) => {
          if (index === existingItemIndex) {
            return {
              ...item,
              quantity: newItem.quantity,
            };
          }
          return item;
        });
        updateLocalStorage(updatedCart);
        return {
          ...state,
          cartItems: updatedCart,
          totalPrice: calculateTotalPrice(updatedCart),
        };
      } else {
        const updatedCart = [...state.cartItems, newItem];
        updateLocalStorage(updatedCart);
        return {
          ...state,
          cartItems: updatedCart,
          totalPrice: calculateTotalPrice(updatedCart),
        };
      }

    case REMOVE_FROM_CART:
      const productId = action.payload;
      const updatedCartItems = state.cartItems.filter((item) => item._id !== productId);
      updateLocalStorage(updatedCartItems);
      return {
        ...state,
        cartItems: updatedCartItems,
        totalPrice: calculateTotalPrice(updatedCartItems),
      };
    case UPDATE_TOTAL_PRICE:
      const newTotalPrice = action.payload;

      if (typeof window !== "undefined") {
        localStorage.setItem("totalPrice", newTotalPrice.toString());
      }

      return { ...state, totalPrice: newTotalPrice };
    case SAVE_SHIPPING_INFO:
      return {
        ...state,
        shippingInfo: action.payload,
      };

    default:
      return state;
  }
};

export default cartReducer;
