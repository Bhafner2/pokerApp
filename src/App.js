import React, {Component} from 'react';
import './App.css';
import {Alert, Col, Input, ListGroup, Row} from 'reactstrap';
import 'react-infinite-calendar/styles.css';
import logo from './Poker.png';
import AddUser from "./components/AddUserToList";
import {store} from "./store";
import {getUsers} from "./actions";
import UserList from "./components/UserList";
import {Provider} from "react-redux";
import moment from "moment/moment";

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

    renderUsers() {
        return (
            <ListGroup key={"group"}>
                {store.getState().users.map((user) =>
                    <UserList user={user} saved={this.showSaved} date={this.state.date} today={this.state.today}/>)}
                {console.log("render Users")}
            </ListGroup>
        );
    };

    render() {
        return (
            <Provider store={store}>
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
                        {console.log("log befor render" + store.getState().users)}
                        {this.renderUsers()}
                    </div>
                    <AddUser saved={this.showSaved}/>

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
                </div>
            </Provider>
        );
    }
}

export default App;
