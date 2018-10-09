import React, {Component} from 'react';
import './App.css';
import 'react-infinite-calendar/styles.css';
import {connectionError, getUsers} from "./redux/actions";
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
        this.state = {
            loginSuccess: false,
        };

        this.connectionCheck = this.connectionCheck.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            this.connectionCheck()
        }, 2000);
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
                console.log("disconnected");
            }
        });
    }

    login() {
        this.setState({
            loginSuccess: true,
        })
    }

    logout() {
        this.setState({
            loginSuccess: false,
        })
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
                            <h1>Poker Statistic</h1>
                        </Col>
                    </Row>
                </header>
                <div>
                    {this.state.loginSuccess ? <Home logout={this.logout}/> : <Login login={this.login}/>}
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
