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
    Row,
    Collapse,
    InputGroupText,
} from 'reactstrap';
import 'react-infinite-calendar/styles.css';
import * as _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faTrash,
    faSearch,
    faSortAmountDownAlt,
} from '@fortawesome/free-solid-svg-icons'
import { connect } from 'react-redux'
import { MENU_SIZE, MENU_FONT } from './Home';

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showMenu: false,
            filtered: false,
            dropdownOpen: false,
            search: '',
        };

        this.updateSearch = this.updateSearch.bind(this);
        this.toggleMenu = this.toggleMenu.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.resetSearch = this.resetSearch.bind(this);
        this.toggleDropdown = this.toggleDropdown.bind(this);
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
                showMenu: false,
            });
        }
    }

    toggleMenu() {
        this.setState({
            showMenu: !this.state.showMenu,
        });
    }

    resetSearch(evt) {
        this.setState({
            showMenu: false,
        });
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
                <FontAwesomeIcon icon={faSearch} onClick={this.toggleMenu} style={{ fontSize: MENU_SIZE }} />
                <div style={{ fontSize: MENU_FONT }}>Search</div>
                <div>
                    <Collapse isOpen={this.state.showMenu} style={{
                        backgroundColor: "whitesmoke",
                        borderTop: "1px solid",
                        borderBottom: "0.5px solid",
                        borderColor: "lightgray",
                        padding: "0.3em 0.8em 0.3em 1.2em",
                        justifyContent: "space-between",
                        width: "100%",
                        height: "70px",
                        position: "fixed",
                        bottom: "65px",
                        left: "0px",
                    }}>
                        <Row>
                            <Col xs={12}>
                                <InputGroup style={{ paddingTop: "12px" }}>
                                    <InputGroupButtonDropdown addonType="append" isOpen={this.statedropdownOpen} toggle={this.toggleDropDown}>
                                        <Dropdown  direction="up" isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
                                            <DropdownToggle caret style={{ border: " 1px solid", borderColor: "#CDD4DA", backgroundColor: "#E8ECEF", color: "#007BFF" }}>
                                            <FontAwesomeIcon icon={faSortAmountDownAlt} />
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
                    </Collapse>
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
)(Search);
