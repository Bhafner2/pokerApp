import {GET_USERS} from "./constants";

export const saveUsers = users => ({ type: "SAVE_USERS", users });
export const updateActualUser = user => ({ type: "UPDATE_ACTUAL_USER", user });
/*
export const getUsers = () => ({ type: GET_USERS});
*/
export const getUsersSuccess = users => ({ type: "GET_USERS_SUCCESS", users});
export const getUsersError = users => ({ type: "GET_USERS_ERROR", users});

export function getUsers() {
    console.log("get users action");
    return {
        type: GET_USERS,
    };
}