import axios from 'axios';
import * as actionTypes from './actionTypes';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
};

export const authSuccess = (authData) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: authData.idToken,
        userId: authData.localId
    }
}

export const authFail = (err) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: err
    }
}

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
    return {
        type: actionTypes.AUTH_LOGOUT
    }
}

export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000);
    }
}

export const auth = (email, password, isSignup) => {
    return dispatch => {
        dispatch(authStart());
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        };
        let url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyDKoy3BfnJhiqQU_rZT_SkjseI9u0S5JR4';
        if(!isSignup) {
            url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyDKoy3BfnJhiqQU_rZT_SkjseI9u0S5JR4';
        }
        axios.post(url, authData)
            .then(res => {
                console.log(res);
                const expirationDate = new Date( new Date().getTime() + res.data.expiresIn * 1000 );
                localStorage.setItem('token', res.data.idToken);
                localStorage.setItem('expirationDate', expirationDate);
                localStorage.setItem('userId', res.data.localId);
                dispatch(authSuccess(res.data));
                dispatch(checkAuthTimeout(res.data.expiresIn));
            })
            .catch(err => {
                console.log(err);
                dispatch(authFail(err.response.data.error));
            });
    }
}

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    }
}

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        if(!token) {
            dispatch(logout());
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if(expirationDate > new Date()) {
                const userId = localStorage.getItem('userId');
                dispatch(authSuccess({ idToken: token , localId: userId }));
                const timeoutSeconds = (expirationDate.getTime() - new Date().getTime()) / 1000;
                dispatch(checkAuthTimeout(timeoutSeconds));
            }
        }
    }
}