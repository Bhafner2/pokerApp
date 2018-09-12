import firebase from '../config/firebase';
import {store} from "./store";
import {getUsersSuccess} from "./actions";
import {GET_USERS} from "./constants";

export default (state, action) => {
    const db = firebase.database().ref('users');
    switch (action.type) {
        case "SAVE_USERS":
            db.update(action.users);
            return {
                ...state,
                users: action.users
            };
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
            console.log("get users get");
            return {
                ...state,
                users: getUsers()
            };
        case "GET_USERS_SUCCESS":
            console.log("get users success");
            return {
                ...state,
                users: action.users
            };
        case "SET_TODAY":
            return {
                ...state,
                today: action.today,
                actualDate: action.today,
            };

        default:
            return state;
    }

}

let getUsers = function () {
    let users = [];
    const db = firebase.database().ref('users/');
    db.on('value', (snapshot) => {
        let items = snapshot.val();
        for (let item in items) {
            users.push({
                name: items[item].name,
                games: items[item].games
            });
            console.log(users);
            store.dispatch(getUsersSuccess(users))
        }
    });
    return users;
};