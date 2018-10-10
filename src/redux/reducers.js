import {CONNECTION_ERROR, GET_USERS, GET_USERS_FULFILLED, LOGIN, LOGIN_ERROR, SAVE_USERS} from "./constants";

export default (state, action) => {
    switch (action.type) {
        case SAVE_USERS:
            console.log("reducer save user", "break");
            break;
        case "UPDATE_ACTUAL_DATE":
            console.log("reducer update actual date", action.date);
            return {
                ...state,
                actualDate: action.date
            };
        case "UPDATE_ACTUAL_USER":
            console.log("reducer update actual user", action.user);
            return {
                ...state,
                actualUser: action.user
            };
        case GET_USERS:
            console.log("reducer get user", state);
            return state;
        case GET_USERS_FULFILLED:
            console.log("reducer get users fulfilled", action.users);
            let newState = {users: [], actualUser: {}, connErr: false, login: true, loginError: '',};
            return ({
                ...newState,
                users: action.users
            });
        case CONNECTION_ERROR:
            console.log("reducer connection error", action.connErr);
            return ({
                ...state,
                connErr: action.connErr
            });
        case LOGIN:
            console.log("reducer login", action.login);
            return ({
                ...state,
                login: action.login
            });
        case LOGIN_ERROR:
            console.log("reducer login error", action.text);
            return ({
                ...state,
                loginError: action.text
            });
        default:
            console.log("reducer default", action.type, state);
            return state;
    }
}