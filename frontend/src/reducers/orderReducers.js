import {
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAIL,
  MY_ORDERS_REQUEST,
  MY_ORDERS_SUCCESS,
  MY_ORDERS_FAIL,
  ALL_ORDERS_REQUEST,
  ALL_ORDERS_SUCCESS,
  ALL_ORDERS_FAIL,
  PROCESS_ORDER_REQUEST,
  PROCESS_ORDER_SUCCESS,
  PROCESS_ORDER_FAIL,
  PROCESS_ORDER_RESET,
  DELETE_ORDER_REQUEST,
  DELETE_ORDER_SUCCESS,
  DELETE_ORDER_FAIL,
  DELETE_ORDER_RESET,
  CLEAR_ERRORS,
} from "../constants/orderConstants";

export const newOrderReducer = (state = {}, action) => {
  switch (action.type) {
    case CREATE_ORDER_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case CREATE_ORDER_SUCCESS:
      return {
        loading: false,
        order: action.payload,
      };
    case CREATE_ORDER_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const myOrdersReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case MY_ORDERS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case MY_ORDERS_SUCCESS:
      return {
        orders: action.payload,
        loading: false,
      };
    case MY_ORDERS_FAIL:
      return {
        error: action.payload,
        loading: false,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const processOrderReducer = (state = {}, action) => {
  switch (action.type) {
    case PROCESS_ORDER_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case PROCESS_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        success: action.payload,
      };
    case PROCESS_ORDER_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case PROCESS_ORDER_RESET:
      return {
        ...state,
        loading: false,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const deleteOrderReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_ORDER_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case DELETE_ORDER_SUCCESS:
      return {
        success: action.payload,
        loading: false,
      };
    case DELETE_ORDER_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case DELETE_ORDER_RESET:
      return {
        ...state,
        success: false,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return {
        ...state,
      };
  }
};

export const allOrdersReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case ALL_ORDERS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ALL_ORDERS_SUCCESS:
      return {
        loading: false,
        totalAmount: action.payload.totalAmount,
        orders: action.payload.orders,
      };
    case ALL_ORDERS_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};
