import firebase from '../config/firebase';
import {store} from "../store";

export default (state, action) => {
    const db = firebase.database().ref('users');
    switch (action.type) {
        case "SAVE_USERS":
            db.update(action.users);
            return {
                ...state,
                users: action.users
            };
        case "ADD_USER":
            let users = store.getState().users;
            users.push(action.user);
            db.update(users);
            return {
                ...state,
                users: users
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
        case "GET_USERS":

            return {
                ...state,
                users: getUsers()
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
        //TODO async handeln
        let items = snapshot.val();
        for (let item in items) {
            users.push({
                name: items[item].name,
                games: items[item].games
            });
            console.log("build users", users)
        }
    });
    console.log(users);
    return users;
};