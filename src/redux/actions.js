import {GET_USERS, SAVE_USERS} from "./constants";

/*
export const saveUsers = users => ({type: "SAVE_USERS", users});
*/
export const getUsersSuccess = users => ({type: "GET_USERS_SUCCESS", users});
export const getUsersError = users => ({type: "GET_USERS_ERROR", users});

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

export function saveUsersSuccess(users) {
    return {
        type: "SAVE_USERS_SUCCESS",
        users
    };
}

export function saveUsersErr(users) {
    return {
        type: "SAVE_USERS_ERR",
        users
    };
}