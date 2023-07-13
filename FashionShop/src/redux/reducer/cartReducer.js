import * as actionTypes from '../constants/cartConstants';
const CART_INITIAL_STATE = {
  cartId: '',
  cartItems: [],
};

export const cartReducer = (state = CART_INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.ADD_TO_CART:
      const item = action.payload;
      console.log({item});
      const existItem = state.cartItems.find(x => x.detailId === item.detailId);

      if (existItem) {
        return {
          ...state,
          cartItems: state.cartItems.map(x =>
            x.detailId === existItem.detailId
              ? {...x, qty: item.qty + x.qty}
              : x,
          ),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        };
      }
    case actionTypes.ORDER:
      // console.log(action.payload)
      return {
        ...state,
        cartItems: state.cartItems.map(x =>
          x.detailId === action.payload.detailId
            ? {...x, isOrder: action.payload.isOrder}
            : x,
        ),
      };
      case actionTypes.ORDER_ALL:
        // console.log(action.payload)
        return {
          ...state,
          cartItems: state.cartItems.map(x =>
            x.isOrder === false
            ? {...x, isOrder: true}
            : x,
          ),
        };
    case actionTypes.REMOVE_FROM_CART:
      return {
        ...state,
        cartItems: state.cartItems.filter(x => x.detailId !== action.payload),
      };
    case actionTypes.ADJUST_QTY:
      return {
        ...state,
        cartItems: state.cartItems.map(x =>
          x.detailId === action.payload.detailId
            ? {...x, qty: action.payload.qty}
            : x,
        ),
      };
    case actionTypes.CART_RESET_LOGOUT:
      return {
        ...state,
        cartItems: [],
        // cartId:'',
      };
    case actionTypes.CART_RESET_ORDER:
      return {
        ...state,
        cartItems: state.cartItems.filter(x => x.isOrder !== true),
        // cartId:'',
      };
    case actionTypes.INIT_CART:
      // console.log("cartItems:" + JSON.stringify(action.payload.cart.cart.productDetails));
      // console.log("cartId:" + JSON.stringify(action.payload.cart.cart._id));
      const updatedCartItems = action.payload.cart.cart.productDetails.map(
        item => ({
          product: item.productDetailId.productId,
          detailId: item.productDetailId._id,
          colorCode: item.productDetailId.colorId.code,
          sizeName: item.productDetailId.sizeId.name,
          qty: item.quantity,
          quantity: item.productDetailId.quantity,
          isOrder: false,
        }),
      );
      console.log('CART::::', JSON.stringify(action.payload.cart.cart._id));
      return {
        ...state,
        cartItems: [...updatedCartItems],
        cartId: action.payload.cart.cart._id,
      };
      case actionTypes.RE_ORDER:
      // console.log("cartItems:" + JSON.stringify(action.payload.cart.cart.productDetails));
      // console.log("cartId:" + JSON.stringify(action.payload.cart.cart._id));
        const orderCartItems = action.payload.cart.map((item) => ({
          product: item.productDetailId.productId,
          detailId: item.productDetailId._id,
          colorCode: item.productDetailId.colorId.code,
          sizeName: item.productDetailId.sizeId.name,
          qty: item.quantity,
          isOrder: true,
        }));
        let updatedOrderCartItems = state.cartItems.slice();

  orderCartItems.forEach((item) => {
    const existOrderItemIndex = updatedOrderCartItems.findIndex(x => x.detailId === item.detailId);

    if (existOrderItemIndex !== -1) 
    { 
      const updatedQty = updatedOrderCartItems[existOrderItemIndex].qty + item.qty;
      updatedOrderCartItems = [
        ...updatedOrderCartItems.slice(0, existOrderItemIndex),
        { ...updatedOrderCartItems[existOrderItemIndex], qty: updatedQty, isOrder: true },
        ...updatedOrderCartItems.slice(existOrderItemIndex + 1),
      ];
    } else {
      updatedOrderCartItems.push(item);
    }
  });

  return { ...state, cartItems: updatedOrderCartItems };
    default:
      return state;
  }
};
