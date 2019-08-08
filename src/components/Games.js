import React from 'react';
import {
    Button, ButtonGroup, Card, CardBody, Col, Collapse, FormGroup, Row,
} from "reactstrap";
import {connect} from "react-redux";
import * as _ from 'lodash';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import moment from "moment";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFilter} from "@fortawesome/free-solid-svg-icons";

class Games extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: {},
            filtered: false,
            showFilter: false,
            filterAmount: 0,
            filteredGames: [],
        };
        this.chart = this.chart.bind(this);
        this.showFilter = this.showFilter.bind(this);
        this.resetFilter = this.resetFilter.bind(this);
        this.filterGame = this.filterGame.bind(this);
        this.applyFilter = this.applyFilter.bind(this);

    }

    componentDidMount() {
        this.applyFilter()
    }

    applyFilter() {

        const {games} = this.props;

        const {filterAmount} = this.state;
        let filteredGames = games;
        if (filterAmount !== 0) {
            filteredGames = _.take(games, filterAmount);
        }
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
                    height: 330,
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
                    data: _.map(filteredGames, (u) => {
                        return u.bounty
                    }),
                    lineWidth: 1,
                    color: '#155724',
                    marker: {
                        enabled: false,
                    },
                }, {
                    name: 'BuyIn',
                    stack: 'data',
                    type: 'column',
                    data: _.map(filteredGames, (u) => {
                        return u.won
                    }),
                    lineWidth: 1,
                    color: '#28A745',
                    marker: {
                        enabled: false,
                    },
                }, {
                    name: 'Avg BuyIn',
                    type: 'spline',
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

    filterGame(evt) {
        this.setState({
            showFilter: false,
            filterAmount: evt.target.value,
            filtered: evt.target.value !== 0,
        }, () => {
            this.applyFilter();
        })
    }

    resetFilter() {
        this.setState({
            showFilter: false,
            filterAmount: 0,
            filtered: false,
        }, () => {
            this.applyFilter();
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
                            <Col xs={3} style={{paddingRight: "0.2em", paddingLeft: "1em"}}>
                                <Button style={{fontSize: "0.8em", paddingRight: "0px", paddingLeft: "0px"}}
                                        color={"link"} value={5} onClick={this.filterGame}>last 5</Button>
                            </Col>
                            <Col xs={3} style={{paddingRight: "0.2em", paddingLeft: "0.2em"}}>
                                <Button style={{fontSize: "0.8em", paddingRight: "0px", paddingLeft: "0px"}}
                                        color={"link"} value={10} onClick={this.filterGame}>last 10</Button>
                            </Col>
                            <Col xs={3} style={{paddingRight: "0.2em", paddingLeft: "0.2em"}}>
                                <Button style={{fontSize: "0.8em", paddingRight: "0px", paddingLeft: "0px"}}
                                        color={"link"} value={20} onClick={this.filterGame}>last 20</Button>
                            </Col>
                            <Col xs={3} style={{paddingRight: "1em", paddingLeft: "0.2em"}}>
                                <Button style={{fontSize: "0.8em", paddingRight: "0px", paddingLeft: "0px"}}
                                        color={"link"} value={30} onClick={this.filterGame}>last 30</Button>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Collapse>)
    }


    render() {
        const {filteredGames} = this.state;
        return (
            <div>
                <Row style={{align: "left"}}>
                    <Col xs={6}>
                        <ButtonGroup>
                            <Button color={"link"} onClick={this.showFilter} id={'filter'} key={'filter'}
                                    style={{color: this.state.filtered ? "#007BFF" : "black"}}
                            >
                                <FontAwesomeIcon icon={faFilter}/> Filter
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
                <Row>
                    <Col>
                        <HighchartsReact
                            highcharts={Highcharts}
                            options={this.state.options}
                        />
                    </Col>
                </Row>
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
