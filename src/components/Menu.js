import React, { Component } from 'react';
import {
    Col,
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faCalendar,
    faBars,
} from '@fortawesome/free-solid-svg-icons'
import { connect } from 'react-redux'
import moment from "moment/moment";
import { isToday, logout, AppVersion } from '../App';

class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showMenu: false,
            date: moment().subtract(4, 'hours').format('YYYY-MM-DD'),
        };

        this.updateDate = this.updateDate.bind(this);
        this.resetDate = this.resetDate.bind(this);
        this.toggleMenu = this.toggleMenu.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
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

    render() {
        return (
            <div>
                <FontAwesomeIcon id={"hamburger"} icon={faBars} onClick={this.toggleMenu} />
                <Collapse isOpen={this.state.showMenu} id={"menu"}>
                    <Card outline id={"menu"}>
                        <CardBody style={{ padding: "0 40px 0 40px" }}>
                            <Row className="menuItem">
                                <Col xs={12}>
                                    Menu
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
                                <Col xs={12} style={{ fontSize: "0.5em" }}>
                                    App Version: {AppVersion}
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Collapse>
                <div onClick={this.toggleMenu} className={this.state.showMenu ? "clickGround" : ""} />
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
