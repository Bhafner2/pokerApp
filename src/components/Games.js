import React from 'react';
import {
    Button, ButtonGroup, Card, CardBody, Col, Collapse, ModalBody, Row, Table,
} from "reactstrap";
import {connect} from "react-redux";
import * as _ from 'lodash';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import moment from "moment";
import {showNumber} from "../App";
import TimeFilter from "./TimeFilter";

class Games extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: {},
            filteredGames: [],
        };
        this.chart = this.chart.bind(this);
        this.applyFilter = this.applyFilter.bind(this);
    }

    componentDidMount() {
        this.applyFilter()
    }

    applyFilter(from, to) {
        const {games} = this.props;

        let filteredGames = _.filter(games, g => {
            return moment(g.date) < to && moment(g.date) > from
        });
        this.setState({
            filteredGames
        }, () => {
            this.chart();
        })
    }

    chart() {
        const {filteredGames} = this.state;

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
                yAxis: [{ // Primary yAxis
                    title: {
                        text: ''
                    },
                    plotLines: [{
                        value: 0,
                        color: 'lightGrey',
                        dashStyle: 'shortdash',
                        width: 0.5,
                    }]
                }, { // Secondary yAxis
                    title: {
                        text: ''
                    },
                    plotLines: [{
                        value: 0,
                        color: 'lightGrey',
                        dashStyle: 'shortdash',
                        width: 0.5,
                    }],
                    opposite: true,

                }],
                plotOptions: {
                    column: {
                        stacking: 'normal'
                    },
                },
                xAxis: [{
                    categories: _.map(filteredGames, (g) => {
                        return moment(g.date).format('D.M.YY');
                    }),
                }],
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
                    data: _.map(filteredGames, (u) => {
                        return u.bounty
                    }),
                    lineWidth: 1,
                    color: '#155724',
                    marker: {
                        enabled: false,
                    },
                }, {
                    name: 'Pot size',
                    stack: 'data',
                    type: 'column',
                    yAxis: 0,
                    data: _.map(filteredGames, (u) => {
                        return u.won
                    }),
                    lineWidth: 1,
                    color: '#28A745',
                    marker: {
                        enabled: false,
                    },
                }, {
                    name: 'Avg Buy In',
                    type: 'spline',
                    yAxis: 1,
                    data: _.map(filteredGames, (u) => {
                        return (Math.round((u.buyIn / u.players) * 10) / 10)
                    }),
                    color: '#6C757D',
                    marker: {
                        enabled: false,
                    },
                }, {
                    name: 'Players',
                    stack: 'none',
                    type: 'column',
                    yAxis: 1,
                    data: _.map(filteredGames, (u) => {
                        return u.players
                    }),
                    lineWidth: 1,
                    color: '#FFC107',
                    visible: false,
                    marker: {
                        enabled: false,
                    },
                }
                ],
            }
        });
    }

    render() {
        const {filteredGames} = this.state || [];
        _.mixin({
            maxValue: (xs, it) => {
                const fn = _.isFunction(it) ? it : _.property(it);
                return fn(_.maxBy(xs, fn))
            }
        });
        return (
            <div>
                <TimeFilter calcData={(fromDate, toDate) => this.applyFilter(fromDate, toDate)}
                />
                <Row style={{paddingTop: "12px"}}>
                    <Col>
                        <HighchartsReact
                            highcharts={Highcharts}
                            options={this.state.options}
                            containerProps={{style: {width: "100%"}}}
                        />
                    </Col>
                </Row>
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
            </div>);
    }
}

const mapStateToProps = state => {
    return {}
};

export default connect(
    mapStateToProps,
    {}
)(Games);
