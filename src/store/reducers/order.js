import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    orders: [],
    loading: false,
    purchased: false
}

const orderReducer = (state = initialState, action) => {
    switch (action.type) {

        case actionTypes.PURCHASE_BURGER_SUCCESS:
            const newOrder = updateObject(action.orderData, { id: action.orderId });
            const orders = state.orders.concat({ newOrder });
            return updateObject(state, {
                loading: false,
                purchased: true,
                orders
            });

        case actionTypes.PURCHASE_BURGER_FAIL:
            return updateObject(state, { loading: false });

        case actionTypes.START_PURCHASING:
            return updateObject(state, { loading: true });

        case actionTypes.PURCHASE_INIT:
            return updateObject(state, { purchased: false });

        case actionTypes.FETCH_ORDERS_START:
            return updateObject(state, { loading: true });

        case actionTypes.FETCH_ORDERS_SUCCESS:
            return updateObject(state, {
                orders: action.orders,
                loading: false
            });

        case actionTypes.FETCH_ORDERS_FAIL:
            return updateObject(state, { loading: false });

        default:
            return state;
    }
}

export default orderReducer;