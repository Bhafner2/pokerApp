import React from 'react';
import {
    Button, ButtonGroup,
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
import {connect} from "react-redux";
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import * as _ from 'lodash';
import classnames from 'classnames';
import moment from "moment";

let buyIn = [];
let won = [];
let total = [];
let bounty = [];
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
                activeTab: tab
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
                filtered: true,
            })
        } else {
            this.setState({
                filtered: false,
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

            buyIn = _.map(filteredGames, (game) => {
                return -game.buyIn;
            });

            won = _.map(filteredGames, (game) => {
                return game.won;
            });

            bounty = _.map(filteredGames, (game) => {
                return game.bounty;
            });

            date = _.map(filteredGames, (game) => {
                return moment(game.date).format('D.M.YY');
            });

            total = _.map(filteredGames, (game) => {
                return game.won + game.bounty - game.buyIn;
            });

            trend = _.map(filteredGames, (game) => {
                return (Math.round(game.won - game.buyIn) / 3);
            });

            this.setState({
                sumWon: _.sum(won),
                sumBounty: _.sum(bounty),
                sumBuyIn: _.sum(buyIn) * -1,

                maxBuyIn: _.min(buyIn) * -1,
                maxWon: _.max(won),
                maxBounty: _.max(bounty),
                maxTotal: _.max(total),
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

            if (buyIn.length > 1) {
                this.chart(date, buyIn, won, bounty, total, trend, false);
            } else {
                this.chart(date, buyIn, won, bounty, total, trend, true);
            }
        } else {
            this.init();
            this.chart(date, buyIn, won, total, bounty, trend, true);
        }
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
                }, {
                    name: 'Bounty',
                    stack: 'data',
                    type: 'column',
                    data: bounty,
                    lineWidth: 1,
                    color: 'rgb(125, 125, 125)',
                    marker: {
                        enabled: showDots,
                    },
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

        buyIn = [];
        won = [];
        total = [];
        trend = [];
        date = [];
        bounty = [];
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
        if (this.state.showFilter) {
            return (
                <div>
                    <Row>
                        <Col>
                            <InputGroup style={{paddingTop: "12px"}}>
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
                            <ButtonGroup>
                                <Button color="link" onClick={this.last3m}>3 Month</Button>
                                <Button color="link" onClick={this.last6m}>6 Month</Button>
                                <Button color="link" onClick={this.last12m}>Year</Button>
                                <Button color="link" onClick={this.this12m}>This Year</Button>
                            </ButtonGroup>
                        </Col>
                    </Row>
                </div>)
        } else {
            return <div/>
        }
    }

    render() {
        const {user} = this.props;
        const {sumWon, sumBuyIn, sumTotal, sumBounty, avgWon, avgBuyIn, avgTotal, avgBounty, maxWon, maxBuyIn, maxTotal, maxBounty} = this.state;

        return (<div>
            <i className="fa fa-line-chart" onClick={this.toggle}
               style={{fontSize: "20px"}}/>

            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}
                   onKeyPress={this.handleKeyPress}
                   onBackButtonPress={() => this.setState({modal: false})}
            >
                <ModalHeader toggle={this.toggle}>Statistic for {user.name}</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Row>
                            <Col>
                                <ButtonGroup>
                                    <Button color={"link"} onClick={this.showFilter}
                                            style={{color: this.state.filtered ? "black" : "blue"}}
                                    >
                                        <i className="fa fa-filter"/> Filter
                                    </Button>
                                    <Button color={"link"} style={{
                                        visibility: this.state.filtered ? "hidden" : "visible",
                                        color: "blue"
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
                                            <td>{sumBuyIn}</td>
                                            <td>{sumWon}</td>
                                            <td>{sumBounty}</td>
                                            <th>{sumTotal}</th>
                                        </tr>
                                        <tr>
                                            <th scope="row">Avg</th>
                                            <td>{avgBuyIn}</td>
                                            <td>{avgWon}</td>
                                            <td>{avgBounty}</td>
                                            <td>{avgTotal}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Max</th>
                                            <td>{maxBuyIn}</td>
                                            <td>{maxWon}</td>
                                            <td>{maxBounty}</td>
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
