import React, { Component } from 'react';
import {
    Alert,
    Col,
    Collapse,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    InputGroupButtonDropdown,
    Input,
    InputGroup,
    InputGroupAddon,
    ListGroup,
    Nav,
    Navbar,
    NavbarBrand,
    Row,
    Button,
    InputGroupText
} from 'reactstrap';
import 'react-infinite-calendar/styles.css';
import AddUser from "./AddUser";
import { getUsers } from "../redux/actions";
import UserList from "./UserList";
import moment from "moment/moment";
import * as _ from 'lodash';
import { connect } from 'react-redux'
import { store } from '../redux/store'
import GeneralStatistic from "./GeneralStatistic";
import Calc from "./Calc";
import ThisGame from "./ThisGame";
import { showLoading } from "../App";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faSignOutAlt,
    faSortAmountDown,
    faBars,
    faCalendar,
    faSearch,
} from '@fortawesome/free-solid-svg-icons'
import Odds from "./Odds";
// import firebase from "../config/firebase";


const GAMES_PLAYED = "gamesPlayed";
export const MENU_SIZE = "lg";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showAlert: false,
            alertText: '',
            alertSuccess: false,
            today: '',
            date: '',
            search: '',
            showDate: false,
            showSearch: false,
            usersToRender: {},
            filtered: false,
            dropdownOpen: false,
            attributeToSort: GAMES_PLAYED,
        };

        this.updateDate = this.updateDate.bind(this);
        this.showSaved = this.showSaved.bind(this);
        this.isToday = this.isToday.bind(this);
        this.updateDate = this.updateDate.bind(this);
        this.updateSearch = this.updateSearch.bind(this);
        this.toggleMenu = this.toggleMenu.bind(this);
        this.toggleDate = this.toggleDate.bind(this);
        this.toggleSearch = this.toggleSearch.bind(this);
        this.filterUser = this.filterUser.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.resetSearch = this.resetSearch.bind(this);
        this.toggleDropdown = this.toggleDropdown.bind(this);
    }

    isToday() {
        if (this.state.date === '') {
            return 'red'
        }
        if (this.state.date !== this.state.today) {
            return '#007BFF'
        } else {
            return 'black'
        }
    }

    componentDidMount() {
        store.dispatch(getUsers());
        this.setState({
            today: moment().format('YYYY-MM-DD'),
            date: moment().subtract(4, 'hours').format('YYYY-MM-DD'),
            showDate: false,
            showSearch: false,
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

    updateDate(evt) {
        this.setState({
            date: evt.target.value,
        });
    }

    updateSearch(evt) {
        if (_.isNil(evt) || _.isNil(evt.target.value) || evt.target.value === '') {
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
                return _.includes(user.name.toLowerCase(), this.state.search.toLowerCase());
            });
        } else {
            return users;
        }
    }

    renderUsers() {
        const { users } = this.props.data;
        const { date, today, filtered } = this.state;

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
                <div>
                    No user found...
                </div>
            )
        }
        return (
            <div>
                {filteredUsers.map((user, i) =>
                    <UserList user={user} key={i} saved={this.showSaved} date={date} today={today} blue={filtered} />)}
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

    toggleDate() {
        this.setState({
            showDate: !this.state.showDate,
            showSearch: false,
        });
    }
    toggleMenu() {
        this.setState({
            showSearch: !this.state.showSearch,
            showDate: !this.state.showDate,
        });
    }

    toggleSearch() {
        this.setState({
            showSearch: !this.state.showSearch,
            showDate: false,
        });
    }

    resetSearch(evt) {
        this.updateSearch(evt);
    }

    toggleDropdown() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        })
    }

    render() {
        return (
            <div className="center" onKeyPress={this.handleKeyPress}>
                {/*{this.dbInit()}*/}
                <Navbar sticky="top"
                    style={{
                        backgroundColor: "whitesmoke",
                        borderTop: "0.5px solid",
                        borderBottom: "0.5px solid",
                        borderColor: "#DFDFDF",
                        justifyContent: 'space-between'
                    }}
                >
                    <NavbarBrand>
                        <GeneralStatistic today={this.state.date} />
                    </NavbarBrand>
                    <NavbarBrand>
                        <ThisGame today={this.state.date} />
                    </NavbarBrand>
                    <NavbarBrand>
                        <Calc />
                    </NavbarBrand>
                    <NavbarBrand>
                        <Odds />
                    </NavbarBrand>
                    <NavbarBrand>
                        <FontAwesomeIcon icon={faBars} onClick={this.toggleMenu} size={MENU_SIZE} />
                    </NavbarBrand>
                    <Collapse isOpen={this.state.showDate} navbar>
                        <Nav navbar style={{ color: this.isToday() }}>
                            <Row>
                                <Col xs={1} />
                                <Col xs={10}>
                                    <InputGroup style={{ paddingTop: "12px" }}>
                                        <InputGroupAddon addonType="prepend">
                                            <Button>
                                                <FontAwesomeIcon icon={faCalendar} />
                                            </Button>
                                        </InputGroupAddon>
                                        <Input type="date" name="date" id="date"
                                            value={this.state.date}
                                            onChange={this.updateDate}
                                            style={{ color: this.isToday() }}
                                        />
                                        <InputGroupAddon addonType="apend">
                                            <Button onClick={this.props.logout} >
                                                <FontAwesomeIcon icon={faSignOutAlt} />
                                            </Button>
                                        </InputGroupAddon>
                                    </InputGroup>
                                </Col>
                                <Col xs={1} />
                            </Row>
                        </Nav>
                    </Collapse>
                    <Collapse isOpen={this.state.showSearch} navbar>
                        <Nav navbar>
                            <Row>
                                <Col xs={1} />
                                <Col xs={10}>
                                    <InputGroup style={{ paddingTop: "12px" }}>
                                        <InputGroupButtonDropdown addonType="append" isOpen={this.statedropdownOpen} toggle={this.toggleDropDown}>
                                            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
                                                <DropdownToggle caret>
                                                    <FontAwesomeIcon icon={faSortAmountDown} />
                                                </DropdownToggle>
                                                <DropdownMenu>
                                                    <DropdownItem
                                                        onClick={() => this.setState({ attributeToSort: GAMES_PLAYED })}
                                                    >
                                                        Played
                                            </DropdownItem>
                                                    <DropdownItem
                                                        onClick={() => this.setState({ attributeToSort: "name" })}
                                                    >
                                                        Name
                                            </DropdownItem>
                                                    <DropdownItem
                                                        onClick={() => this.setState({ attributeToSort: "" })}
                                                    >
                                                        Create Date
                                            </DropdownItem>
                                                </DropdownMenu>
                                            </Dropdown>
                                        </InputGroupButtonDropdown>
                                        <Input type="text" name="search" id="search"
                                            value={this.state.search}
                                            onChange={this.updateSearch}
                                            style={{ color: "#007BFF" }}
                                            placeholder="Search.."
                                        />
                                        <InputGroupAddon addonType="prepend">
                                            <Button onClick={this.resetSearch}>
                                                X
                                            </Button>
                                        </InputGroupAddon>
                                    </InputGroup>
                                </Col>
                                <Col xs={1} />
                            </Row>
                        </Nav>
                    </Collapse>
                </Navbar>
                <div>
                    <ListGroup>
                        {this.renderUsers(this.state.usersToRender)}
                    </ListGroup>

                    <div style={{
                        paddingTop: '10px',
                        paddingBottom: '20px',
                    }}>
                        {UserList.isAdmin() ? <AddUser saved={this.showSaved} /> : <div />}
                    </div>
                </div>
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
