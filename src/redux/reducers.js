import {CONNECTION_ERROR, GET_USERS, GET_USERS_FULFILLED, LOAD, LOGIN, LOGIN_ERROR, SAVE_USERS} from "./constants";

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
            console.log("reducer get users fulfilled", action.data);
            let newState = {users: [], actualUser: {}, connErr: false, login: true, loginError: '', load: false,};
            return ({
                ...newState,
                users: action.data.users,
                games: action.data.games
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
        case LOAD:
            console.log("reducer load", action.load);
            return ({
                ...state,
                load: action.load
            });
        default:
            console.log("reducer default", action.type, state);
            return state;
    }
}