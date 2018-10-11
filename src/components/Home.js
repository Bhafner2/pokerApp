import React, {Component} from 'react';
import {Alert, Button, Col, Input, ListGroup, ListGroupItem, Row} from 'reactstrap';
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

export function loading() {
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


class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showAlert: false,
            alertText: '',
            alertSuccess: false,
            today: moment(new Date()).format('YYYY-MM-DD'),
            date: moment(new Date()).format('YYYY-MM-DD'),
            search: '',
            showDate: true,
            showSearch: true,
            usersToRender: {},
            filtered: false,
        };

        this.updateDate = this.updateDate.bind(this);
        this.showSaved = this.showSaved.bind(this);
        this.isToday = this.isToday.bind(this);
        this.updateDate = this.updateDate.bind(this);
        this.updateSearch = this.updateSearch.bind(this);
        this.toggleDate = this.toggleDate.bind(this);
        this.toggleSearch = this.toggleSearch.bind(this);
        this.filterUser = this.filterUser.bind(this);
    }

    isToday() {
        if (this.state.date === '') {
            return 'red'
        }
        if (this.state.date !== this.state.today) {
            return 'blue'
        } else {
            return 'black'
        }
    }

    componentWillMount() {
        store.dispatch(getUsers());
        this.setState({
            today: moment(new Date()).format('YYYY-MM-DD'),
            date: moment(new Date()).format('YYYY-MM-DD'),
            showDate: true,
            usersToRender: this.props.data.users,
        }, () => {
            this.filterUser();
        });
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

    updateSearch(evt) {
        if (_.isNil(evt.target.value) || evt.target.value === '') {
            this.setState({
                filtered: false,
                search: '',
            });
        } else {
            this.setState({
                search: evt.target.value,
                filtered: true,
            });
        }
    }

    filterUser(users) {
        if (!_.isNil(this.state.search) || this.state.search === '') {
            return _.filter(users, (user) => {
                console.log("filter", user.name, this.state.search, _.includes(user.name.toLowerCase(), this.state.search.toLowerCase()));
                return _.includes(user.name.toLowerCase(), this.state.search.toLowerCase());
            });
        } else {
            return users;
        }
    }

    renderUsers() {
        const {users} = this.props.data;
        const {date, today} = this.state;

        if (_.isNil(users) || _.isNil(users[0])) {
            return (
                loading()
            )
        }
        let filteredUsers = this.filterUser(users);

        if (filteredUsers.size < 1) {
            return (
                <div>
                    No user found...
                </div>
            )
        }
        return (
            <div>
                {filteredUsers.map((user, i) =>
                    <UserList user={user} key={i} saved={this.showSaved} date={date} today={today}/>)}
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

    toggleDate() {
        this.setState({
            showDate: !this.state.showDate,
            showSearch: true,
        });
    }

    toggleSearch() {
        this.setState({
            showSearch: !this.state.showSearch,
            showDate: true,
        });
    }

    render() {
        const {connErr} = this.props.data;
        return (
            <div className="center">

                {/*
                {this.dbInit()}
*/}
                <ListGroupItem key="global" style={{backgroundColor: "whitesmoke"}}>
                    <Row>
                        <Col xs="2">
                            <Calc/>
                        </Col>
                        <Col xs="2">
                            <GeneralStatistic today={this.state.date}/>
                        </Col>
                        <Col xs="2">
                            <ThisGame today={this.state.date}/>
                        </Col>
                        <Col xs="2">
                            <i className="fa fa-calendar" onClick={this.toggleDate}
                               style={{fontSize: "30px", color: this.isToday()}}/>
                        </Col>

                        <Col xs="2">
                            <i className="fa fa-search" onClick={this.toggleSearch}
                               style={{fontSize: "30px", color: this.state.filtered ? "blue" : "black"}}/>
                        </Col>

                        <Col xs="2">
                            <i className="fa  fa-sign-out" onClick={this.props.logout}
                               style={{fontSize: "30px",}}/>
                        </Col>
                    </Row>
                    {this.state.showDate ? <div/> :
                        <Row>
                            <Col>
                                <br/>
                                <Input type="date" name="date" id="date"
                                       value={this.state.date}
                                       onChange={this.updateDate}
                                       style={{color: this.isToday()}}
                                />
                            </Col>
                        </Row>}
                    {this.state.showSearch ? <div/> :
                        <Row>
                            <Col xs={10}>
                                <br/>
                                <Input type="text" name="search" id="search"
                                       value={this.state.search}
                                       onChange={this.updateSearch}
                                       style={{color: "blue"}}
                                />
                            </Col>
                            <Col xs={2}>
                                <br/>
                                <Button style={{visibility: this.state.filtered ? "visible" : "hidden"}}
                                        onClick={this.updateSearch}>
                                    X
                                </Button>
                            </Col>
                        </Row>}
                </ListGroupItem>
                {connErr ? loading() : (
                    <div>
                        <ListGroup>
                            {this.renderUsers(this.state.usersToRender)}
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
