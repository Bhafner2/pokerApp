import React, {Component} from 'react';
import './App.css';
import 'react-infinite-calendar/styles.css';
import {connectionError, getUsers, login, setLoad} from "./redux/actions";
import {connect} from 'react-redux'
import {store} from './redux/store'
import firebase from "./config/firebase";
import Home from "./components/Home";
import Login from "./components/Login";
import {Alert, Col, Row} from "reactstrap";
import logo from './img/Poker.png';
import * as _ from 'lodash';
import ReactLoading from 'react-loading';

export function showLoading() {
    return (
        <Row>
            <Col xs={5}/>
            <Col xs={2}>
                <br/>
                <ReactLoading type="spin" color="black" height={50} width={50}/>
                <br/>
            </Col>
            < Col
                xs={5}
            />
        </Row>
    )
}

let flanke = false;
let timeoutError;
let timeoutConn;

export function showNumber(number) {
    if (_.isNil(number) || _.isNaN(number)) {
        return 0;
    }
    if (number >= 1000000) {
        return (Math.round(number / 100000) / 10) + 'M';
    }
    if (number >= 1000) {
        return (Math.round(number / 100) / 10) + 'K';
    }

    return Math.round(number);
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showError: false,
        };
        this.connectionCheck = this.connectionCheck.bind(this);
        this.showError = this.showError.bind(this);
    }

    componentDidMount() {
        /*
                App.logout();
        */
        this.setState({
            showError: false,
        });
        this.connectionCheck();

        firebase.auth().onAuthStateChanged(function (user) {
            console.log("auth change");
            store.dispatch(setLoad(false));
            if (user) {
                App.login();
                console.log("name of login user", firebase.auth().currentUser.email);

            } else {
                App.logout();
            }
        });
    }

    connectionCheck() {
        let connectedRef = firebase.database().ref(".info/connected");
        const {connErr} = this.props.data;
        connectedRef.on("value", function (snap) {
            if (snap.val()) {
                if (!_.isNil(timeoutConn)) {
                    clearTimeout(timeoutConn);
                }
                console.log("connected");
                if (connErr) {
                    store.dispatch(getUsers());
                }
                store.dispatch(connectionError(false));
            } else {
                timeoutConn = setTimeout(() => {
                    store.dispatch(setLoad(false));
                    console.log("disconnected");
                    store.dispatch(connectionError(true));
                }, 1000);
            }
        });
        connectedRef.on("value", this.showError);
    }

    showError() {
        if (this.props.data.connErr && !flanke) {
            flanke = true;
            timeoutError = setTimeout(() => {
                this.setState({
                    showError: true,
                }, () => {
                    console.log("show Error set")
                });
                App.logout();
            }, 4000);
        } else {
            flanke = false;
            if (!_.isNil(timeoutError)) {
                clearTimeout(timeoutError);
            }
            this.setState({
                showError: false,
            });
            console.log("show Error reset");
        }
    }

    static login() {
        console.log("login");
        store.dispatch(login(true));
    }

    static logout() {
        firebase.auth().signOut().then(function () {
            console.log("logout");
            store.dispatch(login(false));
        }).catch(function (error) {
        });
    }

    render() {
        const version = 'v1.1.9';
        const {connErr, login} = this.props.data;
        return (
            <div>
                <header className="header">
                    <Row>
                        <Col xs="4">
                            <img className="logo" src={logo} alt={"logo"}/>
                        </Col>
                        <Col xs="8">
                            <h1 id={"title"}>Poker Statistic</h1>
                        </Col>
                    </Row>
                </header>
                {connErr ? showLoading() : (
                    <div>
                        {login ? <Home logout={App.logout}/> : <Login login={App.login}/>}
                    </div>
                )}
                <Alert className="center"
                       color="danger"
                       style={{
                           visibility: this.state.showError ? 'visible' : 'hidden',
                           position: "fixed",
                           left: "0",
                           bottom: "0",
                           width: "100%",
                       }}>
                    No connection to Server!
                </Alert>
                <div style={{position: "fixed", bottom: "5px", right: "5px", fontSize: "0.5em"}}>{version}</div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        data: state
    }
};

export default connect(
    mapStateToProps,
    {}
)(App);
