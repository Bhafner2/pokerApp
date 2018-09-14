import firebase from '../config/firebase';
import {GET_USERS, GET_USERS_FULFILLED, SAVE_USERS, SAVE_USERS_FULFILLED} from "./constants";

export default (state, action) => {
    const db = firebase.database().ref('users');
    switch (action.type) {
        case SAVE_USERS:
            console.log("save users saga");

            return state;



            /*            db.set(action.users);
                        console.log("send to DB ", action.users);
                        return {
                            ...state,
                            users: action.users
                        };*/
        case SAVE_USERS_FULFILLED:
            console.log("save users saga succ");

            return state;


        /*return {
            ...state,
            users: action.users
        };*/
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
            return {
                ...state,
                users: action.users
            };
        default:
            console.log("default action");
            return state;
    }
}