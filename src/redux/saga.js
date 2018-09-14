import firebase from "../config/firebase";
import {takeLatest, call, put} from 'redux-saga/effects';
import {getUsersRejected, getUsersFulfilled, saveUsersRejected, saveUsersFulfilled} from "./actions";
import {GET_USERS, SAVE_USERS} from "./constants";
import {delay} from 'redux-saga';

let fechedUsers = [];
const db = firebase.database().ref('users/');

export function* getUsersSaga(action) {
    console.log("get users saga");

    try {
        yield call(fetchUsers);
        console.log("get users saga succ", fechedUsers);
        yield delay(1000);
        yield put(getUsersFulfilled(fechedUsers));
    } catch (err) {
        console.log("get users saga err");
        yield put(getUsersRejected(err));
    }
}

export function* saveUsersSaga(action) {
    try {
        yield call(db.set(action.users));
        yield delay(1000);
        yield put(saveUsersFulfilled());

    } catch (err) {
        console.log("save users saga err");
        yield put(saveUsersRejected(err));
    }
}

function* fetchUsers(action) {
    let users = [];
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

export function* usersSaga() {
    yield takeLatest(GET_USERS, getUsersSaga);
    yield takeLatest(SAVE_USERS, saveUsersSaga);
}
