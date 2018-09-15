import {
    GET_USERS,
    GET_USERS_FULFILLED,
    GET_USERS_REJECTED,
    SAVE_USERS,
    SAVE_USERS_FULFILLED,
    SAVE_USERS_REJECTED
} from "./constants";

export const getUsersFulfilled = users => ({type: GET_USERS_FULFILLED, users});

export const getUsersRejected = users => ({type: GET_USERS_REJECTED, users});

export function getUsers() {
    return {
        type: GET_USERS,
    };
}

export function saveUsers(users) {
    return {
        type: SAVE_USERS,
        users
    };
}

export function saveUsersRejected(users) {
    return {
        type: SAVE_USERS_REJECTED,
        users
    };
}