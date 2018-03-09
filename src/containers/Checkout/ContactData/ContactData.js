import React, { Component } from 'react';
import { connect } from 'react-redux';

import axios from '../../../axios-orders';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';

import classes from './ContactData.css';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import * as burgerBuilderActions from '../../../store/actions/index';

class ContactData extends Component {
    state = {
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 2
                },
                valid: false,
                touched: false
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 2                    
                },
                valid: false,
                touched: false
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'number',
                    placeholder: 'ZIP Code'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 5,
                    maxLength: 5
                },
                valid: false,
                touched: false
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country'         
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 2           
                },
                valid: false,
                touched: false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your Email'
                },
                value: '',
                validation: {
                    required: true,
                    email: true
                },
                valid: false,
                touched: false
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {value: 'fastest', displayValue: 'Fastest'},
                        {value: 'cheapest', displayValue: 'Cheapest'}
                    ]
                },
                value: 'fastest',
                validation: {
                    required: false
                },
                valid: true
            }
        },
        formIsValid: false
    }

    orderHndler = (event) => {
        event.preventDefault();
        
        const formData = {};
        for (let formElementIdentifier in this.state.orderForm) {
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
        }
        
        const order = {
            ingredients: this.props.ings,
            price: this.props.price,
            orderData: formData
        }

        this.props.startPurchasing(order); 
    }

    checkValidity(value, rules) {
        let isValid = true;

        if(rules.required) {
            isValid = value.trim() !== '' && isValid;
        }

        if(rules.minLength) {
            isValid = value.length >= rules.minLength && isValid;
        }

        if(rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid;
        }

        if(rules.email) {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            isValid = re.test(String(value).toLowerCase()) && isValid;
        }

        return isValid;
    }

    inputChangedHandeler = (event, inputIdentifier) => {   
        const prevState = { ...this.state.orderForm };
        const prevStateFormElement = { ...prevState[inputIdentifier] };

        prevStateFormElement.value = event.target.value;
        prevStateFormElement.valid = 
            this.checkValidity(prevStateFormElement.value, prevStateFormElement.validation);
        prevStateFormElement.touched = true;
        prevState[inputIdentifier] = prevStateFormElement;

        let formIsValid = true;
        for( let inputIdentifier in prevState) {
            formIsValid = prevState[inputIdentifier].valid && formIsValid;
        }

        this.setState({
            orderForm: { ...prevState },
            formIsValid: formIsValid
        })
    }

    render() {

        const formElementsArray = [];
        for(let key in this.state.orderForm) {
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key]
            })
        }

        let form = (
            <form onSubmit={this.orderHndler}>
                {formElementsArray.map(formElem => (
                    <Input 
                        validity={formElem.config.valid}
                        touched={formElem.config.touched}
                        key={formElem.id}
                        elementType={formElem.config.elementType}
                        elementConfig={formElem.config.elementConfig}
                        value={formElem.config.value}
                        changed={(event) => this.inputChangedHandeler(event, formElem.id)} />
                ))}
                <Button disabled={!this.state.formIsValid} btnType='Success' >ORDER</Button>
            </form>
        );

        if (this.props.loading) {
            form = <Spinner />;
        }

        return (
            <div className={classes.ContactData}>
                <h3>Enter your Contact Data</h3>
                {form}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        startPurchasing: (order) => dispatch(burgerBuilderActions.purchaseBurgerStart(order))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));