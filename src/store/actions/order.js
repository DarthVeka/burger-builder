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