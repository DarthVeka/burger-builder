import * as actionTypes from '../actions/actionTypes';

const INGREDIENT_PRICES = {
    salad: 0.2,
    cheese: 0.4,
    bacon: 0.3,
    meat: 0.7
}

const initialState = {
    ingredients: null,
    totalPrice: 4,
    error: false
}

const reducer = (state = initialState, action) => {
    switch (action.type) {

        case actionTypes.ADD_INGREDIENT:
            return {
                ...state,
                ingredients: {
                    ...state.ingredients,
                    [action.ingredientName]: state.ingredients[action.ingredientName] + 1
                },
                totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName]
            };

        case actionTypes.REMOVE_INGREDIENT:
            return {
                ...state,
                ingredients: {
                    ...state.ingredients,
                    [action.ingredientName]: state.ingredients[action.ingredientName] - 1
                },
                totalPrice: state.totalPrice - INGREDIENT_PRICES[action.ingredientName]
            };

        case actionTypes.CLEAR_STATE:
            return {
                ...initialState,
                ingredients: {
                    ...initialState.ingredients
                }
            };

            case actionTypes.SET_INGREDIENTS:
            return {
                ...initialState,
                ingredients: action.ingredients
            };

            case actionTypes.FETCH_INGREDIENTS_FAILED:
            return {
                ...initialState,
                error: true
            };

        default:
            return state;
    }
}

export default reducer;