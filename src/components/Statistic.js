import React from 'react';
import {
    Button, ButtonGroup, Card, CardBody, CardFooter,
    Col, Collapse,
    FormGroup,
    Input, InputGroup,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader, Nav, NavItem, NavLink,
    Row, TabContent,
    Table, TabPane
} from "reactstrap";
import {connect} from "react-redux";
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import * as _ from 'lodash';
import classnames from 'classnames';
import moment from "moment";
import {showNumber} from '../App';

let buyIns = [];
let wons = [];
let totals = [];
let bountys = [];
let trends = [];
let dates = [];

class Statistic extends React.Component {
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
            sumBounty: 0,
            avgWon: 0,
            avgBuyIn: 0,
            avgTotal: 0,
            avgBounty: 0,
            maxBuyIn: 0,
            maxWon: 0,
            maxBounty: 0,
            showFilter: false,
            filtered: false,
            wons: [],
            buyIns: [],
            bountys: [],
            dates: [],
            totals: [],
        };

        this.toggle = this.toggle.bind(this);
        this.toggleTab = this.toggleTab.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.updateFormDate = this.updateFormDate.bind(this);
        this.updateToDate = this.updateToDate.bind(this);
        this.chart = this.chart.bind(this);
        this.init = this.init.bind(this);
        this.last3m = this.last3m.bind(this);
        this.last6m = this.last6m.bind(this);
        this.last12m = this.last12m.bind(this);
        this.this12m = this.this12m.bind(this);
        this.showFilter = this.showFilter.bind(this);
        this.resetFilter = this.resetFilter.bind(this);
    }


    toggleTab(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab,
                showFilter: false,
            });
        }
    }

    toggle() {
        if (this.props.fromDate !== undefined) {
            this.setState({
                fromDate: this.props.fromDate,
            })
        } else {
            this.setState({
                fromDate: '2018-01-01',
            });
        }

        this.setState({
            modal: !this.state.modal,
            dateOk: true,
            activeTab: '1',
            showFilter: false,
            toDate: this.props.today,
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
        const {user} = this.props;
        const {users} = this.props.data;
        const from = new Date(this.state.fromDate);
        const to = new Date(this.state.toDate);

        const actualUser = _.filter(users, (u) => {
            return user.name === u.name
        })[0];
        if (this.state.fromDate === "2018-01-01" && this.state.toDate === this.props.today) {
            this.setState({
                filtered: false,
            })
        } else {
            this.setState({
                filtered: true,
            })
        }
        if (this.state.dateOk) {
            let filteredGames = _.filter(actualUser.games, function (g) {
                if (_.isNil(g) || _.isNil(g.date)) {
                    return false;
                }
                return (from <= new Date(g.date) && to >= new Date(g.date)) && g.buyIn > 0;
            });

            filteredGames = _.sortBy(filteredGames, function (g) {
                return g.date;
            });

            console.log("filtered games ", filteredGames);

            buyIns = _.map(filteredGames, (game) => {
                return -game.buyIn;
            });

            wons = _.map(filteredGames, (game) => {
                return game.won;
            });

            bountys = _.map(filteredGames, (game) => {
                return game.bounty;
            });

            dates = _.map(filteredGames, (game) => {
                return moment(game.date).format('D.M.YY');
            });

            totals = _.map(filteredGames, (game) => {
                return game.won + game.bounty - game.buyIn;
            });

            trends = Statistic.lms(totals);

            this.setState({
                sumWon: _.sum(wons),
                sumBounty: _.sum(bountys),
                sumBuyIn: _.sum(buyIns) * -1,

                maxBuyIn: _.min(buyIns) * -1,
                maxWon: _.max(wons),
                maxBounty: _.max(bountys),
                maxTotal: _.max(totals),
                wons,
                buyIns,
                bountys,
                dates,
                totals,
            }, () => {
                const {sumWon, sumBuyIn, sumBounty} = this.state;
                this.setState({
                    sumTotal: sumWon + sumBounty - sumBuyIn,

                    avgTotal: Math.round((sumWon + sumBounty - sumBuyIn) / filteredGames.length),
                    avgBuyIn: Math.round(sumBuyIn / filteredGames.length),
                    avgBounty: Math.round(sumBounty / filteredGames.length),
                    avgWon: Math.round(sumWon / filteredGames.length),
                });
            });

            console.log("games for stat ", filteredGames);

            if (buyIns.length > 1) {
                this.chart(dates, buyIns, wons, bountys, totals, trends, false);
            } else {
                this.chart(dates, buyIns, wons, bountys, totals, trends, true);
            }
        } else {
            this.init();
            this.chart(dates, buyIns, wons, totals, bountys, trends, true);
        }
    }

    static lms(values) {
        let sum_x = 0;
        let sum_y = 0;
        let sum_xy = 0;
        let sum_xx = 0;
        let count = 0;
        let values_x = [];

        for (let i = 0; i < values.length; i++) {
            values_x.push(i + 1);
        }

        /*
        * We'll use those variables for faster read/write access.
        */
        let x = 0;
        let y = 0;
        let values_length = values_x.length;

        if (values_length !== values.length) {
            throw new Error('The parameters values_x and values_y need to have same size!');
        }

        /*
        * Nothing to do.
        */
        if (values_length === 0) {
            return [[], []];
        }

        /*
        * Calculate the sum for each of the parts necessary.
        */
        for (let v = 0; v < values_length; v++) {
            x = values_x[v];
            y = values[v];
            sum_x += x;
            sum_y += y;
            sum_xx += x * x;
            sum_xy += x * y;
            count++;
        }

        /*
        * Calculate m and b for the formular:
        * y = x * m + b
        */
        let m = (count * sum_xy - sum_x * sum_y) / (count * sum_xx - sum_x * sum_x);
        let b = (sum_y / count) - (m * sum_x) / count;

        /*
        * We will make the x and y result line now
        */
        let result_values_x = [];
        let result_values_y = [];

        for (let v = 0; v < values_length; v++) {
            x = values_x[v];
            y = x * m + b;
            result_values_x.push(x);
            result_values_y.push(Math.round(y));
        }

        return result_values_y;
    }

    chart(date, buyIn, won, bounty, total, trend, showDots) {
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
                    itemMarginBottom: 12,
                    itemStyle: {
                        fontSize: '1.2em',
                    },
                },
                series: [{
                    name: 'Buy In',
                    stack: 'data',
                    type: 'column',
                    data: buyIn,
                    lineWidth: 1,
                    color: '#DC3545',
                    marker: {
                        enabled: showDots,
                    },
                }, {
                    name: 'Bounty',
                    stack: 'data',
                    type: 'column',
                    data: bounty,
                    lineWidth: 1,
                    color: '#155724',
                    marker: {
                        enabled: showDots,
                    },
                }, {
                    name: 'Won',
                    stack: 'data',
                    type: 'column',
                    data: won,
                    lineWidth: 1,
                    color: '#28A745',
                    marker: {
                        enabled: showDots,
                    },
                }, {
                    name: 'Total',
                    type: 'spline',
                    data: total,
                    color: '#6C757D',
                    marker: {
                        enabled: showDots,
                    },
                }, {
                    name: 'LMS',
                    type: 'spline',
                    data: trend,
                    lineWidth: 1,
                    color: '#007BFF',
                    /*
                                        visible: false,
                    */
                    marker: {
                        enabled: showDots,
                    },
                },
                ],
            }
        });
    }

    init() {
        this.setState({
            sumWon: 0,
            sumBuyIn: 0,
            sumTotal: 0,
            sumBounty: 0,
            avgWon: 0,
            avgBuyIn: 0,
            avgTotal: 0,
            avgBounty: 0,
            maxBuyIn: 0,
            maxWon: 0,
            maxTotal: 0,
            maxBounty: 0,
        });

        buyIns = [];
        wons = [];
        totals = [];
        trends = [];
        dates = [];
        bountys = [];
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

    last3m() {
        const months = 3;
        let d = new Date(this.props.today);
        d.setMonth(d.getMonth() - months);
        this.setState({
            fromDate: moment(d).format('YYYY-MM-DD'),
            toDate: this.props.today,
            dateOk: true,
        }, () => {
            this.getData();
        })
    }

    last6m() {
        const months = 6;
        let d = new Date(this.props.today);
        d.setMonth(d.getMonth() - months);
        this.setState({
            fromDate: moment(d).format('YYYY-MM-DD'),
            toDate: this.props.today,
            dateOk: true,
        }, () => {
            this.getData();
        })
    }


    last12m() {
        const months = 12;
        let d = new Date(this.props.today);
        d.setMonth(d.getMonth() - months);
        this.setState({
            fromDate: moment(d).format('YYYY-MM-DD'),
            toDate: this.props.today,
            dateOk: true,
        }, () => {
            this.getData();
        })
    }

    this12m() {
        let d = new Date(this.props.today);
        this.setState({
            fromDate: d.getFullYear() + '-01-01',
            toDate: d.getFullYear() + '-12-31',
            dateOk: true,
        }, () => {
            this.getData();
        })
    }

    resetFilter() {
        this.setState({
            dateOk: true,
            fromDate: '2018-01-01',
            toDate: this.props.today,
            showFilter: false,
        }, () => {
            this.getData();
        })
    }

    showFilter() {
        this.setState({
            showFilter: !this.state.showFilter,
        })
    }

    filter() {
        return (
            <Collapse isOpen={this.state.showFilter}>
                <Card outline>
                    <CardBody>
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
                        <Row>
                            <Col>
                                <Button size="sm" color="link" onClick={this.last3m}>3 Month</Button>
                            </Col>
                            <Col>
                                <Button size="sm" color="link" onClick={this.last6m}>6 Month</Button>
                            </Col>
                            <Col>
                                <Button size="sm" color="link" onClick={this.last12m}>Year</Button>
                            </Col>
                            <Col>
                                <Button size="sm" color="link" onClick={this.this12m}>This Year</Button>
                            </Col>
                        </Row>
                    </CardBody>
                    <CardFooter>
                        <Button color="link" size="sm" block style={{padding: "0 0 0 0"}}
                                onClick={this.showFilter}>Apply</Button>
                    </CardFooter>
                </Card>
            </Collapse>)
    }

    render() {
        const {user} = this.props;
        const {sumWon, sumBuyIn, sumTotal, sumBounty, avgWon, avgBuyIn, avgTotal, avgBounty, maxWon, maxBuyIn, maxTotal, maxBounty, dates,} = this.state;
        let {wons} = this.state;

        return (<div>
            <i className="fa fa-line-chart" onClick={this.toggle}
               style={{fontSize: "20px"}}/>

            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}
                   onKeyPress={this.handleKeyPress}
            >
                <ModalHeader toggle={this.toggle}>Statistic for {user.name}</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Row>
                            <Col>
                                <ButtonGroup>
                                    <Button color={"link"} onClick={this.showFilter}
                                            style={{color: this.state.filtered ? "#007BFF" : "black"}}
                                    >
                                        <i className="fa fa-filter"/> Filter
                                    </Button>
                                    <Button color={"link"} style={{
                                        visibility: this.state.filtered ? "visible" : "hidden",
                                        color: "#007BFF"
                                    }}
                                            onClick={this.resetFilter}>
                                        X
                                    </Button>
                                </ButtonGroup>
                            </Col>
                        </Row>
                        {this.filter()}
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
                                        style={{visibility: this.state.dateOk ? 'visible' : 'hidden'}}
                                        highcharts={Highcharts}
                                        options={this.state.options}
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
                                            <th>Bounty</th>
                                            <th>Total</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <th scope="row">Sum</th>
                                            <td>{showNumber(sumBuyIn)}</td>
                                            <td>{showNumber(sumWon)}</td>
                                            <td>{showNumber(sumBounty)}</td>
                                            <th>{showNumber(sumTotal)}</th>
                                        </tr>
                                        <tr>
                                            <th scope="row">Avg</th>
                                            <td>{showNumber(avgBuyIn)}</td>
                                            <td>{showNumber(avgWon)}</td>
                                            <td>{showNumber(avgBounty)}</td>
                                            <td>{showNumber(avgTotal)}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Max</th>
                                            <td>{showNumber(maxBuyIn)}</td>
                                            <td>{showNumber(maxWon)}</td>
                                            <td>{showNumber(maxBounty)}</td>
                                            <td>{showNumber(maxTotal)}</td>
                                        </tr>
                                        </tbody>
                                    </Table>
                                    <Row style={{paddingTop: "12px"}}>
                                        <Col xs={8}>
                                            Games <b>played</b>
                                        </Col>
                                        <Col xs={4}>
                                            {dates.length}
                                        </Col>
                                    </Row>
                                    <Row style={{paddingTop: "12px"}}>
                                        <Col xs={8}>
                                            Chances of <b>winning</b>
                                        </Col>
                                        <Col xs={4}>
                                            {Math.round(_.filter(wons, (won) => {
                                                return won > 0;
                                            }).length / dates.length * 100)}%
                                        </Col>
                                    </Row>
                                    <Row style={{paddingTop: "12px"}}>
                                        <Col xs={8}>
                                            Chances of making <b>plus</b>
                                        </Col>
                                        <Col xs={4}>
                                            {Math.round(_.filter(totals, (total) => {
                                                return total > 0;
                                            }).length / dates.length * 100)}%
                                        </Col>
                                    </Row>
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
)(Statistic);
