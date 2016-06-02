import * as types from '../constants/ActionTypes';
import helper from '../services/helper';
import { push } from 'react-router-redux';
import { reset } from 'redux-form';

// Should probably implement products listings state update on each user interaction
export const fetchUpdatedProducts = () => {
    return (dispatch, getState) => {
        const url = '/products';
        helper.getHelper(url)
            .then(resp => {
                var updatedState = resp.data;
                if (resp.status == 200) {
                    // old and new state comparison, for conditional dispatch. 
                    // Refactor: normalize data (hash tables is easier/faster to compare); 
                    /* Example comparison check: 
                       for (id in previousProductsState){
                          if (!updatedProductsState.hasOwnProperty(id)){
                            return false;
                          }
                       }
                       return true; 
                    */
                    var previousState = getState().products;
                    var hasStateChanged = !updatedState.every((updatedProduct) => {
                        return previousState.some(previousProduct => {
                            return previousProduct._id === updatedProduct._id;
                        });
                    });
                    if (hasStateChanged) {
                        // so Component re-renders will only be triggered when at least
                        // one new product has been aded. NOW, this allows for cheap reference
                        // checks in component lifecycles.
                        dispatch(updateProductsState(updatedState));
                    }
                }
            })
            .catch(err => {
                console.error(err);
            });
    };
};

const updateProductsState = (updatedState) => {
    return {
        type: types.UPDATE_PRODUCTS_STATE,
        updatedProductsState: updatedState
    };
};

const addListingRequest = () => {
    return {
        type: types.ADDLISTING_REQUEST
    };
};

const addListingSuccess = (newItem) => {
    return {
        type: types.ADDLISTING_SUCCESS,
        newItem: newItem
    };
};

const addListingFailure = () => {
    return {
        type: types.ADDLISTING_FAILURE
    };
};


export const addNewListing = (fields) => {
    return (dispatch, getState) => {
        // parse form data for submission
        let newProductListing = {
            ...fields,
            author: getState().user.username,
            schedule: [{ to: fields.to, from: fields.from }]
        };
        delete newProductListing.to;
        delete newProductListing.from;

        dispatch(addListingRequest());
        let url = '/products';
        helper.postHelper(url, newProductListing)
            .then(resp => {
                console.log("inside addNewListing thunk success handler!");
                let newItem = resp.data;

                dispatch(addListingSuccess(newItem));

                // Should check!
                if (resp.status != 200) {
                    dispatch(addListingSuccess(newItem));
                } else {
                    dispatch(addListingFailure());
                }
            })
            .catch(err => {
                console.error(err);
                console.log("inside addNewListing thunk catch handler!");
                dispatch(addListingFailure());
            });
    };
};

export const updateFormField = (fieldKey, fieldValue) => {
    return {
        type: types.UI_UPDATE_FORMFIELD,
        fieldKey: fieldKey,
        fieldValue: fieldValue
    };
};

export const toggleViewManageListings = () => {
    return {
        type: types.UI_TOGGLE_VIEW_MANAGEDLISTING
    };
};

export const toggleViewAddNewListingForm = () => {
    return {
        type: types.UI_TOGGLE_VIEW_ADDNEWLISTINGFORM
    };
};

const removeListingRequest = (itemId) => {
    return {
        type: types.REMOVELISTING_REQUEST,
        itemId: itemId
    };
};

const removeListingSuccess = (itemId) => {
    return {
        type: types.REMOVELISTING_SUCCESS,
        itemId: itemId
    };
};

const removeListingFailure = (itemId) => {
    return {
        type: types.REMOVELISTING_FAILURE,
        itemId: itemId
    };
};

export const removeRentedItem = (item) => {
    return (dispatch, getState) => {
        dispatch(removeListingRequest(item._id));
        let dataToSend = {
            username: item.author
        };
        let url = 'products/rent/' + item._id;
        // Not sure if current server route is correctly set up to handle.
        // Route needs to accept a product ID for removal, and remove on that basis.
        helper.putHelper(url, dataToSend)
            .then(resp => {
                let data = resp.data;
                // assume success.
                dispatch(removeListingSuccess(item._id));
                // if (resp.status != 200) {
                //     dispatch(removeListingFailure(item._id));
                // } else {
                //     dispatch(removeListingSuccess(item._id));
                // }
            })
            .catch(err => {
                console.error(err);
                dispatch(removeListingFailure(item._id));
            });
    };
};

//////////////////////////////////////////////////////////////
// Synchronous Action Creators
//////////////////////////////////////////////////////////////

/**
 *  @param {Object} userData - Login credentials (username, password)
 */
export const makeLoginRequest = (userData) => {
    return {
        type: types.LOGIN_REQUEST,
        payload: userData
    };
};

/**
 *  @param {Object} user - user data excluding password
 *  @param {String} token - JWT token data
 */
export const loginSuccess = (user, token) => {
    return {
        type: types.LOGIN_SUCCESS,
        payload: {
            user: user,
            token: token
        }
    };
};

/**
 *  @param {Object} err - Response object returned from server
 */
export const loginFailure = (err) => {
    return {
        type: types.LOGIN_FAILURE,
        payload: err
    };
};

/**
 *  @param {Object} userData - Login credentials (username, email, password)
 */
export const makeSignupRequest = (userData) => {
    return {
        type: types.SIGNUP_REQUEST,
        payload: userData
    };
};

/**
 *  @param {Object} user - user data excluding password
 *  @param {String} token - JWT token data
 */
export const signupSuccess = (user, token) => {
    return {
        type: types.SIGNUP_SUCCESS,
        payload: {
            user: user,
            token: token
        }
    };
};

/**
 *  @param {Object} err - Response object returned from server
 */
export const signupFailure = (err) => {
    return {
        type: types.SIGNUP_FAILURE,
        payload: err
    };
};

export const logOut = () => {
    return {
        type: types.LOGOUT
    };
};

/**
 *  @param {String} token - JWT token data stored in localStorage
 */
export const verifyUser = (token) => {
    return {
        type: types.VERIFY_USER,
        payload: {
            token: token
        }
    };
};

/**
 *  @param {Object} user - user data excluding password
 *  @param {String} token - JWT token data
 */
export const verifySuccess = (user, token) => {
    return {
        type: types.VERIFY_SUCCESS,
        payload: {
            user: user,
            token: token
        }
    };
};

/**
 *  @param {Object} err - Response object returned from server
 */
export const verifyFailure = (err) => {
    return {
        type: types.VERIFY_FAILURE,
        payload: err
    };
};

export const socialLogin = (userData) => {
    return {
        type: types.SOCIAL_LOGIN,
        payload: userData
    };
};

/**
 *  @param {Object} query - contains query string inside search property
 */
export const search = (query) => {
    return {
        type: types.SEARCH,
        payload: query.search
    };
};

//////////////////////////////////////////////////////////////
// Asynchronous Action Creator combination
//////////////////////////////////////////////////////////////

/**
 *  @param {Object} userData - Login credentials (username, password)
 */
export const attemptLogin = (userData) => {
    return function(dispatch) {
        dispatch(makeLoginRequest(userData));
        var url = '/auth/login';
        return helper.postHelper(url, userData)
            .then(resp => {
                let data = resp.data;
                if (resp.status != 200) {
                    dispatch(loginFailure(resp.payload));

                    // If User is Authorized from server, save JWT token to localStorage,
                    // dispatch success action and redirect to profile(dashboard) page
                } else {
                    window.localStorage.setItem('jwtToken', data.token);
                    dispatch(loginSuccess(data.user, data.token));
                    dispatch(push('/profile'));
                }
            })
            // If User is rejected from server, dispatch failure action and reset login Form
            .catch(err => {
                console.error(err);
                dispatch(loginFailure(err));
                dispatch(reset('LoginForm'));
            });
    };
};

/**
 *  @param {Object} userData - Login credentials (username, email, password)
 */
export const attemptSignup = (userData) => {
    return (dispatch) => {
        dispatch(makeSignupRequest(userData));
        var url = '/auth/signup';
        return helper.postHelper(url, userData)
            .then(resp => {
                let data = resp.data;
                if (resp.status != 200) {
                    console.log('resp status is not 200');

                    // If User is Authorized from server, save JWT token to localStorage,
                    // dispatch success action and redirect to profile(dashboard) page
                } else {
                    window.localStorage.setItem('jwtToken', data.token);
                    dispatch(signupSuccess(data.user, data.token));
                    dispatch(push('/profile'));
                }
            })
            // If User is rejected from server, dispatch failure action and reset login Form
            .catch(err => {
                console.error(err);
                dispatch(signupFailure(err));
                dispatch(reset('SignupForm'));
            });
    };
};

/**
 *  @param {String} token - JWT token data stored in localStorage
 */
export const attemptVerify = (token) => {
    return (dispatch) => {
        let url = '/auth/verify';
        dispatch(verifyUser(token));
        return helper.getHelper(url)
            .then(resp => {
                let data = resp.data;

                // If User is verified from server,
                // dispatch success action which will update state
                dispatch(verifySuccess(data.user, data.token));
            })

        // If User is rejected from server, dispatch failure action
        .catch(err => {
            dispatch(verifyFailure(err));
        });
    };
};

export const attemptSocialLogin = (userData) => {
    return (dispatch) => {
        let url = '/auth/signup';
        return helper.postHelper(url, userData)
            .then(() => {
                dispatch(attemptLogin(userData));
            })
            .catch(err => {
                console.log(err);
            });
    };
};
