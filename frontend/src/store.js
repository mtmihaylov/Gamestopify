import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

import {
  productsReducer,
  productDetailsReducer,
  reviewReducer,
  getReviewsReducer,
  newProductReducer,
  editProductReducer,
  deleteProductReducer,
} from "./reducers/productReducers";
import {
  authReducer,
  userReducer,
  allUsersReducer,
  forgotPasswordReducer,
} from "./reducers/userReducers";
import { cartReducer } from "./reducers/cartReducers";
import {
  newOrderReducer,
  myOrdersReducer,
  processOrderReducer,
  deleteOrderReducer,
  allOrdersReducer,
} from "./reducers/orderReducers";

const rootReducer = combineReducers({
  products: productsReducer,
  productDetails: productDetailsReducer,
  editProduct: editProductReducer,
  deleteProduct: deleteProductReducer,
  auth: authReducer,
  user: userReducer,
  allUsers: allUsersReducer,
  forgotPassword: forgotPasswordReducer,
  cart: cartReducer,
  newOrder: newOrderReducer,
  myOrders: myOrdersReducer,
  allOrders: allOrdersReducer,
  processOrder: processOrderReducer,
  deleteOrder: deleteOrderReducer,
  review: reviewReducer,
  productReviews: getReviewsReducer,
  newProduct: newProductReducer,
});

let initialState = {
  cart: {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
    shippingInfo: localStorage.getItem("shippingInfo")
      ? JSON.parse(localStorage.getItem("shippingInfo"))
      : [],
  },
};

const middleware = [thunk];

const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
