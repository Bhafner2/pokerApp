import {CONNECTION_ERROR, GET_USERS, GET_USERS_FULFILLED, SAVE_USERS} from "./constants";

export default (state, action) => {
    switch (action.type) {
        case SAVE_USERS:
            console.log("save users saga");
            break;
        case "UPDATE_ACTUAL_DATE":
            return {
                ...state,
                actualDate: action.date
            };
        case "UPDATE_ACTUAL_USER":
            return {
                ...state,
                actualUser: action.user
            };
        case GET_USERS:
            return state;
        case GET_USERS_FULFILLED:
            console.log("get users success", action.users);
            return ({
                ...state,
                users: action.users
            });
        case CONNECTION_ERROR:
            return ({
                ...state,
                connErr: action.connErr
            });
        default:
            console.log("default action");
            return state;
    }
}