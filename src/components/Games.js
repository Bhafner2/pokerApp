import React from 'react';
import {
    Button,
    ButtonGroup,
    Col, Row, Table,
} from "reactstrap";
import {connect} from "react-redux";
import * as _ from 'lodash';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import moment from "moment";
import {showNumber} from "../App";
import TimeFilter from "./TimeFilter";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChartArea, faChartBar, faChartPie, faList} from "@fortawesome/free-solid-svg-icons";

class Games extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: {},
            filteredGames: [],
            filteredUsers: [],
            from: '',
            to: '',
            useChart: true,
            useScatter: false,
        };
        this.chart = this.chart.bind(this);
        this.applyFilter = this.applyFilter.bind(this);
        this.mapBuyIns = this.mapBuyIns.bind(this);
        this.toggleScatterChart = this.toggleScatterChart.bind(this);
    }

    componentDidMount() {
        this.applyFilter()
    }

    applyFilter(from, to) {
        const {games} = this.props;

        let filteredGames = _.filter(games, g => {
            return moment(g.date) < to && moment(g.date) > from
        });
        const {users} = this.props.data || [];

        let filteredUsers = _.filter(users, u => {
            return _.filter(u.games, g => {
                return moment(g.date) < to && moment(g.date) > from && g.buyIn > 0
            });
        });

        this.setState({
            filteredGames,
            filteredUsers,
            from,
            to
        }, () => {
            this.chart();
        })
    }

    chart() {
        const {filteredGames, filteredUsers} = this.state;
        this.setState({
            options: {
                chart: {
                    type: 'spline',
                },
                title: {
                    text: 'Games',
                    style: {
                        fontWeight: 'bold'
                    },
                },
                xAxis: {
                    type: 'datetime',
                },
                yAxis: [{ // Primary yAxis
                    title: {
                        text: ''
                    },
                }, { // Secondary yAxis
                    title: {
                        text: ''
                    },
                    opposite: true,
                }],
                plotOptions: {
                    column: {
                        stacking: 'normal'
                    },
                    series: {
                        pointWidth: 10
                    }
                },
                legend: {
                    itemMarginBottom: 12,
                    itemStyle: {
                        fontSize: '1.2em',
                    },
                },
                series: [{
                    name: 'Bounty',
                    stack: 'data',
                    type: 'column',
                    yAxis: 0,
                    data: _.map(filteredGames, (g) => {
                        return [moment(g.date).valueOf(), g.bounty]
                    }),
                    lineWidth: 1,
                    color: '#155724',
                    marker: {
                        enabled: false,
                        radius: 2,
                    },
                }, {
                    name: 'Pot size',
                    stack: 'data',
                    type: 'column',
                    yAxis: 0,
                    data: _.map(filteredGames, (g) => {
                        return [moment(g.date).valueOf(), g.buyIn]
                    }),
                    color: '#28A745',
                    marker: {
                        enabled: false,
                        radius: 2,
                    },
                }, {
                    name: 'Avg Buy In',
                    type: 'spline',
                    yAxis: 1,
                    data: _.map(filteredGames, (g) => {
                        return [moment(g.date).valueOf(), (Math.round((g.buyIn / g.players) * 10) / 10)]
                    }),
                    color: '#6C757D',
                    lineWidth: 1,
                    marker: {
                        enabled: false,
                        radius: 2,
                    },
                }, {
                    name: 'Players',
                    stack: 'none',
                    type: 'column',
                    yAxis: 1,
                    data: _.map(filteredGames, (g) => {
                        return [moment(g.date).valueOf(), g.players]
                    }),
                    lineWidth: 1,
                    color: '#FFC107',
                    visible: false,
                    marker: {
                        enabled: false,
                        radius: 2,
                    },
                },{
                    name: 'Buy In',
                    type: 'scatter',
                    yAxis: 1,
                    data: this.mapBuyIns(filteredUsers),
                    color: 'rgba(255, 0, 0, .1)',
                    visible: false,
                    marker: {
                        radius: 24,
                    },
                }
                ],
            }
        });
    }

    getDotChart(users, filteredGames) {
        console.log(users)
        return ({
                chart: {
                    type: 'scatter',
                },
                xAxis: {
                    type: 'datetime',
                },
                title: {
                    text: `Buy In's`,
                    style: {
                        fontWeight: 'bold'
                    },
                },
                yAxis: {
                    title: {
                        text: ''
                    },
                },
                // tooltip: {
                //     pointFormat: '{series.name}: <b>{point.y}</b>' +
                //         'Date: {moment(point.x).format(\'D.M.YY\')}',
                // },
                series: [{
                    name: 'Buy In',
                    data: this.mapBuyIns(users),
                    color: 'rgba(255, 0, 0, .1)',
                    type: 'scatter',
                    marker: {
                        radius: 24,
                    },
                }, {
                    name: 'Avg Buy In',
                    type: 'spline',
                    color: '#6C757D',
                    marker: {
                        enabled: false,
                    },
                    data: _.map(filteredGames, (g) => {
                        return ([moment(g.date).valueOf(), Math.round((g.buyIn / g.players) * 10) / 10])
                    }),
                },
                ],
            }
        )
    }

    mapBuyIns(users) {
        const data = [];
        const {from, to} = this.state;

        for (let i in users) {
            for (let j in users[i].games) {
                const game = users[i].games[j];
                if (game.buyIn > 0 && moment(game.date) < to && moment(game.date) > from) {
                    data.push([moment(game.date).valueOf(), game.buyIn])
                }
            }
        }
        return data;
    }

    toggleScatterChart(useScatter) {
        this.setState({
            useChart: false,
            useScatter: false
        }, () => {
            this.forceUpdate();
            this.setState({
                useChart: true,
                useScatter
            })
        })
    }


    render() {
        const {filteredGames, filteredUsers, useChart, useScatter} = this.state;
        _.mixin({
            maxValue: (xs, it) => {
                const fn = _.isFunction(it) ? it : _.property(it);
                return fn(_.maxBy(xs, fn))
            }
        });
        const switchChart = (
            <Col xs={4}>
                <ButtonGroup style={{paddingTop: "4px"}}>
                    <Button size={"sm"} outline color="primary" active={useChart && !useScatter}
                            onClick={() => this.toggleScatterChart(false)}>
                        <FontAwesomeIcon icon={faChartBar} size={"1x"}/>
                    </Button>
                    <Button size={"sm"} outline color={"primary"} active={!useChart}
                            onClick={() => this.setState({useChart: false, useScatter: false})}>
                        <FontAwesomeIcon icon={faList} size={"1x"}/>
                    </Button>
                   {/*  <Button size={"sm"} outline color={"primary"} active={useScatter}
                            onClick={() => this.toggleScatterChart(true)}>
                        <FontAwesomeIcon icon={faChartArea} size={"1x"}/>
                    </Button>
        **/}                    
                </ButtonGroup>
            </Col>
        );
        return (
            <div>
                <Row>
                    <TimeFilter
                        calcData={(fromDate, toDate) => this.applyFilter(fromDate, toDate)}
                        addition={switchChart}
                    />
                </Row>
                <br/>
                {useChart ? (
                    <span>
                        {useScatter ? (
                            <Row>
                                <Col>
                                    <HighchartsReact
                                        style={{visibility: this.state.dateOk ? 'visible' : 'hidden'}}
                                        highcharts={Highcharts}
                                        options={this.getDotChart(filteredUsers, filteredGames)}
                                    />
                                </Col>
                            </Row>
                        ) : (
                            <Row style={{paddingTop: "12px"}}>
                                <Col>
                                    <HighchartsReact
                                        highcharts={Highcharts}
                                        options={this.state.options}
                                        containerProps={{style: {width: "100%"}}}
                                    />
                                </Col>
                            </Row>
                        )}
                    </span>
                ) : (
                    <Row>
                        <Col>
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
                                    <th>Buy In's</th>
                                    <td>{showNumber(_.sumBy(filteredGames, 'buyIn'))}</td>
                                    <td>{showNumber(_.maxValue(filteredGames, 'buyIn'))}</td>
                                    <td>{showNumber(_.meanBy(filteredGames, 'buyIn'))}</td>
                                </tr>
                                <tr>
                                    <th>Pot size</th>
                                    <td>{showNumber(_.sumBy(filteredGames, 'won'))}</td>
                                    <td>{showNumber(_.maxValue(filteredGames, 'won'))}</td>
                                    <td>{showNumber(_.meanBy(filteredGames, 'won'))}</td>
                                </tr>
                                <tr>
                                    <th>Bounty's</th>
                                    <td>{showNumber(_.sumBy(filteredGames, 'bounty'))}</td>
                                    <td>{showNumber(_.maxValue(filteredGames, 'bounty'))}</td>
                                    <td>{showNumber(_.meanBy(filteredGames, 'bounty'))}</td>
                                </tr>
                                <tr>
                                    <th>Players</th>
                                    <td>{showNumber(_.sumBy(filteredGames, 'players'))}</td>
                                    <td>{showNumber(_.maxValue(filteredGames, 'players'))}</td>
                                    <td>{showNumber(_.meanBy(filteredGames, 'players'))}</td>
                                </tr>
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                )}
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
)(Games);
