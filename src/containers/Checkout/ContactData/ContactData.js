import React, { Component } from 'react';

import axios from '../../../axios-orders';

import classes from './ContactData.css';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';

class ContactData extends Component {
    state = {
        name: '',
        email: '',
        address: {
            street: '',
            postalCode: '',
            country: ''
        },
        loading: false
    }

    orderHndler = (event) => {
        event.preventDevault();

        this.setState({
            loading: true
        });

        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
            customer: {
                name: 'Veka Peka',
                address: {
                    street: 'Medin potok',
                    zipCode: '72250',
                    country: 'BiH'
                },
                email: 'test@test.com'
            }
        }
        axios.post('/orders.json', order)
            .then(res => {
                this.setState({
                    loading: false
                });
                this.props.history.push('/');
            })
            .catch(err => {
                this.setState({
                    loading: false
                });
            });
    }

    render() {
        let form = (
            <form>
                <input
                    className={classes.Input}
                    type='text' name='name'
                    placeholder='Your Name' />
                <input
                    className={classes.Input}
                    type='email' name='email'
                    placeholder='Your Email' />
                <input
                    className={classes.Input}
                    type='text'
                    name='street'
                    placeholder='Street' />
                <input
                    className={classes.Input}
                    type='number'
                    name='postal'
                    placeholder='Postal Code' />
                <Button btnType='Success' clicked={this.orderHndler} >ORDER</Button>
            </form>
        );

        if (this.state.loading) {
            form = <Spinner />;
        }

        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        );
    }
}

export default ContactData;