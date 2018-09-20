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

let filteredUsers = [];
let empty = {name: '', won: 0, buyIn: 0, date: ''};

class GeneralStatistic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            fromDate: '',
            toDate: '',
            dateOk: true,
            activeTab: '1',
            filteredGames: [],
            options: {},
            sumWon: 0,
            sumBuyIn: 0,
            sumTotal: 0,
            avgWon: 0,
            avgBuyIn: 0,
            avgTotal: 0,
            maxBuyIn: {...empty},
            maxWon: {...empty},
            maxTotal: {...empty},
        };

        this.toggle = this.toggle.bind(this);
        this.toggleTab = this.toggleTab.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.updateFormDate = this.updateFormDate.bind(this);
        this.updateToDate = this.updateToDate.bind(this);
        this.chart = this.chart.bind(this);
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
            activeTab: '1',
        }, () => {
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
        const {users} = this.props.data;
        const from = new Date(this.state.fromDate);
        const to = new Date(this.state.toDate);
        let maxWon = {...empty};
        let maxBuyIn = {...empty};
        let maxTotal = {...empty};
        if (this.state.dateOk) {

            for (let i in users) {
                let user = {...users[i]};
                user.games = _.filter(user.games, function (g) {
                    return (from <= new Date(g.date) && to >= new Date(g.date)) && g.buyIn > 0;
                });

                user.games = _.sortBy(user.games, function (g) {
                    return g.date;
                });
                if (user.games.length > 0) {


                    let maxW = _.maxBy(user.games, function (o) {
                        return o.won
                    });

                    if (maxWon.won < maxW.won) {
                        maxWon = maxW;
                        maxWon.name = user.name;
                        console.log('won', maxTotal.won)
                    }

                    let maxB = _.maxBy(user.games, function (o) {
                        return o.buyIn
                    });

                    if (maxBuyIn.buyIn < maxB.buyIn) {
                        maxBuyIn = maxB;
                        maxBuyIn.name = user.name;
                        console.log('buyIn', maxTotal.buyIn)
                    }

                    let maxT = _.maxBy(user.games, function (o) {
                        return o.won - o.buyIn
                    });

                    if (maxTotal.won - maxTotal.buyIn < maxT.won - maxT.buyIn) {
                        maxTotal = maxT;
                        maxTotal.name = user.name;
                        console.log('total', maxTotal.won - maxTotal.buyIn)
                    }

                    filteredUsers.push(user);
                    console.log("users", filteredUsers);
                }
            }
            this.setState({
                maxWon,
                maxBuyIn,
                maxTotal,
            });
        }
    }

    chart(date, buyIn, won, total, trend, showDots) {
        this.setState({
            options: {
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
            }
        });
    }

    init() {
        filteredUsers = [];
        this.setState({
            sumWon: 0,
            sumBuyIn: 0,
            sumTotal: 0,
            avgWon: 0,
            avgBuyIn: 0,
            avgTotal: {...empty},
            maxBuyIn: {...empty},
            maxWon: {...empty},
            maxTotal: 0,
        });
    }

    updateFormDate(evt) {
        this.setState({
                fromDate: evt.target.value
            }, () => {
                if (this.state.fromDate === '' || new Date(this.state.toDate) < new Date(this.state.fromDate)) {
                    this.setState({
                        dateOk: false,
                    }, () => {
                        this.getData();
                    });
                } else {
                    this.setState({
                        dateOk: true,
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
                    }, () => {
                        this.getData();
                    });
                } else {
                    this.setState({
                        dateOk: true,
                    }, () => {
                        this.getData();
                    });
                }
            }
        );
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps !== this.props) {
            this.getData();
        }
    }

    render() {
        const {sumWon, sumBuyIn, sumTotal, avgWon, avgBuyIn, avgTotal, maxWon, maxBuyIn, maxTotal} = this.state;

        return (<div>
            <img className="chart" src={chart} alt={"chart"} onClick={this.toggle} style={{height: "25px"}}/>

            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}
                   onKeyPress={this.handleKeyPress}>
                <ModalHeader toggle={this.toggle}>General Statistic</ModalHeader>
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
                                Max
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({active: this.state.activeTab === '2'})}
                                onClick={() => {
                                    this.toggleTab('2');
                                }}
                            >
                                Chart
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="1">
                            <br/>
                            <Row>
                                <Col>
                                    <Table borderless size="sm">
                                        <thead>
                                        <tr>
                                            <th/>
                                            <th scope="row">Name</th>
                                            <th>Buy In</th>
                                            <th>Won</th>
                                            <th>Total</th>
{/*
                                            <th>Date</th>
*/}
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <th scope="row">Buy In</th>
                                            <td>{maxBuyIn.name}</td>
                                            <th>{maxBuyIn.buyIn}</th>
                                            <td>{maxBuyIn.won}</td>
                                            <td>{maxBuyIn.won - maxBuyIn.buyIn}</td>
{/*
                                            <td>{moment(maxBuyIn.date).format('D.M.YY')}</td>
*/}
                                        </tr>
                                        <tr>
                                            <th scope="row">Won</th>
                                            <td>{maxWon.name}</td>
                                            <td>{maxWon.buyIn}</td>
                                            <th>{maxWon.won}</th>
                                            <td>{maxWon.won - maxWon.buyIn}</td>
{/*
                                            <td>{moment(maxWon.date).format('D.M.YY')}</td>
*/}
                                        </tr>
                                        <tr>
                                            <th scope="row">Total</th>
                                            <td>{maxTotal.name}</td>
                                            <td>{maxTotal.buyIn}</td>
                                            <td>{maxTotal.won}</td>
                                            <th>{maxTotal.won - maxTotal.buyIn}</th>
{/*
                                            <td>{moment(maxTotal.date).format('D.M.YY')}</td>
*/}
                                        </tr>
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>

                        </TabPane>
                    </TabContent>
                    <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="2">
                            <br/>
                            <Row>
                                <Col>
                                    <HighchartsReact
                                        style={{visibility: this.state.dateOk ? 'visible' : 'hidden'}}
                                        highcharts={Highcharts}
                                        options={this.state.options}
                                    />
                                </Col>
                            </Row>
                        </TabPane>
                    </TabContent>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={this.toggle}>Exit</Button>
                </ModalFooter>
            </Modal>
        </div>);
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
)(GeneralStatistic);
