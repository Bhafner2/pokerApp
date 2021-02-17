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
import { POT_AMOUNT } from '../App';

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
            p15: 0,
            p21: 0,
            p22: 0,
            p23: 0,
            p24: 0,
            p25: 0,
        };

        this.toggle = this.toggle.bind(this);

        this.updateAmount = this.updateAmount.bind(this);
        this.updatePayout = this.updatePayout.bind(this);
        this.sendToDb = this.sendToDb.bind(this);
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
        const { amount, payout } = this.props.data.lastGame;
        if (amount < 10 || amount % 10 !== 0) {
            this.setState({
                p11: 0,
                p12: 0,
                p13: 0,
                p14: 0,
                p15: 0,
                p21: 0,
                p22: 0,
                p23: 0,
                p24: 0,
                p25: 0,
            });
        } else if (payout === 1) {
            this.setState({
                p11: amount,
                p12: 0,
                p13: 0,
                p14: 0,
                p15: 0,
                p21: amount,
                p22: 0,
                p23: 0,
                p24: 0,
                p25: 0,
            }, () => {
                this.roundResults()
            });
        } else if (payout === 2) {
            this.setState({
                p11: Math.round(amount * 70 / factor) * 10,
                p12: Math.round(amount * 30 / factor) * 10,
                p13: 0,
                p14: 0,
                p15: 0,
                p21: Math.round(amount * 65 / factor) * 10,
                p22: Math.round(amount * 35 / factor) * 10,
                p23: 0,
                p24: 0,
                p25: 0,
            }, () => {
                this.roundResults()
            });
        } else if (payout === 3) {
            this.setState({
                p11: Math.round(amount * 55 / factor) * 10,
                p12: Math.round(amount * 33 / factor) * 10,
                p13: Math.round(amount * 12 / factor) * 10,
                p14: 0,
                p15: 0,
                p21: Math.round(amount * 48 / factor) * 10,
                p22: Math.round(amount * 34 / factor) * 10,
                p23: Math.round(amount * 18 / factor) * 10,
                p24: 0,
                p25: 0,
            }, () => {
                this.roundResults()
            });
        }  else if (payout === 4) {
            this.setState({
                p11: Math.round(amount * 55 / factor) * 10,
                p12: Math.round(amount * 27 / factor) * 10,
                p13: Math.round(amount * 13 / factor) * 10,
                p14: Math.round(amount * 5 / factor) * 10,
                p15: 0,
                p21: Math.round(amount * 45 / factor) * 10,
                p22: Math.round(amount * 32 / factor) * 10,
                p23: Math.round(amount * 16 / factor) * 10,
                p24: Math.round(amount * 7 / factor) * 10,
                p25: 0,
            }, () => {
                this.roundResults()
            });
        } else {
            this.setState({
                p11: Math.round(amount * 50 / factor) * 10,
                p12: Math.round(amount * 25 / factor) * 10,
                p13: Math.round(amount * 13 / factor) * 10,
                p14: Math.round(amount * 8 / factor) * 10,
                p15: Math.round(amount * 4 / factor) * 10,

                p21: Math.round(amount * 37 / factor) * 10,
                p22: Math.round(amount * 28 / factor) * 10,
                p23: Math.round(amount * 18 / factor) * 10,
                p24: Math.round(amount * 11 / factor) * 10,
                p25: Math.round(amount * 6 / factor) * 10,
            }, () => {
                this.roundResults()
            });
        }
    }

    roundResults() {
        const { amount } = this.props.data.lastGame;
        let { p11, p21 } = this.state;
        let sum1 = this.state.p11 + this.state.p12 + this.state.p13 + this.state.p14 + this.state.p15;
        let sum2 = this.state.p21 + this.state.p22 + this.state.p23 + this.state.p24 + this.state.p25;
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
        if (evt.target.value === '' || evt.target.value < 0 || isNaN(evt.target.value)) {
            this.sendToDb(0, data.lastGame.payout);
        } else {
            const amount = _.parseInt(evt.target.value, 10);
            this.sendToDb(amount, data.lastGame.payout);
        }
    }

    updatePayout(evt) {
        const data = this.props.data;
        if (evt.target.value === '' || evt.target.value < 0 || isNaN(evt.target.value)) {
            this.sendToDb(data.lastGame.amount, 0);
        } else {
            const payout = _.parseInt(evt.target.value, 10);
            this.sendToDb(data.lastGame.amount, payout);
        }
    }

    sendToDb(amount, payout, date = moment().format()){
        const data = this.props.data;

        data.lastGame.amount = amount;
        data.lastGame.date = date
        data.lastGame.payout = payout;
        store.dispatch(saveUsers(data));

        this.setState({
            onOpen: false,
        }, () => {
            this.calculate()
        });
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
        const { amount, payout } = this.props.data.lastGame;
        const invalid = (amount % 10) !== 0 && !this.state.onOpen;
        const invalidPayout = payout < 0 || payout > 5;

        return (<div>
            <FontAwesomeIcon icon={faPeopleArrows} onClick={this.toggle} style={{ fontSize: MENU_SIZE, color: "black" }} />
            <div style={{ fontSize: MENU_FONT, color: "black" }}>Payout</div>

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
                                            <Button disabled={ amount < 1 } onClick={() => this.updateAmount({ target: { value: amount - POT_AMOUNT } })} color="danger">
                                                -
                                            </Button>
                                            <Input autoFocus
                                                type="number" name="amount" id="amount"
                                                onChange={this.updateAmount}
                                                value={amount}
                                                invalid={invalid}
                                            />
                                            <Button onClick={() => this.updateAmount({ target: { value: amount + POT_AMOUNT } })} color="success">
                                                +
                                            </Button>
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
                        <Row>
                            <Col xs="4">
                                <b>Payout</b>
                            </Col>
                            <Col xs="8">
                                {UserList.isAdmin() ?
                                    <span>
                                        <InputGroup>
                                                <Button disabled={ payout < 2 } onClick={() => this.updatePayout({ target: { value: payout - 1 } })} color="danger">
                                                    -
                                                </Button>
                                                <Input
                                                    type="number" name="payout" id="payout"
                                                    onChange={this.updatePayout}
                                                    value={payout}
                                                    invalid={invalidPayout}
                                                />
                                                <Button disabled={ payout > 4 } onClick={() => this.updatePayout({ target: { value: payout + 1 } })} color="success">
                                                    +
                                                </Button>
                                            <InputGroupText addonType="apend">
                                                <FontAwesomeIcon
                                                    style={{ color: payout === 3 ? "black" : "007BFF" }}
                                                    icon={faTrash}
                                                    onClick={() => this.updatePayout({ target: { value: 3 } })}
                                                />
                                            </InputGroupText>
                                        </InputGroup>
                                        <div
                                            style={{ color: "red", fontSize: "0.8em", visibility: invalidPayout ? 'visible' : 'hidden' }}
                                        >
                                            Must be between 1 and 4
                                       </div>
                                    </span>
                                    : <b>{payout}</b>}
                            </Col>
                        </Row>
                        <br />
                        <Table size={"sm"}>
                            <thead>
                                <tr>
                                    <th>#</th>
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
                                <tr style={{visibility: payout > 1 ? 'visible' : 'hidden'}}>
                                    <th>2nd</th>
                                    <td>{this.state.p12}</td>
                                    <td>{this.state.p22}</td>
                                </tr>
                                <tr style={{visibility: payout > 2 ? 'visible' : 'hidden'}}>
                                    <th>3rd</th>
                                    <td>{this.state.p13}</td>
                                    <td>{this.state.p23}</td>
                                </tr>
                                <tr style={{visibility: payout > 3 ? 'visible' : 'hidden'}}>
                                    <th>4th</th>
                                    <td>{this.state.p14}</td>
                                    <td>{this.state.p24}</td>
                                </tr>
                                <tr style={{visibility: payout > 4 ? 'visible' : 'hidden'}}>
                                    <th>5th</th>
                                    <td>{this.state.p15}</td>
                                    <td>{this.state.p25}</td>
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