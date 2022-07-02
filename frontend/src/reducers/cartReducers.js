import { ADD_TO_CART, REMOVE_ITEM } from "../constants/cartConstants";

export const cartReducer = (state = { cartItems: [] }, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const item = action.payload;

      const index = state.cartItems.findIndex((i) => i.id === item.id);

      if (index >= 0) {
        state.cartItems[index] = item;
        return {
          ...state,
          cartItems: [...state.cartItems],
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        };
      }

    case REMOVE_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter((i) => i.id !== action.payload.id),
      };
    default:
      return state;
  }
};
