import React, {Component} from 'react';
import './App.css';
import 'react-infinite-calendar/styles.css';
import {connectionError, getUsers, login, setLoad} from "./redux/actions";
import {connect} from 'react-redux'
import {store} from './redux/store'
import firebase from "./config/firebase";
import Home from "./components/Home";
import Login from "./components/Login";
import {Col, Row} from "reactstrap";
import logo from './img/Poker.png';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.connectionCheck = this.connectionCheck.bind(this);
    }

    componentWillMount() {
        App.logout();
        setTimeout(() => {
            this.connectionCheck()
        }, 3000);

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
                console.log("connected");
                if (connErr) {
                    store.dispatch(getUsers());
                }
                store.dispatch(connectionError(false));
            } else {
                store.dispatch(connectionError(true));
                store.dispatch(setLoad(false));
                App.logout();
                console.log("disconnected");
            }
        });
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
                <div>
                    {this.props.data.login ? <Home logout={App.logout}/> : <Login login={App.login}/>}
                </div>
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
