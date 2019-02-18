import {CardGroup, OddsCalculator} from 'poker-odds-calculator';
import React from 'react';
import {connect} from "react-redux";
import {
    Button,
    Col,
    Input,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row
} from "reactstrap";
import * as _ from 'lodash';
import {showLoading} from "../App";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBalanceScale} from "@fortawesome/free-solid-svg-icons/index";

class Odds extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            p1: '',
            p2: '',
            p3: '',
            p4: '',
            b: '',
            result: '',
            loading: false,
            error: false,
        };
        this.toggle = this.toggle.bind(this);
        this.calcOdds = this.calcOdds.bind(this);
        this.getOdds = this.getOdds.bind(this);
        this.showResult = this.showResult.bind(this);

        /*
                https://www.npmjs.com/package/poker-odds-calculator
        */
    }

    toggle() {
        this.setState({
            modal: !this.state.modal,
            loading: false,
            error: false,
            p1: '',
            p2: '',
            p3: '',
            p4: '',
            b: '',
            result: '',
        });
    }

    handleKeyPress(target) {
        if (target.charCode === 13 && !this.state.loading) {
            console.log("enter pressed");
            this.getOdds()
        } else if (target.charCode === 27) {
            console.log("esc pressed");
            this.toggle()
        }
    }

    getOdds() {
        this.setState({
            loading: true,
        });

        setTimeout(() => {
            this.calcOdds();
        }, 100)
    }

    async calcOdds() {
        if (this.state.loading) {
            let error;
            try {
                let {p1, p2, p3, p4, b} = this.state;
                let player1Cards;
                let player2Cards;
                let board;

                if (!_.isNil(p1)) {
                    try {
                        player1Cards = CardGroup.fromString(p1.toString());
                    } catch (e) {
                    }
                }
                if (!_.isNil(p2)) {
                    try {
                        player2Cards = CardGroup.fromString(p2.toString());
                    } catch (e) {
                    }
                }
                if (!_.isNil(b)) {
                    try {
                        board = CardGroup.fromString(b.toString());
                    } catch (e) {
                    }
                }


                // JhJs
                // JdQd
                // 7d9dTs


                const result = await OddsCalculator.calculate([player1Cards, player2Cards], board);

                this.setState({result});
                console.log(`Player #1 - ${player1Cards} - ${result.equities[0].getEquity()}%`);
                console.log(`Player #2 - ${player2Cards} - ${result.equities[1].getEquity()}%`);
                error = false
            } catch (e) {
                console.log(e);
                error = true
            }

            this.setState({
                loading: false,
                error,
            });
        }
    }

    showResult() {
        let {p1, p2, p3, p4, b, loading, result, error} = this.state;

        console.log('loading', loading);

        if (loading) {
            return showLoading()
        }
        if (error) {
            return <div style={{color: "red"}}>check Notation</div>
        }
        if (_.isNil(result.equities)) {
            return <div/>
        }
        return (
            <div>
                <Row>
                    <Col xs="4">
                        <div style={{display: 'inline-block'}}>Player 1</div>
                    </Col>
                    <Col xs="4">
                        Win: {result.equities[0].getEquity()}%
                    </Col>
                    <Col xs="4">
                        Tie: {result.equities[0].getTiePercentage()}%
                    </Col>
                </Row>
                <Row>
                    <Col xs="4">
                        <div style={{display: 'inline-block'}}>Player 2</div>
                    </Col>
                    <Col xs="4">
                        Win: {result.equities[1].getEquity()}%
                    </Col>
                    <Col xs="4">
                        Tie: {result.equities[1].getTiePercentage()}%
                    </Col>
                </Row>
            </div>)
    }

    render() {
        let {p1, p2, p3, p4, b, loading} = this.state;

        return (
            <div>
                <FontAwesomeIcon icon={faBalanceScale} onClick={this.toggle} size="lg"/>

                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}
                       onKeyPress={() => this.handleKeyPress}>
                    <ModalHeader toggle={this.toggle}>Odds Calculator</ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col>
                                <b>Notation: <br/></b>
                                h = <span style={{color: "#DC3545"}}>♥</span> heart<br/>
                                s = ♠ spades<br/>
                                d = <span style={{color: "#DC3545"}}>♦</span> diamonds<br/>
                                c = ♣ clubs<br/>
                                2-9, T, J, Q, K, A<br/>
                                Write without spaces, e.g. AhTd <br/>
                            </Col>
                        </Row>
                        <br/>
                        <Row>
                            <Col xs="4">
                                <div style={{display: 'inline-block'}}>Player 1</div>
                            </Col>
                            <Col xs="8">
                                <Input type="text" name="p1" id="p1"
                                       onChange={p => this.setState({p1: p.target.value})}
                                       value={p1}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="4">
                                <div style={{display: 'inline-block'}}>Player 2</div>
                            </Col>
                            <Col xs="8">
                                <Input type="text" name="p1" id="p1"
                                       onChange={p => this.setState({p2: p.target.value})}
                                       value={p2}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="4">
                                <div style={{display: 'inline-block'}}>Board</div>
                            </Col>
                            <Col xs="8">
                                <Input type="text" name="p1" id="p1"
                                       onChange={p => this.setState({b: p.target.value})}
                                       value={b}
                                />
                            </Col>
                        </Row>
                        <br/>
                        {loading ? showLoading() : this.showResult()}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" disabled={loading} onClick={this.getOdds}>Calc</Button>
                        <Button color="secondary" onClick={this.toggle}>Exit</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
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
)(Odds);