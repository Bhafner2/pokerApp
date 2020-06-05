import React from 'react';
import {
    Button,
    Col,
    Input,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row,
    Table,
    InputGroup,
    InputGroupText,
} from 'reactstrap';
import 'react-infinite-calendar/styles.css';
import { connect } from "react-redux";
import * as _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPeopleArrows } from '@fortawesome/free-solid-svg-icons';
import { MENU_SIZE, MENU_FONT } from './Home'
import { saveUsers } from '../redux/actions';
import { store } from '../redux/store';
import moment from 'moment';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import UserList from "./UserList";

const lastDay = moment().subtract(28, 'h').format();

class Calc extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            onOpen: true,
            p11: 0,
            p12: 0,
            p13: 0,
            p14: 0,
            p21: 0,
            p22: 0,
            p23: 0,
            p24: 0,
        };

        this.toggle = this.toggle.bind(this);

        this.updateAmount = this.updateAmount.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.roundResults = this.roundResults.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.data.lastGame.amount !== this.props.data.lastGame.amount) {
            this.calculate();
        }
    }

    toggle() {
        if (!this.state.modal) {
            this.setState({
                modal: true,
            }, () => {
                this.calculate();
            });
        } else {
            this.setState({
                modal: false,
            });
        }
    }

    calculate() {
        const factor = 1000;
        const { amount } = this.props.data.lastGame;
        if (amount < 10 || amount % 10 !== 0) {
            this.setState({
                p11: 0,
                p12: 0,
                p13: 0,
                p14: 0,
                p21: 0,
                p22: 0,
                p23: 0,
                p24: 0,
            });
        } else if (amount < 40) {
            this.setState({
                p11: amount,
                p12: 0,
                p13: 0,
                p14: 0,
                p21: amount,
                p22: 0,
                p23: 0,
                p24: 0,
            }, () => {
                this.roundResults()
            });
        } else if (amount < 100) {
            this.setState({
                p11: Math.round(amount * 70 / factor) * 10,
                p12: Math.round(amount * 30 / factor) * 10,
                p13: 0,
                p14: 0,
                p21: Math.round(amount * 65 / factor) * 10,
                p22: Math.round(amount * 35 / factor) * 10,
                p23: 0,
                p24: 0,
            }, () => {
                this.roundResults()
            });
        } else if (amount < 200) {
            this.setState({
                p11: Math.round(amount * 55 / factor) * 10,
                p12: Math.round(amount * 33 / factor) * 10,
                p13: Math.round(amount * 12 / factor) * 10,
                p14: 0,
                p21: Math.round(amount * 48 / factor) * 10,
                p22: Math.round(amount * 32 / factor) * 10,
                p23: Math.round(amount * 20 / factor) * 10,
                p24: 0,
            }, () => {
                this.roundResults()
            });
        } else {
            this.setState({
                p11: Math.round(amount * 55 / factor) * 10,
                p12: Math.round(amount * 27 / factor) * 10,
                p13: Math.round(amount * 13 / factor) * 10,
                p14: Math.round(amount * 5 / factor) * 10,
                p21: Math.round(amount * 45 / factor) * 10,
                p22: Math.round(amount * 32 / factor) * 10,
                p23: Math.round(amount * 16 / factor) * 10,
                p24: Math.round(amount * 7 / factor) * 10,
            }, () => {
                this.roundResults()
            });
        }
    }

    roundResults() {
        const { amount } = this.props.data.lastGame;
        let { p11, p21 } = this.state;
        let sum1 = this.state.p11 + this.state.p12 + this.state.p13 + this.state.p14;
        let sum2 = this.state.p21 + this.state.p22 + this.state.p23 + this.state.p24;
        let sum1ok = false;
        let sum2ok = false;

        if (amount % 10 === 0) {
            console.log("sums: amount, 1, 2", amount, sum1, sum2);

            if (sum1 < amount) {
                p11 += 10;
                console.log("v1 player1 +10");
            } else if (sum1 > amount) {
                p11 -= 10;
                console.log("v1 player1 -10");
            } else {
                sum1ok = true;
            }
            if (sum2 < amount) {
                p21 += 10;
                console.log("v2 player1 +10");
            } else if (sum2 > amount) {
                p21 -= 10;
                console.log("v2 player1 -10");
            } else {
                sum2ok = true;
            }

            this.setState({
                p11,
                p21,
            }, () => {
                if (!sum1ok || !sum2ok) {
                    this.roundResults();
                }
            });
        }
    }

    updateAmount(evt) {
        const data = this.props.data;
        if (evt.target.value === '' || isNaN(evt.target.value)) {
            data.lastGame.amount = 0;
            data.lastGame.date = moment().format();
            store.dispatch(saveUsers(data));

            this.setState({
                onOpen: false,
            }, () => {
                this.calculate()
            });
        } else {
            const amount = _.parseInt(evt.target.value, 10);
            data.lastGame.amount = amount;
            data.lastGame.date = moment().format();
            store.dispatch(saveUsers(data));

            this.setState({
                onOpen: false,
            }, () => {
                this.calculate()
            });
        }
    }

    handleKeyPress(target) {
        if (target.charCode === 13) {
            console.log("enter pressed");
        } else if (target.charCode === 27) {
            console.log("esc pressed");
            this.toggle()
        }
    }

    render() {
        const { amount } = this.props.data.lastGame;
        const invalid = (amount % 10) !== 0 && !this.state.onOpen;

        return (<div>
            <FontAwesomeIcon icon={faPeopleArrows} onClick={this.toggle} style={{ fontSize: MENU_SIZE }} />
            <div style={{ fontSize: MENU_FONT }}>Payout</div>

            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}
                onKeyPress={this.handleKeyPress}
            >
                <ModalHeader toggle={this.toggle}>Payout</ModalHeader>
                <ModalBody>
                    <div style={{ padding: "10px" }}>
                        <Row>
                            <Col xs="4">
                                <b>Pot size</b>
                            </Col>
                            <Col xs="8">
                                {UserList.isAdmin() ?
                                    <span>
                                        <InputGroup>
                                            <Input autoFocus
                                                type="number" name="amount" id="amount"
                                                onChange={this.updateAmount}
                                                value={amount}
                                                invalid={invalid}
                                            />
                                            <InputGroupText addonType="apend">
                                                <FontAwesomeIcon
                                                    style={{ color: amount === 0 ? "black" : "007BFF" }}
                                                    icon={faTrash}
                                                    onClick={() => this.updateAmount({ target: { value: 0 } })}
                                                />
                                            </InputGroupText>
                                        </InputGroup>
                                        <div
                                            style={{ color: "red", fontSize: "0.8em", visibility: invalid ? 'visible' : 'hidden' }}
                                        >
                                            Must be a divisor of 10
                                        </div>
                                    </span>
                                    : <b>{amount}</b>}
                            </Col>
                        </Row>
                        <br />
                        <Table size={"sm"} borderless style={{ paddingTop: "12px" }}>
                            <thead>
                                <tr>
                                    <th />
                                    <th>v1</th>
                                    <th>v2</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>1st</th>
                                    <td>{this.state.p11}</td>
                                    <td>{this.state.p21}</td>
                                </tr>
                                <tr>
                                    <th>2nd</th>
                                    <td>{this.state.p12}</td>
                                    <td>{this.state.p22}</td>
                                </tr>
                                <tr>
                                    <th>3rd</th>
                                    <td>{this.state.p13}</td>
                                    <td>{this.state.p23}</td>
                                </tr>
                                <tr>
                                    <th>4th</th>
                                    <td>{this.state.p14}</td>
                                    <td>{this.state.p24}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={this.toggle}>Exit</Button>
                </ModalFooter>
            </Modal>
        </div >
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
)(Calc);