import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import classes from './Auth.css';
import * as actions from '../../store/actions/index';
import Spinner from '../../components/UI/Spinner/Spinner';

class Auth extends Component {

    state = {
        controls: {
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
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6
                },
                valid: false,
                touched: false
            }
        },
        isSignup: false
    }

    componentDidMount() {
        if(!this.props.buildingBurger && this.props.authRedirectPath !== '/')
        this.props.onSetAuthRedirectPath();
    }

    checkValidity(value, rules) {
        let isValid = true;

        if (rules.required) {
            isValid = value.trim() !== '' && isValid;
        }

        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid;
        }

        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid;
        }

        if (rules.email) {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            isValid = re.test(String(value).toLowerCase()) && isValid;
        }

        return isValid;
    }

    inputChangedHandeler = (event, controlName) => {
        const updatedControls = {
            ...this.state.controls,
            [controlName]: {
                ...this.state.controls[controlName],
                value: event.target.value,
                valid: this.checkValidity(event.target.value, this.state.controls[controlName].validation),
                touched: true
            }
        }
        this.setState({ controls: updatedControls });
    }

    submitHandeler = (event) => {
        event.preventDefault();
        this.props.onAuth(
            this.state.controls.email.value,
            this.state.controls.password.value,
            this.state.isSignup);
    }

    switchAuthModeHandler = () => {
        this.setState(prevState => {
            return { isSignup: !prevState.isSignup }
        });
    }

    render() {        

        const formElementsArray = [];
        for (let key in this.state.controls) {
            formElementsArray.push({
                id: key,
                config: this.state.controls[key]
            })
        }

        const form = formElementsArray.map(formElem => (
            <Input
                validity={formElem.config.valid}
                touched={formElem.config.touched}
                key={formElem.id}
                elementType={formElem.config.elementType}
                elementConfig={formElem.config.elementConfig}
                value={formElem.config.value}
                changed={(event) => this.inputChangedHandeler(event, formElem.id)}
            />
        ));

        let renderForm = <Spinner />

        let errorMessage = null;

        if(this.props.error) {
            errorMessage = (
                <p className={classes.ErrorMessage}>{this.props.error.message}</p>
            )
        }

        if (!this.props.loading) {
            renderForm = (
                <React.Fragment>
                    <form onSubmit={this.submitHandeler}>
                        {errorMessage}
                        {form}
                        <Button btnType='Success'>{this.state.isSignup ? 'SIGN UP' : 'SIGN IN' }</Button>
                    </form>
                    <Button
                        btnType='Danger'
                        clicked={this.switchAuthModeHandler} >
                        SWITCH TO {this.state.isSignup ? 'SIGNIN' : 'SIGNUP'}
                    </Button>
                </React.Fragment>
            );
        }

        let authRedirect = null;

        if(this.props.isAuthenticated) {
            authRedirect = <Redirect to={this.props.authRedirect} />
        }

        return (
            <div className={classes.Auth}>
                {authRedirect}
                <h3>{this.state.isSignup ? 'SIGN UP' : 'SIGN IN'}</h3>
                {renderForm}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        loading: state.auth.loading,
        error: state.auth.error, 
        isAuthenticated: state.auth.token !== null,
        buildingBurger: state.burgerBuilder.building,
        authRedirect: state.auth.authRedirect
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);