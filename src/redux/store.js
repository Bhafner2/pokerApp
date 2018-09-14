import {applyMiddleware, createStore} from "redux";
import createSagaMiddleware from 'redux-saga'
import reducers from "./reducers";
import {usersSaga} from "./saga";
import promise from 'redux-promise-middleware';
const initialState = {users: [], actualUser: {}};
const sagaMiddleware = createSagaMiddleware();

/*
const reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
*/

export const store = createStore(
    reducers,
    initialState,
    applyMiddleware(sagaMiddleware, promise())
);

sagaMiddleware.run(usersSaga);
