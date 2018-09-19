import React from 'react';
import {
    Button,
    Col,
    FormGroup,
    Input, InputGroup,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader, Nav, NavItem, NavLink,
    Row, TabContent,
    Table, TabPane
} from "reactstrap";
import chart from '../img/chart-line-solid.svg';
import {connect} from "react-redux";
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import * as _ from 'lodash';
import classnames from 'classnames';
import moment from "moment";

let options;

let sumWon = 0;
let sumBuyIn = 0;
let sumTotal = 0;
let avgWon = 0;
let avgBuyIn = 0;
let avgTotal = 0;
let maxBuyIn = 0;
let maxWon = 0;
let maxTotal = 0;
let buyIn = [];
let won = [];
let total = [];
let trend = [];
let date = [];

class Statistic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            fromDate: '',
            toDate: '',
            dateOk: true,
            dataReady: false,
            activeTab: '1',
        };

        this.toggle = this.toggle.bind(this);
        this.toggleTab = this.toggleTab.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.updateFormDate = this.updateFormDate.bind(this);
        this.updateToDate = this.updateToDate.bind(this);
        this.init = this.init.bind(this);
    }


    toggleTab(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    toggle() {
        this.setState({
            modal: !this.state.modal,
            toDate: this.props.today,
            fromDate: '2018-01-01',
            dateOk: true,
        }, () => {
            this.setState({
                dataReady: false,
            });
            this.getData()
        });
    }


    handleKeyPress(target) {
        console.log("key pressed");
        if (target.charCode === 13) {
            console.log("enter pressed");
            this.toggle()
        } else if (target.charCode === 27) {
            console.log("esc pressed");
            this.toggle()
        }
    }

    getData() {
        this.init();
        const {user} = this.props;
        const from = new Date(this.state.fromDate);
        const to = new Date(this.state.toDate);
        if (this.state.dateOk) {
            let filterdGames = _.filter(user.games, function (game) {
                return (from <= new Date(game.date) && to >= new Date(game.date)) && game.buyIn > 0;
            });

            filterdGames = _.sortBy(filterdGames, [function (game) {
                return game.date;
            }]);

            console.log("filtered games ", filterdGames);

            buyIn = _.map(filterdGames, (game) => {
                return -game.buyIn;
            });

            won = _.map(filterdGames, (game) => {
                return game.won;
            });

            date = _.map(filterdGames, (game) => {
                return moment(game.date).format('D.M.YY');
            });

            total = _.map(filterdGames, (game) => {
                return game.won - game.buyIn;
            });

            trend = _.map(filterdGames, (game) => {
                return (game.won - game.buyIn) / 3;
            });


            sumWon = _.sum(won);
            sumBuyIn = _.sum(buyIn);
            sumTotal = sumWon - sumBuyIn;

            maxBuyIn = _.min(buyIn) * -1;
            maxWon = _.max(won);
            maxTotal = _.max(total);
            avgTotal = Math.round(sumTotal / filterdGames.length);
            avgBuyIn = Math.round(sumBuyIn / filterdGames.length);
            avgWon = Math.round(sumWon / filterdGames.length);
            console.log("games for stat ", filterdGames);
        }

        if (buyIn.length > 1) {
            Statistic.chart(date, buyIn, won, total, trend, false);
        } else {
            Statistic.chart(date, buyIn, won, total, trend, true);
        }

        this.setState({
            dataReady: true,
        })
    }

    static chart(date, buyIn, won, total, trend, showDots) {
        options = {
            chart: {
                height: 280,
                type: 'spline',
            },
            title: {
                text: 'Games',
                style: {
                    fontWeight: 'bold'
                },
            },
            yAxis: {
                title: {
                    text: ''
                },
                plotLines: [{
                    value: 0,
                    color: 'lightGrey',
                    dashStyle: 'shortdash',
                    width: 0.5,
                }],
            },
            plotOptions: {
                column: {
                    stacking: 'normal'
                },
            },
            xAxis: [{
                categories: date,
            }],
            legend: {
                itemStyle: {
                    fontSize: '16px',
                    font: '12pt Trebuchet MS, Verdana, sans-serif',
                },
            },
            series: [{
                name: 'Buy In',
                stack: 'data',
                type: 'column',
                data: buyIn,
                lineWidth: 1,
                color: 'rgb(255, 0, 0)',
                marker: {
                    enabled: showDots,
                },
                labels: {
                    style: {
                        fontSize: '50px'
                    }
                }
            }, {
                name: 'Won',
                stack: 'data',
                type: 'column',
                data: won,
                lineWidth: 1,
                color: 'rgb(0, 255, 0)',
                marker: {
                    enabled: showDots,
                },
            }, {
                name: 'Total',
                type: 'spline',
                data: total,
                color: 'rgb(0, 0, 0)',
                marker: {
                    enabled: showDots,
                },
            }, {
                name: 'Trend',
                type: 'spline',
                data: trend,
                lineWidth: 1,
                color: 'rgb(0, 0, 255)',
                marker: {
                    enabled: showDots,
                },
            },
            ],
        };
    }

    init() {
        sumWon = 0;
        sumBuyIn = 0;
        sumTotal = 0;
        avgWon = 0;
        avgBuyIn = 0;
        avgTotal = 0;
        maxBuyIn = 0;
        maxWon = 0;
        maxTotal = 0;
        buyIn = [];
        won = [];
        total = [];
        trend = [];
        date = [];
        Statistic.chart([], [], [], true);
        this.setState({
            dataReady: false,
        })
    }

    updateFormDate(evt) {
        this.setState({
                fromDate: evt.target.value
            }, () => {
                if (this.state.fromDate === '' || new Date(this.state.toDate) < new Date(this.state.fromDate)) {
                    this.setState({
                        dateOk: false,
                        dataReady: false,
                    }, () => {
                        this.getData();
                    });
                } else {
                    this.setState({
                        dateOk: true,
                        dataReady: false,
                    }, () => {
                        this.getData();
                    });
                }
            }
        );
    }

    updateToDate(evt) {
        this.setState({
                toDate: evt.target.value
            }, () => {
                if (this.state.toDate === '' || new Date(this.state.toDate) < new Date(this.state.fromDate)) {
                    this.setState({
                        dateOk: false,
                        dataReady: false,
                    }, () => {
                        this.getData();
                    });
                } else {
                    this.setState({
                        dateOk: true,
                        dataReady: false,
                    }, () => {
                        this.getData();
                    });
                }
            }
        );
    }


    render() {
        const {user} = this.props;
        return <div>
            <img className="chart" src={chart} alt={"chart"} onClick={this.toggle} style={{height: "25px"}}/>

            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}
                   onKeyPress={this.handleKeyPress}>
                <ModalHeader toggle={this.toggle}>Statistic for {user.name}</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Row>
                            <Col><b>Filter</b></Col>
                        </Row>
                        <Row>
                            <Col>
                                <InputGroup>
                                    <Input type="date" name="fromDate" id="fromDate"
                                           onChange={this.updateFormDate}
                                           value={this.state.fromDate}
                                           style={this.state.dateOk ? {backgroundColor: 'white'} : {backgroundColor: 'red'}}
                                    />

                                    <Input type="date" name="toDate" id="toDate"
                                           onChange={this.updateToDate}
                                           value={this.state.toDate}
                                           style={this.state.dateOk ? {backgroundColor: 'white'} : {backgroundColor: 'red'}}
                                    />

                                </InputGroup>
                            </Col>
                        </Row>
                    </FormGroup>
                    <Nav tabs>
                        <NavItem>
                            <NavLink
                                className={classnames({active: this.state.activeTab === '1'})}
                                onClick={() => {
                                    this.toggleTab('1');
                                }}
                            >
                                Chart
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({active: this.state.activeTab === '2'})}
                                onClick={() => {
                                    this.toggleTab('2');
                                }}
                            >
                                Table
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="1">
                            <br/>
                            <Row>
                                <Col>
                                    <HighchartsReact
                                        style={{visibility: this.state.dataReady ? 'visible' : 'hidden'}}
                                        highcharts={Highcharts}
                                        options={options}
                                    />
                                </Col>
                            </Row>
                        </TabPane>
                    </TabContent>
                    <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="2">
                            <br/>
                            <Row>
                                <Col>
                                    <Table borderless size="sm">
                                        <thead>
                                        <tr>
                                            <th/>
                                            <th scope="row">Buy In</th>
                                            <th>Won</th>
                                            <th>Total</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <th scope="row">Sum</th>
                                            <td>{sumBuyIn}</td>
                                            <td>{sumWon}</td>
                                            <th>{sumTotal}</th>
                                        </tr>
                                        <tr>
                                            <th scope="row">Avg</th>
                                            <td>{avgBuyIn}</td>
                                            <td>{avgWon}</td>
                                            <td>{avgTotal}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Max</th>
                                            <td>{maxBuyIn}</td>
                                            <td>{maxWon}</td>
                                            <td>{maxTotal}</td>
                                        </tr>
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                        </TabPane>
                    </TabContent>


                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={this.toggle}>Exit</Button>
                </ModalFooter>
            </Modal>
        </div>;
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
)(Statistic);
