import React from 'react';
import { connect } from 'react-redux';

import Burger from '../../components/Burger/Burger';
import BuldControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';
import * as actions from '../../store/actions/index';

export class BurgerBuilder extends React.Component {
    state = {
        purchasing: false
    }

    componentDidMount() {
        this.props.onIngredientInit();        
    }

    purchaseHandler() {
        if(!this.props.isAuthenticated) {
            this.props.onSetAuthRedirectPath('/checkout');
            this.props.history.push('/auth');            
        }
        this.setState({ purchasing: true });
    }

    updatePurchaseState(ingredients) {
        const sum = Object.keys(ingredients).map(igKey => {
            return ingredients[igKey]
        }).reduce((sum, el) => {
            return sum + el;
        }, 0);
        return sum > 0;
    }

    purchesCancelHandler = () => {
        this.setState({ purchasing: false })
    }

    purchaseContinueHandler = () => {
        // alert('fuck off... ❤');
        this.props.onInitPurchase();
        this.props.history.push('/checkout');
    }

    render() {

        const disableInfo = {
            ...this.props.ings
        };

        for (let key in disableInfo) {
            disableInfo[key] = disableInfo[key] <= 0;
        }

        let orderSummary = null;

        let burger = this.props.error ?
            <p style={{ textAlign: 'center', color: 'red' }}>Ingredients can't be loaded!</p>
            : <Spinner />;

        if (this.props.ings) {
            burger = (
                <React.Fragment>
                    <Burger ingredients={this.props.ings} />
                    <BuldControls
                        ingredientAdded={this.props.onIngredientAdded }
                        ingredientRemoved={this.props.onIngredientRemoved }
                        disabled={disableInfo}
                        price={this.props.price}
                        purchasable={this.updatePurchaseState(this.props.ings)}
                        ordered={() => this.purchaseHandler()}
                        isAuth={this.props.isAuthenticated}
                    />
                </React.Fragment>
            );

            orderSummary = <OrderSummary
                ingredients={this.props.ings}
                price={this.props.price}
                cancle={this.purchesCancelHandler}
                continue={this.purchaseContinueHandler} />;
        }

        return (
            <React.Fragment>
                <Modal
                    show={this.state.purchasing}
                    modalClosed={this.purchesCancelHandler}
                >
                    {orderSummary}
                </Modal>
                {burger}
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        purchased: state.order.purchased,
        isAuthenticated: state.auth.token !== null
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onIngredientInit: () => dispatch(actions.initIngredients()),
        onIngredientAdded: (ingredientName) => dispatch(actions.addIngredient(ingredientName)),
        onIngredientRemoved: (ingredientName) => dispatch(actions.removeIngredient(ingredientName)),
        onInitPurchase: () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));