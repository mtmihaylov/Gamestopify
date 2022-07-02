import { ADD_TO_CART } from "../constants/cartConstants";

export const cartReducer = (state = { cartItems: [] }, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const item = action.payload;

      const index = state.cartItems.findIndex((i) => i.id === item.id);

      if (index >= 0) {
        let cartItemsCopy = state.cartItems;
        cartItemsCopy[index] = item;
        return {
          ...state,
          cartItems: [...cartItemsCopy],
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        };
      }
    default:
      return state;
  }
};
