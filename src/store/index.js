import {createStore} from "redux";
import reducer from "../reducers";
import moment from "moment/moment";
import firebase from '../config/firebase';

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
        }
    });
    console.log(users);
    return users;
};

let actualUser = {};
let today = moment(new Date()).format('YYYY-MM-DD');
let actualDate = today;

const initialState = {users: getUsers(), actualUser: actualUser, actualDate: actualDate, today: today};
export const store = createStore(reducer, initialState);