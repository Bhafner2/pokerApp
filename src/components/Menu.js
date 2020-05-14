import React, { Component } from 'react';
import {
    Col,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    InputGroupButtonDropdown,
    Input,
    InputGroup,
    CardBody,
    Row,
    Button,
    Card,
    Collapse,
    InputGroupText,
} from 'reactstrap';
import 'react-infinite-calendar/styles.css';
import * as _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faSortAmountDown,
    faCalendar,
    faTrash,
    faBars,
} from '@fortawesome/free-solid-svg-icons'
import { connect } from 'react-redux'
import moment from "moment/moment";
import { isToday, logout, AppVersion } from '../App';

class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showAlert: false,
            alertText: '',
            alertSuccess: false,
            showDate: false,
            showSearch: false,
            usersToRender: {},
            filtered: false,
            dropdownOpen: false,
            date: moment().subtract(4, 'hours').format('YYYY-MM-DD'),
            search: '',
        };

        this.updateDate = this.updateDate.bind(this);
        this.resetDate = this.resetDate.bind(this);
        this.updateSearch = this.updateSearch.bind(this);
        this.toggleMenu = this.toggleMenu.bind(this);
        this.toggleDate = this.toggleDate.bind(this);
        this.toggleSearch = this.toggleSearch.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.resetSearch = this.resetSearch.bind(this);
        this.toggleDropdown = this.toggleDropdown.bind(this);
    }

    componentDidMount() {
        this.props.date(this.state.date);
    }

    updateDate(evt) {
        this.props.date(evt.target.value);
        this.setState({
            date: evt.target.value,
        });
    }

    resetDate() {
        this.props.date(moment().format('YYYY-MM-DD'));
        this.setState({
            date: moment().format('YYYY-MM-DD'),
        });
    }

    updateSearch(evt) {
        if (_.isNil(evt) || _.isNil(evt.target.value) || evt.target.value === '') {
            this.setState({
                search: ''
            });
            this.props.search('');
        } else {
            this.setState({
                search: evt.target.value,
            });
            this.props.search(evt.target.value);
        }
    }

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
            <div>
                <FontAwesomeIcon id={"hamburger"} icon={faBars} onClick={this.toggleMenu} />
                <Collapse isOpen={this.state.showDate} id={"menu"}>
                    <Card outline id={"menu"}>
                        <CardBody style={{ padding: "0 40px 0 40px" }}>
                            <Row className="menuItem">
                                <Col xs={12} style={{ fontSize: "0.5em" }}>
                                    App Version: {AppVersion}
                                </Col>
                            </Row>
                            <Row className="menuItem">
                                <Col xs={12}>
                                    <Button onClick={logout} color={"link"} >
                                        Logout
                                    </Button>
                                </Col>
                            </Row>
                            <Row className="menuItem">
                                <Col xs={12}>
                                    <InputGroup>
                                        <Input type="date" name="date" id="date"
                                            value={this.state.date}
                                            onChange={this.updateDate}
                                            style={{ color: isToday(this.state.date) }}
                                        />
                                        <InputGroupText addonType="apend">
                                            <FontAwesomeIcon
                                                style={{ color: isToday(this.state.date) }}
                                                icon={faCalendar}
                                                onClick={this.resetDate}
                                            />
                                        </InputGroupText>
                                    </InputGroup>
                                </Col>
                            </Row>
                            <Row className="menuItem">
                                <Col xs={12}>
                                    <InputGroup style={{ paddingTop: "12px" }}>
                                        <InputGroupButtonDropdown addonType="append" isOpen={this.statedropdownOpen} toggle={this.toggleDropDown}>
                                            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
                                                <DropdownToggle caret style={{ border: " 1px solid", borderColor: "#CDD4DA", backgroundColor: "#E8ECEF", color: "#007BFF" }}>
                                                    <FontAwesomeIcon icon={faSortAmountDown} />
                                                </DropdownToggle>
                                                <DropdownMenu>
                                                    <DropdownItem
                                                        onClick={() => this.props.attributeToSort("gamesPlayed")}
                                                    >
                                                        Played
                                            </DropdownItem>
                                                    <DropdownItem
                                                        onClick={() => this.props.attributeToSort("name")}
                                                    >
                                                        Name
                                            </DropdownItem>
                                                    <DropdownItem
                                                        onClick={() => this.props.attributeToSort("")}
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
                                        <InputGroupText addonType="apend">
                                            <FontAwesomeIcon
                                                style={{ color: this.state.search === '' ? "black" : "007BFF" }}
                                                icon={faTrash}
                                                onClick={this.resetSearch}
                                            />
                                        </InputGroupText>
                                    </InputGroup>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Collapse>
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
)(Menu);
