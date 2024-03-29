import {
  ADD_TO_CART,
  REMOVE_ITEM,
  CLEAR_CART,
  SAVE_SHIPPING_INFO,
} from "../constants/cartConstants";

export const cartReducer = (
  state = { cartItems: [], shippingInfo: {} },
  action
) => {
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

    case CLEAR_CART:
      return {
        ...state,
        cartItems: [],
      };

    case SAVE_SHIPPING_INFO:
      return {
        ...state,
        shippingInfo: action.payload,
      };

    default:
      return state;
  }
};
