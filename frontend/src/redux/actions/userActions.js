import axios from 'axios';
import * as userConstants from '../constants/userConstants';
import { ORDER_LIST_MY_RESET } from '../constants/orderConstants';

export const login = (email, password) => {
    return async (dispatch) => {
        try {
            dispatch({ type: userConstants.USER_LOGIN_REQUEST });
            const res = await axios.post('/api/users/login', { email, password });
            dispatch({ type: userConstants.USER_LOGIN_SUCCESS, payload: res.data });
            localStorage.setItem('userInfo', JSON.stringify(res.data));
        }
        catch(error) {
            dispatch({
                type: userConstants.USER_LOGIN_FAIL,
                payload: error.response && error.response.data.message ? error.response.data.message : error.message
            });
        }
    }
}

export const logout = () => {
    return (dispatch) => {
        dispatch({ type: userConstants.USER_LOGOUT });
        // Empty the user details and orders list after logout
        dispatch({ type: userConstants.USER_DETAILS_RESET });
        dispatch({ type: ORDER_LIST_MY_RESET });
        localStorage.removeItem('userInfo');
    }
}

export const register = (name, email, password) => {
    return async (dispatch) => {
        try {
            dispatch({ type: userConstants.USER_REGISTER_REQUEST });
            const res = await axios.post('/api/users', { name, email, password });
            dispatch({ type: userConstants.USER_REGISTER_SUCCESS, payload: res.data });
            dispatch({ type: userConstants.USER_LOGIN_SUCCESS, payload: res.data });
            localStorage.setItem('userInfo', res.data);
        }
        catch(error) {
            dispatch({
                type: userConstants.USER_REGISTER_FAIL,
                payload: error.response && error.response.data.message ? error.response.data.message : error.message
            });
        }
    }
}

export const getUserDetails = (id) => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: userConstants.USER_DETAILS_REQUEST });
            
            // Setting header with JWT token
            const config = { headers: { Authorization: `Bearer ${getState().userLogin.userInfo.token}` } };
            // Hits /api/users/profile for profile or ID as passed to it
            const res = await axios.get(`/api/users/${id}`, config);
            
            dispatch({ type: userConstants.USER_DETAILS_SUCCESS, payload: res.data });
        }
        catch(error) {
            dispatch({
                type: userConstants.USER_DETAILS_FAIL,
                payload: error.response && error.response.data.message ? error.response.data.message : error.message
            });
        }
    }
}

export const updateUserProfile = (user) => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: userConstants.USER_UPDATE_PROFILE_REQUEST });
            
            // Setting header with JWT token
            const config = { headers: { Authorization: `Bearer ${getState().userLogin.userInfo.token}` } };
            // Hits /api/users/profile for profile or ID as passed to it
            const res = await axios.put(`/api/users/profile`, user, config);
            
            dispatch({ type: userConstants.USER_UPDATE_PROFILE_SUCCESS, payload: res.data });
        }
        catch(error) {
            dispatch({
                type: userConstants.USER_UPDATE_PROFILE_FAIL,
                payload: error.response && error.response.data.message ? error.response.data.message : error.message
            });
        }
    }
}