import React, {Component} from 'react';
import './App.css';
import {Alert, Col, Input, ListGroup, Row} from 'reactstrap';
import 'react-infinite-calendar/styles.css';
import logo from './Poker.png';
import AddUser from "./components/AddUserToList";
import {getUsers} from "./redux/actions";
import UserList from "./components/UserList";
import moment from "moment/moment";
import * as _ from 'lodash';
import {connect} from 'react-redux'
import {store} from './redux/store'
import firebase from "./config/firebase";

let error = false;


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showAlert: false,
            alertText: '',
            alertSuccess: false,
            today: moment(new Date()).format('YYYY-MM-DD'),
            date: moment(new Date()).format('YYYY-MM-DD'),
        };

        this.updateDate = this.updateDate.bind(this);
        this.showSaved = this.showSaved.bind(this);
        this.isToday = this.isToday.bind(this);
        this.updateDate = this.updateDate.bind(this);
        this.connectionCheck = this.connectionCheck.bind(this);
    }

    componentDidMount() {
        store.dispatch(getUsers());
        this.setState({
            today: moment(new Date()).format('YYYY-MM-DD'),
            date: moment(new Date()).format('YYYY-MM-DD'),
        });
    }

    isToday() {
        if (this.state.date === '') {
            return {backgroundColor: 'red'}
        }
        if (this.state.date !== this.state.today) {
            return {backgroundColor: 'LightSkyBlue'}
        } else {
            return {backgroundColor: 'white'}
        }
    }

    showSaved() {
        this.setState({
            showAlert: true,
            alertText: 'Saved',
            alertSuccess: true,
        });
        console.log("show alarm");
        setTimeout(() => {
            this.setState({
                showAlert: false
            });
            console.log("hide alarm");
            return false;
        }, 1000);
    };

    updateDate(evt) {
        this.setState({
            date: evt.target.value,
        });
    }

    connectionCheck() {
        let connectedRef = firebase.database().ref(".info/connected");
        connectedRef.on("value", function (snap) {
            if (snap.val() === true) {
                if (error) {
                    store.dispatch(getUsers());
                }
                console.log("connected");
                error = false;
            } else {
                console.log("disconnectet");
                error = true;
            }
        });
    }

    renderUsers() {
        const {date, today} = this.state;
        const users = this.props.asdf.users;

        console.log("users to render ", users);
        if (_.isNil(users[0])) {
            return (
                <div>loading....</div>
            )
        }

        return (
            <ListGroup key={"group"}>
                {users.map((user) =>
                    <UserList user={user} saved={this.showSaved} date={date} today={today}/>)}
                {console.log("render Users")}
            </ListGroup>
        );
    };

    render() {
        return (
            <div className="App">
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
                <Input type="date" name="date" id="date"
                       value={this.state.date}
                       onChange={this.updateDate}
                       style={this.isToday()}
                />
                <div>
                    {this.connectionCheck()}
                    {this.renderUsers()}
                </div>
                {error? <div/> : <AddUser saved={this.showSaved}/>}

                <Alert color={this.state.alertSuccess ? "success" : "danger"}
                       style={{
                           visibility: this.state.showAlert ? 'visible' : 'hidden',
                           position: "fixed",
                           left: "0",
                           bottom: "0",
                           width: "100%"
                       }}>
                    {this.state.alertText}
                </Alert>

                <Alert color="danger"
                       style={{
                           visibility: error ? 'visible' : 'hidden',
                           position: "fixed",
                           left: "0",
                           bottom: "0",
                           width: "100%"
                       }}>
                    "No connection to Server!"
                </Alert>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        asdf: state
    }
};

export default connect(
    mapStateToProps,
    {}
)(App);
