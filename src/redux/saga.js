import firebase from "../config/firebase";
import {takeLatest, call, put} from 'redux-saga/effects';
import {getUsersRejected, getUsersFulfilled, saveUsersRejected} from "./actions";
import {GET_USERS, SAVE_USERS} from "./constants";
import {store} from '../redux/store'

const db = firebase.database().ref('users/');

export function* getUsersSaga() {
    console.log("get users saga");

    try {
        yield call(fetchUsers);
    } catch (err) {
        console.log("get users saga err");
        yield put(getUsersRejected(err));
    }
}

export function* saveUsersSaga(action) {
    try {
        yield call(db.set(action.users));
    } catch (err) {
        console.log("save users saga err");
/*
        yield put(saveUsersRejected(err));
*/
    }
}

function fetchUsers() {
    db.on('value', (snapshot) => {
        let users = [];
        let data = snapshot.val();
        for (let user in data) {
            users.push({
                name: data[user].name,
                games: data[user].games
            });
        }
        store.dispatch(getUsersFulfilled(users));
        console.log("save users saga succ");
    });
}

export function* usersSaga() {
    yield takeLatest(GET_USERS, getUsersSaga);
    yield takeLatest(SAVE_USERS, saveUsersSaga);
}
