import {applyMiddleware, createStore, compose} from "redux";
import createSagaMiddleware from 'redux-saga'
import reducers from "./reducers";
import {usersSaga} from "./saga";

const initialState = {users: [], actualUser: {}, connErr: true, login: false, loginError: '', load: false,};
const sagaMiddleware = createSagaMiddleware();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


export const store = createStore(
    reducers,
    initialState,
    composeEnhancers(
        applyMiddleware(sagaMiddleware)
    )
);

sagaMiddleware.run(usersSaga);
