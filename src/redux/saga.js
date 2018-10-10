import firebase from "../config/firebase";
import {takeLatest, call, put} from 'redux-saga/effects';
import {getUsersRejected, getUsersFulfilled, saveUsersRejected} from "./actions";
import {GET_USERS, SAVE_USERS} from "./constants";
import {store} from '../redux/store'


export function* getUsersSaga() {
    console.log("saga get user");
    try {
        yield call(fetchUsers);
    } catch (err) {
        console.log("saga get users rejected ", err);
        yield put(getUsersRejected(err));
    }
}

export function* saveUsersSaga(action) {
    try {
        yield call(db.set(action.users));
    } catch (err) {
        console.log("saga save users err ", err);
        yield put(saveUsersRejected(err));
    }
}

const db = firebase.database().ref('users/');

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
        console.log("saga get Users fulfilled");
        store.getState();

        console.log("store state", store.getState());
        store.dispatch(getUsersFulfilled(users));
    });
}


export function* usersSaga() {
    yield takeLatest(GET_USERS, getUsersSaga);
    yield takeLatest(SAVE_USERS, saveUsersSaga);
}
