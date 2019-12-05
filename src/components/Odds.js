import {CardGroup, OddsCalculator} from 'poker-odds-calculator';
import React from 'react';
import {connect} from "react-redux";
import {
    Button,
    Col,
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
import Cards from "./Cards";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

class Odds extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            p11: '',
            p12: '',
            p21: '',
            p22: '',
            b1: '',
            b2: '',
            b3: '',
            b4: '',
            b5: '',
            result: '',
            loading: false,
            error: false,
            usedCarts: [],
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
            p11: '',
            p12: '',
            p21: '',
            p22: '',
            b1: '',
            b2: '',
            b3: '',
            b4: '',
            b5: '',
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
        }, 500)
    }

    async calcOdds() {
        if (this.state.loading) {
            let error;
            try {
                let {p11, p12, p21, p22, b1, b2, b3, b4, b5} = this.state;
                let player1Cards;
                let player2Cards;
                let board;

                const p1 = p11 + p12;
                const p2 = p21 + p22;
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
        let {result, error} = this.state;

        if (error) {
            return <div style={{color: "#DC3545"}}>check Notation</div>
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
                <HighchartsReact
                    highcharts={Highcharts}
                    options={this.getPieChart(result.equities[0].getEquity(), result.equities[1].getEquity(), result.equities[1].getTiePercentage())}
                />
            </div>)
    }

    getPieChart(p1, p2, tie) {
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
                pointFormat: `<div>Percent: <b>{point.percentage:.1f}%</b> </div> <br/>`
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            legend: {
                itemMarginBottom: 12,
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
                    color: Highcharts.getOptions().colors[6]
                }, {
                    name: "Tie",
                    y: tie,
                    color: Highcharts.getOptions().colors[1]
                }]
            }],
        })
    }

    render() {
        const {loading, p11, p12, p21, p22, b1, b2, b3, b4, b5} = this.state;
        const usedCarts = [p11, p12, p21, p22, b1, b2, b3, b4, b5];
        const valid = (p11 !== "" && p12 !== "" && p21 !== "" && p22 !== "")
            && (
                (b1 === "" && b2 === "" && b3 === "" && b4 === "" && b5 === "")
                || (b1 !== "" && b2 !== "" && b3 !== "" && b4 === "" && b5 === "")
                || (b1 !== "" && b2 !== "" && b3 !== "" && b4 !== "" && b5 === "")
                || (b1 !== "" && b2 !== "" && b3 !== "" && b4 !== "" && b5 !== "")
            );
        return (
            <div>
                <FontAwesomeIcon icon={faBalanceScale} onClick={this.toggle} size="lg"/>

                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}
                       onKeyPress={() => this.handleKeyPress}>
                    <ModalHeader toggle={this.toggle}>Odds Calculator</ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col>
                                Pleas select the cards...
                            </Col>
                        </Row>
                        <br/>
                        <Row style={{paddingTop: "6px"}}>
                            <Col xs="3" style={{paddingRight: "0.2em"}}>
                                <div style={{display: 'inline-block'}}>Player 1</div>
                            </Col>
                            <Col xs="9">
                                <Cards selected={(c) => this.setState({p11: c})}
                                       usedCarts={usedCarts} owner={"Player 1"}
                                />
                                <Cards selected={(c) => this.setState({p12: c})}
                                       usedCarts={usedCarts} owner={"Player 1"}
                                />
                            </Col>
                        </Row>
                        <Row style={{paddingTop: "6px"}}>
                            <Col xs="3" style={{paddingRight: "0.2em"}}>
                                <div style={{display: 'inline-block'}}>Player 2</div>
                            </Col>
                            <Col xs="9">
                                <Cards selected={(c) => this.setState({p21: c})}
                                       usedCarts={usedCarts} owner={"Player 2"}
                                />
                                <Cards selected={(c) => this.setState({p22: c})}
                                       usedCarts={usedCarts} owner={"Player 2"}
                                />
                            </Col>
                        </Row>
                        <Row style={{paddingTop: "12px"}}>
                            <Col xs="3" style={{paddingRight: "0.2em"}}>
                                <div style={{display: 'inline-block'}}>Board</div>
                            </Col>
                            <Col xs="9">
                                <Cards selected={(c) => this.setState({b1: c})}
                                       usedCarts={usedCarts} owner={"board flop"}
                                />
                                <Cards selected={(c) => this.setState({b2: c})}
                                       usedCarts={usedCarts} owner={"board flop"}
                                />
                                <Cards selected={(c) => this.setState({b3: c})}
                                       usedCarts={usedCarts} owner={"board flop"}
                                />
                                <span style={{paddingLeft: "6px"}}/>
                                <Cards selected={(c) => this.setState({b4: c})}
                                       usedCarts={usedCarts} owner={"board turn"}
                                />
                                <span style={{paddingLeft: "6px"}}/>
                                <Cards selected={(c) => this.setState({b5: c})}
                                       usedCarts={usedCarts} owner={"board river"}
                                />
                            </Col>
                        </Row>
                        <br/>
                        {loading ? showLoading() : this.showResult()}
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