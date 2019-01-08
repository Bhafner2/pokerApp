import React from 'react';
import {
    Button,
    Col,
    FormFeedback,
    Input,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row
} from 'reactstrap';
import 'react-infinite-calendar/styles.css';
import {connect} from "react-redux";
import * as _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalculator } from '@fortawesome/free-solid-svg-icons';

class Calc extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            amountOk: false,
            onOpen: true,
            amount: 0,
            p1: 0,
            p2: 0,
            p3: 0,
            p4: 0,
        };

        this.toggle = this.toggle.bind(this);

        this.checkResults = this.checkResults.bind(this);
        this.updateAmount = this.updateAmount.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.roundResults = this.roundResults.bind(this);
        this.preventFailture = this.preventFailture.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal,
            onOpen: true,
            amountOk: false,
        });
        this.setState({
            amount: 0,
            p1: 0,
            p2: 0,
            p3: 0,
            p4: 0,
        });
    }

    calculate() {
        const factor = 100;
        const amount = this.state.amount / 10;
        if (this.state.amount < 1 || !this.state.amountOk) {
            this.setState({
                p1: 0,
                p2: 0,
                p3: 0,
                p4: 0,
            });
        } else if (this.state.amount < 40) {
            this.setState({
                p1: amount,
                p2: 0,
                p3: 0,
                p4: 0,
            }, () => {
                this.preventFailture()
            });
        } else if (this.state.amount < 100) {
            this.setState({
                p1: Math.round(amount * 70 / factor),
                p2: Math.round(amount * 30 / factor),
                p3: 0,
                p4: 0,
            }, () => {
                this.preventFailture()
            });
        } else if (this.state.amount < 200) {
            this.setState({
                p1: Math.round(amount * 60 / factor),
                p2: Math.round(amount * 30 / factor),
                p3: Math.round(amount * 10 / factor),
                p4: 0,
            }, () => {
                this.preventFailture()
            });
        } else {
            this.setState({
                p1: Math.round(amount * 55 / factor),
                p2: Math.round(amount * 27 / factor),
                p3: Math.round(amount * 13 / factor),
                p4: Math.round(amount * 5 / factor),

            }, () => {
                this.preventFailture()
            });
        }
    }

    preventFailture() {
        if (this.state.amount === 150) {
            this.setState({
                p2: this.state.p2 - 1,
            }, () => {
                this.roundResults();
            });
        } else {
            this.roundResults();
        }
    }

    roundResults() {
        const amount = this.state.amount / 10;
        console.log("p1 ", this.state.p1);
        console.log("p2 ", this.state.p2);
        console.log("p3 ", this.state.p3);
        console.log("p4 ", this.state.p4);
        if (
            (this.state.p1 +
                this.state.p2 +
                this.state.p3 +
                this.state.p4)
            < amount
        ) {
            this.setState({
                p1: this.state.p1 + 1,
            }, () => {
                this.checkResults();
            });
        } else if (
            (this.state.p1 +
                this.state.p2 +
                this.state.p3 +
                this.state.p4)
            > amount
        ) {
            this.setState({
                p1: this.state.p1 - 1,
            }, () => {
                this.checkResults();
            });
        } else {
            this.checkResults();
        }
    }

    checkResults() {
        this.setState({
            p1: this.state.p1 * 10,
            p2: this.state.p2 * 10,
            p3: this.state.p3 * 10,
            p4: this.state.p4 * 10,
        }, () => {
            if ((this.state.p1 +
                this.state.p2 +
                this.state.p3 +
                this.state.p4)
                !== this.state.amount) {
            }
        });
    }

    updateAmount(evt) {
        if (evt.target.value === '' || isNaN(evt.target.value)) {
            this.setState({
                onOpen: false,
                amount: 0,
                amountOk: false,
            }, () => {
                this.calculate()
            });
        } else {
            this.setState({
                onOpen: false,
                amount: _.parseInt(evt.target.value, 10)
            }, () => {
                if ((this.state.amount % 10) === 0 && this.state.amount !== 0) {
                    this.setState({
                        amountOk: true,
                    }, () => {
                        this.calculate()
                    });
                } else {
                    this.setState({
                        amountOk: false,
                    }, () => {
                        this.calculate()
                    });
                }
            });
        }
    }

    handleKeyPress(target) {
        console.log("key pressed");
        if (target.charCode === 13) {
            console.log("enter pressed");
        } else if (target.charCode === 27) {
            console.log("esc pressed");
            this.toggle()
        }
    }

    render() {
        return (<div>
            <FontAwesomeIcon icon={faCalculator} onClick={this.toggle} size="lg"/>

                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}
                       onKeyPress={this.handleKeyPress}
                >
                    <ModalHeader toggle={this.toggle}>Calculator</ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col xs="4">
                                <div>Amount</div>
                            </Col>
                            <Col xs="8">
                                <Input autoFocus
                                       type="number" name="amount" id="amount"
                                       onChange={this.updateAmount}
                                       value={this.state.amount}
                                       valid={this.state.amountOk}
                                       invalid={!this.state.amountOk && !this.state.onOpen}

                                />
                                <FormFeedback invalid>Must be a divisor of 10</FormFeedback>
                            </Col>
                        </Row>
                        <br/>
                        <Row>
                            <Col xs="4"/>
                            <Col xs="8">
                                <Row>
                                    <Col xs="4">
                                        <div>1st</div>
                                    </Col>
                                    <Col xs="8">
                                        <div>{this.state.p1}</div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs="4">
                                        <div>2nd</div>
                                    </Col>
                                    <Col xs="8">
                                        <div>{this.state.p2}</div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs="4">
                                        <div>3rd</div>
                                    </Col>
                                    <Col xs="8">
                                        <div>{this.state.p3}</div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs="4">
                                        <div>4th</div>
                                    </Col>
                                    <Col xs="8">
                                        <div>{this.state.p4}</div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggle}>Exit</Button>
                    </ModalFooter>
                </Modal>
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
)(Calc);