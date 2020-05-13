import React, { Component } from 'react';
import {
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
    Nav,
    Row,
    Button,
} from 'reactstrap';
import 'react-infinite-calendar/styles.css';
import * as _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faSignOutAlt,
    faSortAmountDown,
    faEllipsisV,
    faCalendar,
    faTrash,
} from '@fortawesome/free-solid-svg-icons'
import { connect } from 'react-redux'
import moment from "moment/moment";
import { isToday, logout } from '../App';

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
        };

        this.updateDate = this.updateDate.bind(this);
        this.updateDate = this.updateDate.bind(this);
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

    updateSearch(evt) {
        if (_.isNil(evt) || _.isNil(evt.target.value) || evt.target.value === '') {
            this.setState({
                filtered: false,
            });
            this.props.search('');
        } else {
            this.setState({
                filtered: true,
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
                <FontAwesomeIcon id={"menu"} icon={faEllipsisV} onClick={this.toggleMenu} />
                <Collapse isOpen={this.state.showDate} navbar>
                    <Nav navbar style={{ color: isToday(this.props.date) }}>
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
                                        style={{ color: isToday(this.state.date) }}
                                    />
                                    <InputGroupAddon addonType="apend">
                                        <Button onClick={logout} >
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
                                    <InputGroupAddon addonType="prepend">
                                        <Button onClick={this.resetSearch}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </Button>
                                    </InputGroupAddon>
                                </InputGroup>
                            </Col>
                            <Col xs={1} />
                        </Row>
                    </Nav>
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
