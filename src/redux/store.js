import {applyMiddleware, createStore} from "redux";
import createSagaMiddleware from 'redux-saga'
import reducers from "./reducers";
import {usersSaga} from "./saga";
const initialState = {users: [], actualUser: {}, connErr: false, login: false};
const sagaMiddleware = createSagaMiddleware();

/*
const reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
*/

export const store = createStore(
    reducers,
    initialState,
    applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(usersSaga);
