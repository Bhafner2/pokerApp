import React, {Component} from 'react';
import {Alert, Col, Input, ListGroup, ListGroupItem, Row} from 'reactstrap';
import 'react-infinite-calendar/styles.css';
import AddUser from "./AddUser";
import {getUsers} from "../redux/actions";
import UserList from "./UserList";
import moment from "moment/moment";
import * as _ from 'lodash';
import {connect} from 'react-redux'
import {store} from '../redux/store'
import GeneralStatistic from "./GeneralStatistic";
import Calc from "./Calc";
import ReactLoading from 'react-loading';
import ThisGame from "./ThisGame";
import logout from '../img/sign-out-alt-solid.svg';
import date from '../img/calendar-alt-solid.svg';
import search from '../img/search-solid.svg';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showAlert: false,
            alertText: '',
            alertSuccess: false,
            today: moment(new Date()).format('YYYY-MM-DD'),
            date: moment(new Date()).format('YYYY-MM-DD'),
            showDate: true,
        };

        this.updateDate = this.updateDate.bind(this);
        this.showSaved = this.showSaved.bind(this);
        this.isToday = this.isToday.bind(this);
        this.updateDate = this.updateDate.bind(this);
        this.toggleDate = this.toggleDate.bind(this);
    }

    componentDidMount() {
        store.dispatch(getUsers());
        this.setState({
            today: moment(new Date()).format('YYYY-MM-DD'),
            date: moment(new Date()).format('YYYY-MM-DD'),
            showDate: true,
        });
    }

    isToday() {
        if (this.state.date === '') {
            return {backgroundColor: 'red'}
        }
        if (this.state.date !== this.state.today) {
            return {backgroundColor: 'LightSkyBlue'}
        } else {
            return {backgroundColor: 'whitesmoke'}
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
        }, 2000);
    };

    updateDate(evt) {
        this.setState({
            date: evt.target.value,
        });
    }

    renderUsers() {
        const {date, today} = this.state;
        const {users} = this.props.data;

        if (_.isNil(users) || _.isNil(users[0])) {
            return (
                Home.loading()
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

    /*     dbInit() {
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
    static loading() {
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

    toggleDate() {
        this.setState({
            showDate: !this.state.showDate,
        });
    }

    render() {
        const {connErr} = this.props.data;
        return (
            <div>

                {/*
                {this.dbInit()}
*/}
                <ListGroupItem key="global" style={{backgroundColor: "whitesmoke"}}>
                    <Row>
                        <Col xs="2">
                            <Calc/>
                        </Col>
                        <Col xs="2">
                            {connErr ? <div/> : <GeneralStatistic today={this.state.date}/>}
                        </Col>
                        <Col xs="2">
                            {connErr ? <div/> : <ThisGame today={this.state.date}/>}
                        </Col>
                        <Col xs="2">
                            {connErr ? <div/> :
                                <img className="date" src={date} alt={"date"} onClick={this.toggleDate}
                                     style={{height: "30px"}} style={this.isToday()}/>}
                        </Col>
                        <Col xs="2">
                            {connErr ? <div/> :
                                <img className="search" src={search} alt={"search"}
                                     style={{height: "30px"}}/>}
                        </Col>
                        <Col xs="2">
                            {connErr ? <div/> :
                                <img className="logout" src={logout} alt={"logout"} onClick={this.props.logout}
                                     style={{height: "30px"}}/>}
                        </Col>
                    </Row>
                    {this.state.showDate ? <div/> :
                        <Row>
                            <Col>
                                <br/>
                                <Input type="date" name="date" id="date"
                                       value={this.state.date}
                                       onChange={this.updateDate}
                                       style={this.isToday()}
                                />
                            </Col>
                        </Row>}
                </ListGroupItem>
                {connErr ? Home.loading() : (
                    <div>
                        <ListGroup>
                            {this.renderUsers()}
                        </ListGroup>

                        <div style={{
                            paddingTop: '10px',
                            paddingBottom: '20px',
                        }}>
                            <AddUser saved={this.showSaved}/>
                        </div>
                    </div>
                )}
                <Row>
                    <Alert color="danger"
                           style={{
                               visibility: connErr ? 'visible' : 'hidden',
                               position: "fixed",
                               left: "0",
                               bottom: "0",
                               width: "100%"
                           }}>
                        No connection to Server!
                    </Alert>
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
                </Row>
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
)(Home);