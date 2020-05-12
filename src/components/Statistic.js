import React from 'react';
import {
    Button,
    Col,
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
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faChartBar} from '@fortawesome/free-solid-svg-icons'
import TimeFilter from "./TimeFilter";

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
            wons: [],
            buyIns: [],
            bountys: [],
            dates: [],
            totals: [],
            pie: {},
        };

        this.toggle = this.toggle.bind(this);
        this.toggleTab = this.toggleTab.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.chart = this.chart.bind(this);
        this.init = this.init.bind(this);
        this.getData = this.getData.bind(this);
        this.getPieChart = this.getPieChart.bind(this);
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
        this.props.resetToggle();
        if (!this.state.modal) {
            this.setState({
                modal: true,
                activeTab: '1',
            });
        } else {
            this.setState({
                modal: false,
            });
        }
    }


    handleKeyPress(target) {
        if (target.charCode === 13) {
            console.log("enter pressed");
            this.toggle()
        } else if (target.charCode === 27) {
            console.log("esc pressed");
            this.toggle()
        }
    }

    async getData(fromDate, toDate) {
        if (this.state.modal) {
            console.log("Statistic getData", fromDate.format(), toDate.format());
            this.init();
            const {user} = this.props;
            const {users} = this.props.data;
            let filteredGames;
            const actualUser = _.filter(users, (u) => {
                return user.name === u.name
            })[0];
            console.log("actual user ", actualUser);
            filteredGames = _.filter(actualUser.games, function (g) {
                if (_.isNil(g) || _.isNil(g.date)) {
                    return false;
                }
                return (fromDate <= moment(g.date) && toDate >= moment(g.date)) && g.buyIn > 0;
            });

            filteredGames = _.sortBy(filteredGames, function (g) {
                return g.date;
            });

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

            const sumWon = _.sum(wons);
            const sumBounty = _.sum(bountys);
            const sumBuyIn = _.sum(buyIns) * -1;
            const sumTotal = sumWon + sumBounty - sumBuyIn;
            const maxBuyIn = _.min(buyIns) * -1;
            const maxWon = _.max(wons);
            const maxBounty = _.max(bountys);
            const maxTotal = _.max(totals);
            const avgTotal = ((sumWon + sumBounty - sumBuyIn) / filteredGames.length);
            const avgBuyIn = (sumBuyIn / filteredGames.length);
            const avgBounty = (sumBounty / filteredGames.length);
            const avgWon = (sumWon / filteredGames.length);

            this.setState({
                sumWon,
                sumBounty,
                sumBuyIn,
                maxBuyIn,
                maxWon,
                maxBounty,
                maxTotal,
                sumTotal,

                wons,
                buyIns,
                bountys,
                dates,
                totals,

                avgTotal,
                avgBuyIn,
                avgBounty,
                avgWon,
            });

            console.log("games for stat ", filteredGames);

            if (buyIns.length > 1) {
                this.chart(dates, buyIns, wons, bountys, totals, trends, false);
            } else {
                this.chart(dates, buyIns, wons, bountys, totals, trends, true);
            }

            let games = _.filter(this.props.data.games, function (g) {
                if (_.isNil(g) || _.isNil(g.date)) {
                    return false;
                }
                return (fromDate <= moment(g.date) && toDate >= moment(g.date)) && g.buyIn > 0;

            });

            this.getPieChart(games, dates.length)
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
            result_values_y.push(Math.round(y * 10) / 10);
        }

        return result_values_y;
    }

    static formatTooltip(tooltip, x = this.x, points = this.points) {
        let s = `<b>${x}</b>`;
        points.forEach((point) => {
            if(point.series.name === "Total"){
                s += `<br/> <b>${point.series.name}: ${point.y}</b>`
            }else {
                s += `<br/>${point.series.name}: ${point.y}`
            }
        });
        return s;
    }

    chart(date, buyIn, won, bounty, total, trend, showDots) {
        this.setState({
            options: {
                chart: {
                    type: 'spline',
                },
                tooltip: {
                    shared: true,
                    useHTML: true,
                },
                title: {
                    text: 'Games',
                    style: {
                        fontWeight: 'bold',
                        display: 'none',
                    },
                },
                yAxis: {
                    title: {
                        text: '',
                        style: {
                            display: 'none'
                        },
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
                    dashStyle: "ShortDot",
                    color: '#007BFF',
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

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.toggle === true) {
            this.toggle()
        }
    }

    getRankingAmount(ranking, place) {
        return _.filter(ranking, r => r.place === place).length
    }


    getRankingSum(ranking, place) {
        return _.sumBy(_.filter(ranking, r => r.place === place), 'won');
    }

    getPieChart(games, played) {
        const ranking = [];

        for (let i in games) {
            for (let j in games[i].rank) {
                const r = games[i].rank[j];
                if (r.name === this.props.user.name) {
                    ranking.push({place: parseInt(j) + 1, won: r.won});
                }
            }
        }

        const notWon = played - _.sum([this.getRankingAmount(ranking, 1), this.getRankingAmount(ranking, 2), this.getRankingAmount(ranking, 3), this.getRankingAmount(ranking, 4)]);

        this.setState({
            pie: {
                chart: {
                    type: 'pie'
                },
                tooltip: {
                    shared: true,
                    formatter: function() {
                        return (`<span><b>${this.point.name}</b> <br/>
                        <span><div>Chance: <b>${showNumber(this.point.percentage)}%</b></div> <br/>` +
                        `<div>Amount: <b>${this.point.y}</b></div> <br/>` 
                       + `<div>Won: <b>${this.point.sum}</b></div></span>`);
                    }                    
                },
                title: {
                    text: 'Ranking',
                    style: {
                        display: 'none'
                    },
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
                    name: "Ranking",
                    data: [{
                        name: '1st',
                        y: this.getRankingAmount(ranking, 1),
                        sum: this.getRankingSum(ranking, 1),
                        color: '#28A745',
                    }, {
                        name: '2nd',
                        y: this.getRankingAmount(ranking, 2),
                        sum: this.getRankingSum(ranking, 2),
                        color: '#155724',
                    }, {
                        name: '3rd',
                        y: this.getRankingAmount(ranking, 3),
                        sum: this.getRankingSum(ranking, 3),
                        color: '#2f7ed8',
                    }, {
                        name: '4th',
                        y: this.getRankingAmount(ranking, 4),
                        sum: this.getRankingSum(ranking, 4),
                        color: '#1aadce',
                    }, {
                        name: 'None',
                        y: notWon,
                        sum: 0,
                        color: '#DC3545',
                    }]
                }]
            },
        })
    }

    render() {
        const {user} = this.props;
        const {sumWon, sumBuyIn, sumTotal, sumBounty, avgWon, avgBuyIn, avgTotal, avgBounty, maxWon, maxBuyIn, maxTotal, maxBounty, dates,} = this.state;
        let {wons} = this.state;

        return (<div>
                <FontAwesomeIcon icon={faChartBar} onClick={this.toggle} size={"1x"}/>

                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}
                       onKeyPress={this.handleKeyPress}
                >
                    <ModalHeader toggle={this.toggle}>Statistic for {user.name}</ModalHeader>
                    <ModalBody>

                        <TimeFilter today={this.props.today}
                                    calcData={(fromDate, toDate) => this.getData(fromDate, toDate)}
                                    result={sumBuyIn}
                        />
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
                                    Ranking
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames({active: this.state.activeTab === '3'})}
                                    onClick={() => {
                                        this.toggleTab('3');
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
                                    {dates.length === 0 ?
                                        <div className="center"><b>No games found ...</b><br/>change the filter or play a game</div> 
                                    :
                                        <HighchartsReact
                                            highcharts={Highcharts}
                                            options={this.state.options}
                                        />
                                    }
                                    </Col>
                                </Row>
                            </TabPane>
                        </TabContent>
                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="2">
                                <br/>
                                <Row>
                                    <Col>
                                    {dates.length === 0 ?
                                        <div className="center"><b>No games found ...</b><br/>change the filter or play a game</div> 
                                    :
                                        <HighchartsReact
                                            highcharts={Highcharts}
                                            options={this.state.pie}
                                        />
                                    }
                                    </Col>
                                </Row>
                            </TabPane>
                        </TabContent>
                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="3">
                                <br/>
                                <Row>
                                    <Col>
                                        <Row style={{paddingTop: "12px"}}>
                                            <Col xs={8}>
                                                <b>balance</b>
                                            </Col>
                                            <Col xs={4}>
                                                <b>{sumTotal > 0 ? `+ ${showNumber(sumTotal)}` : showNumber(sumTotal)}</b>
                                            </Col>
                                        </Row>
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
                                                {showNumber(_.filter(wons, (won) => {
                                                    return won > 0;
                                                }).length / dates.length * 100)}%
                                            </Col>
                                        </Row>
                                        <Row style={{paddingTop: "12px"}}>
                                            <Col xs={8}>
                                                Chances of making <b>plus</b>
                                            </Col>
                                            <Col xs={4}>
                                                {showNumber(_.filter(totals, (total) => {
                                                    return total > 0;
                                                }).length / dates.length * 100)}%
                                            </Col>
                                        </Row>
                                        <br/>
                                        <br/>
                                        <Table borderless size="sm" style={{paddingTop: "12px"}}>
                                            <thead>
                                            <tr>
                                                <th/>
                                                <th>Sum</th>
                                                <th>Max</th>
                                                <th>Avg</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                <th>Buy In</th>
                                                <td>{showNumber(sumBuyIn)}</td>
                                                <td>{showNumber(maxBuyIn)}</td>
                                                <td>{showNumber(avgBuyIn)}</td>
                                            </tr>
                                            <tr>
                                                <th>Won</th>
                                                <td>{showNumber(sumWon)}</td>
                                                <td>{showNumber(maxWon)}</td>
                                                <td>{showNumber(avgWon)}</td>
                                            </tr>
                                            <tr>
                                                <th>Bounty</th>
                                                <td>{showNumber(sumBounty)}</td>
                                                <td>{showNumber(maxBounty)}</td>
                                                <td>{showNumber(avgBounty)}</td>
                                            </tr>
                                            <tr>
                                                <th>Total</th>
                                                <td>{showNumber(sumTotal)}</td>
                                                <td>{showNumber(maxTotal)}</td>
                                                <td>{showNumber(avgTotal)}</td>
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
)(Statistic);
