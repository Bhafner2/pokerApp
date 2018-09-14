import firebase from "../config/firebase";
import {takeLatest, call, put} from 'redux-saga/effects';
import {getUsersError, getUsersSuccess, saveUsersErr, saveUsersSuccess} from "./actions";
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
        yield put(getUsersSuccess(fechedUsers));
    } catch (err) {
        console.log("get users saga err");
        yield put(getUsersError(err));
    }
}

export function* saveUsersSaga(action) {
    try {
        yield call(db.set(action.users));
        yield delay(1000);
        yield put(saveUsersSuccess());

    } catch (err) {
        console.log("save users saga err");
        yield put(saveUsersErr(err));
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
