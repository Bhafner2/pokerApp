import { createStore } from "redux";
import reducer from "../reducers";
import moment from "moment/moment";

let game1 = {
    date: '2018-09-10',
    buyIn: 20,
    won: 30
};

let game3 = {
    date: '2018-09-06',
    buyIn: 100,
    won: 54
};

let game2 = {
    date: '2018-07-21',
    buyIn: 20,
    won: 30
};

let user1 = {
    name: 'benj',
    games: [game1, game2]
};

let user2 = {
    name: 'hall1',
    games: [game2, game3]
};

let users = [user1, user2];

let actualUser = {};
let today = moment(new Date()).format('YYYY-MM-DD');
let actualDate = today;

const initialState = { users: users, actualUser, actualDate, today };
export const store = createStore(reducer, initialState);