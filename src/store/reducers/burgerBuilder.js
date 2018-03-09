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

const burgerBuilderReducer = (state = initialState, action) => {
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
                ...state,
                ingredients: {
                    ...initialState.ingredients
                }
            };

            case actionTypes.SET_INGREDIENTS:
            return {
                ...state,
                ingredients: {
                    salad: action.ingredients.salad,
                    bacon: action.ingredients.bacon,
                    cheese: action.ingredients.cheese,
                    meat: action.ingredients.meat
                },
                totalPrice: 4
            };

            case actionTypes.FETCH_INGREDIENTS_FAILED:
            return {
                ...state,
                error: true
            };

        default:
            return state;
    }
}

export default burgerBuilderReducer;