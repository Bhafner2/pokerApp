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
import { saveUsers } from '../redux/actions';
import { store } from '../redux/store';
import UserList from "./UserList";

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
        this.updatePotAmount = this.updatePotAmount.bind(this);
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

    updatePotAmount(amount) {
        const data = this.props.data;
        if (amount === '' || amount < 0 || isNaN(amount)) {
            data.config.potAmount = 0;
        } else {
            data.config.potAmount = amount;
        }
        store.dispatch(saveUsers(data));
    }

    updateBountyAmount(amount) {
        const data = this.props.data;
        if (amount === '' || amount < 0 || isNaN(amount)) {
            data.config.bountyAmount = 0;
        } else {
            data.config.bountyAmount = amount;
        }
        store.dispatch(saveUsers(data));
    }

    render() {
        const { bountyAmount  } = this.props.data.config || 5;
        const { potAmount } = this.props.data.config || 20;
        return (
            <div>
                <FontAwesomeIcon id={"hamburger"} icon={faBars} onClick={this.toggleMenu} />
                <Collapse isOpen={this.state.showMenu} id={"menu"}>
                    <Card outline id={"menu"}>
                        <CardBody style={{ padding: "0 40px 0 40px" }}>
                            <Row className="menuItem">
                                <Col xs={12}>
                                   <b>Menu</b>
                                </Col>
                            </Row>
                            {UserList.isAdmin() ? 
                                <span>
                                    <Row className="menuItem">
                                    <Col xs={4} style={{paddingLeft: "0px", paddingRight: "0px", paddingTop: "0.2em"}}>
                                        BuyIn:
                                    </Col>
                                    <Col xs={8}>
                                            <InputGroup>
                                                <Button disabled={ potAmount < 1 } onClick={() => this.updatePotAmount(potAmount - 1)} color="danger">
                                                    -
                                                </Button>
                                                <Input
                                                    type="number" name="potAmount" id="potAmount"
                                                    onChange={this.updatePotAmount}
                                                    value={potAmount}
                                                />
                                                <Button onClick={() => this.updatePotAmount( potAmount + 1)} color="success">
                                                    +
                                                </Button>
                                            </InputGroup>
                                        </Col>
                                    </Row>
                                    <Row className="menuItem">
                                        <Col xs={4} style={{paddingLeft: "0px", paddingRight: "0px", paddingTop: "0.2em"}}>
                                            Bounty:
                                        </Col>
                                        <Col xs={8}>
                                            <InputGroup>
                                                <Button disabled={ bountyAmount < 1 } onClick={() => this.updateBountyAmount(bountyAmount - 1)} color="danger">
                                                    -
                                                </Button>
                                                <Input
                                                    type="number" name="bountyAmount" id="bountyAmount"
                                                    onChange={this.updateBountyAmount}
                                                    value={bountyAmount}
                                                />
                                                <Button onClick={() => this.updateBountyAmount( bountyAmount + 1)} color="success">
                                                    +
                                                </Button>
                                            </InputGroup>
                                        </Col>
                                    </Row>                            
                                </span>
                            :
                                <span></span>
                            }
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
                                    <Button onClick={logout} color={"link"} >
                                        Logout
                                    </Button>
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
