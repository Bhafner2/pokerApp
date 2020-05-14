import { CardGroup, OddsCalculator } from 'poker-odds-calculator';
import React from 'react';
import { connect } from "react-redux";
import {
    Button, Card, CardBody,
    Col, Collapse,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row
} from "reactstrap";
import * as _ from 'lodash';
import { showLoading } from "../App";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBalanceScale } from "@fortawesome/free-solid-svg-icons/index";
import Cards from "./Cards";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { MENU_SIZE, MENU_FONT } from './Home'

class Odds extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            p11: '',
            p12: '',
            p21: '',
            p22: '',
            p31: '',
            p32: '',
            p41: '',
            p42: '',
            b1: '',
            b2: '',
            b3: '',
            b4: '',
            b5: '',
            result: null,
            loading: false,
            error: false,
            usedCarts: [],
        };
        this.toggle = this.toggle.bind(this);
        this.calcOdds = this.calcOdds.bind(this);
        this.getOdds = this.getOdds.bind(this);
        this.showResult = this.showResult.bind(this);
        this.testData = this.testData.bind(this);
        /*
                https://www.npmjs.com/package/poker-odds-calculator
        */
    }

    toggle() {
        this.setState({
            modal: !this.state.modal,
            loading: false,
            error: false,
            p11: '',
            p12: '',
            p21: '',
            p22: '',
            p31: '',
            p32: '',
            p41: '',
            p42: '',
            b1: '',
            b2: '',
            b3: '',
            b4: '',
            b5: '',
            result: null,
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
        let error;
        try {
            const { p11, p12, p21, p22, p31, p32, p41, p42, b1, b2, b3, b4, b5 } = this.state;
            let player1Cards;
            let player2Cards;
            let player3Cards;
            let player4Cards;
            let board;

            const p1 = p11 + p12;
            const p2 = p21 + p22;
            const p3 = p31 + p32;
            const p4 = p41 + p42;
            const b = b1 + b2 + b3 + b4 + b5;

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
            if (!_.isNil(p3)) {
                try {
                    player3Cards = CardGroup.fromString(p3.toString());
                } catch (e) {
                }
            }
            if (!_.isNil(p4)) {
                try {
                    player4Cards = CardGroup.fromString(p4.toString());
                } catch (e) {
                }
            }
            if (!_.isNil(b)) {
                try {
                    board = CardGroup.fromString(b.toString());
                } catch (e) {
                }
            }
            const result = OddsCalculator.calculate([player1Cards, player2Cards, player3Cards, player4Cards], board);

            this.setState({
                result,
                loading: false,
            });
            console.log(`Player #1 - ${player1Cards} - ${result.equities[0].getEquity()}%`);
            console.log(`Player #2 - ${player2Cards} - ${result.equities[1].getEquity()}%`);
            console.log(`Player #3 - ${player3Cards} - ${result.equities[2].getEquity()}%`);
            console.log(`Player #4 - ${player4Cards} - ${result.equities[3].getEquity()}%`);
            console.log(`Tie - ${result.equities[3].getTiePercentage()}%`);
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

    showResult(valid) {
        let { result, error } = this.state;

        if (error) {
            return <div style={{ color: "#DC3545" }}>check Notation</div>
        }
        if (_.isNil(result)) {
            return <div />
        }
        if (_.isNil(result.equities)) {
            return <div />
        }
        return (
            <Collapse isOpen={!_.isNil(result) && !_.isNil(result.equities)}>
                <Card outline>
                    <CardBody>
                        <HighchartsReact
                            highcharts={Highcharts}
                            options={this.getPieChart(result.equities[0].getEquity(), result.equities[1].getEquity(), result.equities[2].getEquity(), result.equities[3].getEquity(), result.equities[1].getTiePercentage())}
                        />
                    </CardBody>
                </Card>
            </Collapse>
        )
    }

    getPieChart(p1, p2, p3, p4, tie) {
        return ({
            chart: {
                type: 'pie'
            },
            title: {
                text: "",
                style: {
                    display: 'none'
                },
            },
            tooltip: {
                pointFormat: '<span>{point.y}%</span>'
            },
            plotOptions: {
                pie: {
                    showInLegend: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<span>{point.name}<br>{point.y}%<span>',
                        distance: -50,
                        filter: {
                            property: 'percentage',
                            operator: '>',
                            value: 10
                        }
                    }
                }
            },
            legend: {
                itemMarginBottom: 10,
                itemStyle: {
                    fontSize: '1.2em',
                },
            },
            series: [{
                name: "pie",
                data: [{
                    name: "Player 1",
                    y: p1,
                    color: Highcharts.getOptions().colors[0]
                }, {
                    name: "Player 2",
                    y: p2,
                    color: Highcharts.getOptions().colors[2]
                }, {
                    name: "Player 3",
                    y: p3,
                    color: Highcharts.getOptions().colors[3]
                }, {
                    name: "Player 4",
                    y: p4,
                    color: Highcharts.getOptions().colors[4]
                }, {
                    name: "Tie",
                    y: tie,
                    color: Highcharts.getOptions().colors[1]
                }]
            }],
        })
    }

    reset() {
        console.log("resault: ", this.state.result)
        this.setState({
            result: null,
        }, () => {
            this.forceUpdate();
            console.log("resault: ", this.state.result)
        });
    }

    testData() {
        this.setState({
            p11: "AD",
            p12: "KD",
            p21: "TH",
            p22: "KH",
            b1: "6H",
            b2: "TD",
            b3: "KC",
        });
    }

    render() {
        const { loading, p11, p12, p21, p22, p31, p32, p41, p42, b1, b2, b3, b4, b5, result } = this.state;
        const usedCarts = [p11, p12, p21, p22, p31, p32, p41, p42, b1, b2, b3, b4, b5];
        const p1 = (p11 !== "" && p12 !== "");
        const p2 = (p21 !== "" && p22 !== "");
        const p3 = (p31 !== "" && p32 !== "");
        const p4 = (p41 !== "" && p42 !== "");
        const valid =
            (
                (p1 || (p11 === "" && p12 === "")) &&
                (p2 || (p21 === "" && p22 === "")) &&
                (p3 || (p31 === "" && p32 === "")) &&
                (p4 || (p41 === "" && p42 === ""))
            )
            &&
            (
                (p1 && p2) || (p1 && p3) || (p1 && p4) || (p2 && p3) || (p2 && p4) || (p3 && p4)
            )
            &&
            (
                (b1 === "" && b2 === "" && b3 === "" && b4 === "" && b5 === "")
                || (b1 !== "" && b2 !== "" && b3 !== "" && b4 === "" && b5 === "")
                || (b1 !== "" && b2 !== "" && b3 !== "" && b4 !== "" && b5 === "")
                || (b1 !== "" && b2 !== "" && b3 !== "" && b4 !== "" && b5 !== "")
            );
        return (
            <div>
                <FontAwesomeIcon icon={faBalanceScale} onClick={this.toggle} style={{ fontSize: MENU_SIZE }} />
                <div style={{ fontSize: MENU_FONT }}>Odds</div>

                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}
                    onKeyPress={() => this.handleKeyPress}>
                    <ModalHeader toggle={this.toggle}
                    // onClick={() => this.testData()}
                    >
                        Odds Calculator
                    </ModalHeader>
                    <ModalBody>
                        {!_.isNil(result) && !_.isNil(result.equities) ?
                            (<Row style={{ paddingTop: "6px" }}>
                                <Col xs="7" >
                                </Col>
                                <Col xs="4">
                                    Tie:  {result.equities[0].getTiePercentage()}%
                                </Col>
                            </Row>
                            ) : (
                                <span />
                            )}
                        <Row style={{ paddingTop: "6px" }}>
                            <Col xs="3" style={{ paddingRight: "0.2em" }}>
                                <div style={{ display: 'inline-block' }}>Player 1</div>
                            </Col>
                            <Col xs="4">
                                <Cards reset={() => this.reset()}
                                    selected={(c) => this.setState({ p11: c })}
                                    usedCarts={usedCarts} owner={"Player 1"}
                                />
                                <Cards reset={() => this.reset()}
                                    selected={(c) => this.setState({ p12: c })}
                                    usedCarts={usedCarts} owner={"Player 1"}
                                />
                            </Col>
                            {!_.isNil(result) && !_.isNil(result.equities) && p1 ?
                                (<Col xs="4">
                                    Win: {result.equities[0].getEquity()}%
                                </Col>
                                ) : (
                                    <span />
                                )}
                        </Row>
                        <Row style={{ paddingTop: "6px" }}>
                            <Col xs="3" style={{ paddingRight: "0.2em" }}>
                                <div style={{ display: 'inline-block' }}>Player 2</div>
                            </Col>
                            <Col xs="4">
                                <Cards selected={(c) => this.setState({ p21: c })}
                                    usedCarts={usedCarts} owner={"Player 2"}
                                    reset={() => this.reset()}
                                />
                                <Cards selected={(c) => this.setState({ p22: c })}
                                    usedCarts={usedCarts} owner={"Player 2"}
                                    reset={() => this.reset()}
                                />
                            </Col>
                            {!_.isNil(result) && !_.isNil(result.equities) && p2 ?
                                (<Col xs="4">
                                    Win: {result.equities[1].getEquity()}%
                                </Col>
                                ) : (
                                    <span />
                                )}
                        </Row>
                        <Row style={{ paddingTop: "6px" }}>
                            <Col xs="3" style={{ paddingRight: "0.2em" }}>
                                <div style={{ display: 'inline-block' }}>Player 3</div>
                            </Col>
                            <Col xs="4">
                                <Cards selected={(c) => this.setState({ p31: c })}
                                    usedCarts={usedCarts} owner={"Player 3"}
                                    reset={() => this.reset()}
                                />
                                <Cards selected={(c) => this.setState({ p32: c })}
                                    usedCarts={usedCarts} owner={"Player 3"}
                                    reset={() => this.reset()}
                                />
                            </Col>
                            {!_.isNil(result) && !_.isNil(result.equities) && p3 ?
                                (<Col xs="4">
                                    Win: {result.equities[2].getEquity()}%
                                </Col>
                                ) : (
                                    <span />
                                )}
                        </Row>
                        <Row style={{ paddingTop: "6px" }}>
                            <Col xs="3" style={{ paddingRight: "0.2em" }}>
                                <div style={{ display: 'inline-block' }}>Player 4</div>
                            </Col>
                            <Col xs="4">
                                <Cards selected={(c) => this.setState({ p41: c })}
                                    usedCarts={usedCarts} owner={"Player 4"}
                                    reset={() => this.reset()}
                                />
                                <Cards selected={(c) => this.setState({ p42: c })}
                                    usedCarts={usedCarts} owner={"Player 4"}
                                    reset={() => this.reset()}
                                />
                            </Col>
                            {!_.isNil(result) && !_.isNil(result.equities) && p4 ?
                                (<Col xs="4">
                                    Win: {result.equities[3].getEquity()}%
                                </Col>
                                ) : (
                                    <span />
                                )}
                        </Row>
                        <Row style={{ paddingTop: "12px" }}>
                            <Col xs="3" style={{ paddingRight: "0.2em" }}>
                                <div style={{ display: 'inline-block' }}>Board</div>
                            </Col>
                            <Col xs="9">
                                <Cards selected={(c) => this.setState({ b1: c })}
                                    usedCarts={usedCarts} owner={"board flop"}
                                    reset={() => this.reset()}
                                />
                                <Cards selected={(c) => this.setState({ b2: c })}
                                    usedCarts={usedCarts} owner={"board flop"}
                                    reset={() => this.reset()}
                                />
                                <Cards selected={(c) => this.setState({ b3: c })}
                                    usedCarts={usedCarts} owner={"board flop"}
                                    reset={() => this.reset()}
                                />
                                <span style={{ paddingLeft: "6px" }} />
                                <Cards selected={(c) => this.setState({ b4: c })}
                                    usedCarts={usedCarts} owner={"board turn"}
                                    reset={() => this.reset()}
                                />
                                <span style={{ paddingLeft: "6px" }} />
                                <Cards selected={(c) => this.setState({ b5: c })}
                                    usedCarts={usedCarts} owner={"board river"}
                                    reset={() => this.reset()}
                                />
                            </Col>
                        </Row>
                        <br />
                        {loading ? showLoading() : this.showResult(valid)}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" disabled={loading || !valid} onClick={this.getOdds}>Calc</Button>
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