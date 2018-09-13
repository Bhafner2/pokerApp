import firebase from "../config/firebase";
import { takeLatest, call, put } from 'redux-saga/effects';
import {getUsersError, getUsersSuccess} from "./actions";
import {GET_USERS} from "./constants";
import { delay } from 'redux-saga';

let fechedUsers = [];
export function* getUsersSaga(action) {
    console.log("get users saga");

    try {
        yield call(fetchUsers);
        console.log("get users saga succ", fechedUsers);
        yield delay(1000);
        yield put(getUsersSuccess(fechedUsers));
    } catch (err) {
        console.log("get users saga err");
        yield put(getUsersError(err));
    }
}

function* fetchUsers(action) {
    let users = [];
    const db = firebase.database().ref('users/');
    db.on('value', (snapshot) => {
        console.log("vor loop");
        let items = snapshot.val();
        for (let item in items) {
            users.push({
                name: items[item].name,
                games: items[item].games
            });
        }
        fechedUsers = users;
    });
}

export function* getUsers() {
    yield takeLatest(GET_USERS, getUsersSaga);
}
