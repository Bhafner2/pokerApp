import {
    CONNECTION_ERROR, GET_GAMES_FULFILLED,
    GET_USERS,
    GET_USERS_FULFILLED,
    GET_USERS_REJECTED, LOAD, LOGIN, LOGIN_ERROR,
    SAVE_USERS,
    SAVE_USERS_REJECTED
} from "./constants";


export const getUsersRejected = users => ({type: GET_USERS_REJECTED, users});

export function getUsers() {
    return {
        type: GET_USERS,
    };
}

export function getUsersFulfilled(data) {
    return {
        type: GET_USERS_FULFILLED,
        data
    };
}


export function saveUsers(data) {
    return {
        type: SAVE_USERS,
        data
    };
}

export function saveUsersRejected(users) {
    return {
        type: SAVE_USERS_REJECTED,
        users
    };
}

export function connectionError(connErr) {
    return {
        type: CONNECTION_ERROR,
        connErr
    };
}

export function login(login) {
    return {
        type: LOGIN,
        login
    };
}

export function loginError(text) {
    return {
        type: LOGIN_ERROR,
        text
    };
}

export function setLoad(load) {
    return {
        type: LOAD,
        load
    };
}