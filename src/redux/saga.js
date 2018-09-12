import firebase from "../config/firebase";
import { takeLatest, call, put } from 'redux-saga/effects';
import {getUsersError, getUsersSuccess} from "./actions";
import {GET_USERS} from "./constants";


export function* getUsersSaga(action) {
    console.log("get users saga");

    try {
        const result = yield fetchUsers();
        yield put(getUsersSuccess(result));
    } catch (err) {
        yield put(getUsersError(err));
    }
}

let fetchUsers = function () {
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
        return users;
    });
};

export function* getUsers() {
    yield takeLatest(GET_USERS, getUsersSaga);
}