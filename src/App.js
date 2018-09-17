import React, {Component} from 'react';
import './App.css';
import {Alert, Col, Input, ListGroup, ListGroupItem, Row} from 'reactstrap';
import 'react-infinite-calendar/styles.css';
import logo from './Poker.png';
import chart from './chart-bar-regular.svg';
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
                    console.log("connected");
                }
                error = false;
            } else {
                setTimeout(() => {
                    if (error) {
                        console.log("disconnected");
                    }
                    error = true;
                }, 100);
            }
        });
    }

    renderUsers() {
        const {date, today} = this.state;
        const users = this.props.data.users;

        if (_.isNil(users) || _.isNil(users[0])) {
            return (
                <div>loading....</div>
            )
        }
        console.log("users to render ", users);

        return (
            <div>
                {users.map((user, i) =>
                    <UserList user={user} key={i} saved={this.showSaved} date={date} today={today}/>)}
                {console.log("render Users: ", users)}
            </div>
        );
    };

   /* dbInit() {
        const db = firebase.database().ref('users/');
        db.set([
            {
                name: 'init',
                games: [
                    {
                        date: '2000-01-01',
                        buyIn: 0,
                        won: 0
                    }]
            }

        ])
    }*/

    render() {
        return (
            <div className="App">
                {/*
                {this.dbInit()}
*/}
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
                <ListGroup>
                    <ListGroupItem key="global">
                        <Row>
                            <Col xs="2">
                                <img className="chart" src={chart} alt={"chart"}/>
                            </Col>
                            <Col xs="10">

                                <Input type="date" name="date" id="date"
                                       value={this.state.date}
                                       onChange={this.updateDate}
                                       style={this.isToday()}
                                />
                            </Col>
                        </Row>
                    </ListGroupItem>

                    {this.connectionCheck()}
                    {this.renderUsers()}
                </ListGroup>

                {error ? <div/> : <AddUser saved={this.showSaved}/>}

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
                    No connection to Server!
                </Alert>
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
