import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

import { productsReducer, productDetailsReducer } from "./reducers/productsReducer";

const rootReducer = combineReducers({
  products: productsReducer,
  productDetails: productDetailsReducer
});

let initialState = {};

const middleware = [thunk];

const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;