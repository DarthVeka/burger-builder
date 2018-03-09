import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

export const purchaseBurgerSuccess = (id, orderData) => {
    console.log('action creator')
    
    return {
        type: actionTypes.PURCHASE_BURGER_SUCCESS,
        orderId: id,
        orderData
    }
}

export const purchaseBurgerFail = (error) => {
    return {
        type: actionTypes.PURCHASE_BURGER_FAIL,
        error        
    }
}
export const startPurchasing = () => {
    return {
        type: actionTypes.START_PURCHASING
    }
}

export const purchaseBurgerStart = (orderData) => {
    return dispatch => {
        startPurchasing();   
        axios.post('/orders.json', orderData)
        .then(res => {
            dispatch(purchaseBurgerSuccess(res.data.name, orderData))
            dispatch({ type: actionTypes.CLEAR_STATE })
        })
        .catch(err => {
            dispatch(purchaseBurgerFail(err));
        });
    }
}

export const purchaseInit = () => {
    return {
        type: actionTypes.PURCHASE_INIT
    }
}

export const fetchOrdersSuccess = (orders) => {
    return {
        type: actionTypes.FETCH_ORDERS_SUCCESS,
        orders
    }
}

export const fetchOrdersFail = (error) => {
    return {
        type: actionTypes.FETCH_ORDERS_FAIL,
        error
    }
}

export const fetchOrderStart = () => {
    return {
        type: actionTypes.FETCH_ORDERS_START
    }
}

export const fetchOrders = () => {
    return dispatch => {
        dispatch(fetchOrderStart());
        axios.get('/orders.json')
        .then(res => {
            const fetchedOrders = [];
            for (let key in res.data) {
                fetchedOrders.push({
                    ...res.data[key],
                    id: key
                });
            }
            dispatch(fetchOrdersSuccess(fetchedOrders));
        })
        .catch(err => {
            dispatch(fetchOrdersFail(err));
        });        
    } 
}