import axios from "axios";

import {
  ADD_TO_CART,
  REMOVE_ITEM,
  CLEAR_CART,
  SAVE_SHIPPING_INFO,
} from "../constants/cartConstants";

// Add item to cart
export const addToCart = (id, quantity) => async (dispatch, getState) => {
  const { data } = await axios.get(`/api/v1/product/${id}`);

  dispatch({
    type: ADD_TO_CART,
    payload: {
      id: data.product._id,
      name: data.product.name,
      price: data.product.price,
      image: data.product.images[0].url,
      stock: data.product.stock,
      quantity,
    },
  });

  // Save cart items in local storage
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

// Remove item from cart
export const removeItem = (id) => async (dispatch, getState) => {
  dispatch({
    type: REMOVE_ITEM,
    payload: {
      id,
    },
  });

  // Save cart items in local storage
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

// Remove items from cart after payment
export const clearCart = () => async (dispatch) => {
  dispatch({
    type: CLEAR_CART,
  });

  // Save cart items in local storage
  localStorage.removeItem("cartItems");
};

// Save shipping info
export const saveShippingInfo = (data) => async (dispatch) => {
  dispatch({
    type: SAVE_SHIPPING_INFO,
    payload: data,
  });

  // Save shipping info in local storage
  localStorage.setItem("shippingInfo", JSON.stringify(data));
};
