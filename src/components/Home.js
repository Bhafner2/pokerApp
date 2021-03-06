import React, { Component } from 'react';
import {
    Alert,
    ListGroup,
    Navbar,
    NavbarBrand,
    Row,
} from 'reactstrap';
import 'react-infinite-calendar/styles.css';
import AddUser from "./AddUser";
import { getUsers } from "../redux/actions";
import UserList from "./UserList";
import * as _ from 'lodash';
import { connect } from 'react-redux'
import { store } from '../redux/store'
import GeneralStatistic from "./GeneralStatistic";
import Calc from "./Calc";
import ThisGame from "./ThisGame";
import { showLoading } from "../App";
import Odds from "./Odds";
import Menu from "./Menu";
import Search from './Search';

// import firebase from "../config/firebase";

const GAMES_PLAYED = "gamesPlayed";
export const MENU_SIZE = "1.2em";
export const MENU_FONT = "0.6em";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showAlert: false,
            alertText: '',
            alertSuccess: false,
            date: '',
            search: '',
            usersToRender: {},
            attributeToSort: GAMES_PLAYED,
        };
        this.showSaved = this.showSaved.bind(this);
        this.filterUser = this.filterUser.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.doesBuyoutMatch = this.doesBuyoutMatch.bind(this);
    }

    componentDidMount() {
        store.dispatch(getUsers());
        this.setState({
            usersToRender: this.props.data.users,
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

    filterUser(users) {
        if (!_.isNil(this.state.search) || this.state.search === '') {
            return _.filter(users, (user) => {
                return _.includes(user.name.toLowerCase(), this.state.search.toLowerCase());
            });
        } else {
            return users;
        }
    }

    renderUsers() {
        const { users } = this.props.data;
        const { date } = this.state;

        if (_.isNil(users) || _.isNil(users[0])) {
            return (
                showLoading()
            )
        }
        let filteredUsers = this.filterUser(users);

        filteredUsers = _.sortBy(filteredUsers, (user) => {
            if (this.state.attributeToSort === GAMES_PLAYED) {
                return -user[this.state.attributeToSort]
            } else {
                return user[this.state.attributeToSort]
            }
        });

        if (_.isNil(filteredUsers[0])) {
            return (
                <div className="center"><b>No user found ...</b><br />change the search or add a user</div>
            )
        }
        return (
            <div>
                {filteredUsers.map((user, i) =>
                    <UserList user={user} key={i} saved={this.showSaved} date={date} blue={this.state.search !== ''} />)}
            </div>
        );
    };

    /*
        dbInit() {
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

    handleKeyPress(target) {
        if (target.charCode === 13) {
            this.setState({
                showDate: false,
                showSearch: false,
            });
        }
    }

    doesBuyoutMatch() {
        if (this.props.data.games === undefined) {
            console.log("doesBuyoutMatch", this.props.data.games);
            return false;
        } else {
            console.log("doesBuyoutMatch2", this.props.data.games);
            const game = this.props.data.games[0]
            return game.buyIn - game.won - game.bounty === 0;
        }
    }

    render() {
        return (
            <div className="center" onKeyPress={this.handleKeyPress}>
                {/*{this.dbInit()}*/}
                <Menu id={"menu"}
                    date={(date) => this.setState({ date })}
                />
                <div className={"contend"}>
                    <ListGroup>
                        {this.renderUsers(this.state.usersToRender)}
                    </ListGroup>
                    <div >
                        {UserList.isAdmin() ?
                            <div style={{
                                paddingTop: '10px',
                                paddingBottom: '10px',
                            }}>
                                <AddUser saved={this.showSaved} />
                            </div>
                            : <div />}
                    </div>
                </div>
                <Row>
                    <Alert color={this.state.alertSuccess ? "success" : "danger"}
                        className={alert}
                        style={{
                            visibility: this.state.showAlert ? 'visible' : 'hidden',
                            position: "fixed",
                        }}>
                        {this.state.alertText}
                    </Alert>
                </Row>
                <Navbar id={"nav"}>
                    <NavbarBrand>
                        <GeneralStatistic today={this.state.date} />
                    </NavbarBrand>
                    <NavbarBrand>
                        <ThisGame today={this.state.date} isRed={!this.doesBuyoutMatch()} />
                    </NavbarBrand>
                    <NavbarBrand>
                        <Calc />
                    </NavbarBrand>
                    <NavbarBrand>
                        <Odds />
                    </NavbarBrand>
                    <NavbarBrand>
                        <Search
                            attributeToSort={(attributeToSort) => this.setState({ attributeToSort })}
                            search={(search) => this.setState({ search })}
                        />
                    </NavbarBrand>
                </Navbar>
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
