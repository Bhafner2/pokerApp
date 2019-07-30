import firebase from "../config/firebase";
import {takeLatest, call, put} from 'redux-saga/effects';
import {getUsersRejected, getUsersFulfilled, saveUsersRejected} from "./actions";
import {GET_USERS, SAVE_USERS} from "./constants";
import {store} from '../redux/store'
import * as _ from 'lodash';


export function* getUsersSaga() {
    console.log("saga get user");
    try {
        yield call(fetchUsers);
    } catch (err) {
        console.log("saga get users rejected ", err);
        yield put(getUsersRejected(err));
    }
}

const db = firebase.database().ref('/');

export function* saveUsersSaga(action) {
    try {
        yield call(db.set(action.data));
    } catch (err) {
        console.log("saga save users err ", err);
        yield put(saveUsersRejected(err));
    }
}

const users = firebase.database().ref('users/');

function fetchUsers() {
    db.on('value', (snapshot) => {

        let users = [];
        let dbUsers = snapshot.val().users;
        for (let user in dbUsers) {
            if (_.isNil(dbUsers[user].sumBuyIn)) {
                users.push({
                    name: dbUsers[user].name,
                    games: dbUsers[user].games,
                    sumBuyIn: 0,
                    sumWon: 0,
                    sumBounty: 0,
                    gamesPlayed: 0,
                });
            } else {
                users.push({
                    name: dbUsers[user].name,
                    games: dbUsers[user].games,
                    sumBuyIn: dbUsers[user].sumBuyIn,
                    sumWon: dbUsers[user].sumWon,
                    sumBounty: dbUsers[user].sumBounty,
                    gamesPlayed: dbUsers[user].gamesPlayed,
                });
            }
        }
        console.log("saga get Users fulfilled");
        store.getState();

        console.log("store state", store.getState());

        let dbGames = snapshot.val().games;
        let games = [];

        for (let i in dbGames) {
            games.push(dbGames[i]);
        }
        let data={
            users,
            games
        };

        store.dispatch(getUsersFulfilled(data));

    });
}


export function* usersSaga() {
    yield takeLatest(GET_USERS, getUsersSaga);
    yield takeLatest(SAVE_USERS, saveUsersSaga);
}
