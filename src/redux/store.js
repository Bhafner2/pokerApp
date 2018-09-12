import {applyMiddleware, compose, createStore} from "redux";
import reducer from "./reducers";
import createSagaMiddleware from 'redux-saga'

const initialState = {users: [], actualUser: {}};
const sagaMiddleware = createSagaMiddleware();

const reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();


export const store = createStore(
    reducer,
    initialState,
    compose(applyMiddleware(sagaMiddleware), reduxDevTools)
);
