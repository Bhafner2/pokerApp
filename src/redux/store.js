import {applyMiddleware, createStore} from "redux";
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import createSagaMiddleware from 'redux-saga'
import reducers from "./reducers";
import {getUsers} from "./saga";

const initialState = {users: [], actualUser: {}};
const sagaMiddleware = createSagaMiddleware();

/*
const reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
*/

export const store = createStore(
    reducers,
    initialState,
    applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(getUsers);
