import React from 'react';
import {
    Button,
    Col,
    FormGroup,
    Input, InputGroup,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row,
    Table
} from "reactstrap";
import chart from '../img/chart-line-solid.svg';
import {connect} from "react-redux";
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import * as _ from 'lodash';

let options;

let games = [];
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
let counter = 0;

class Statistic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            fromDate: '',
            toDate: '',
            dateOk: true,
            dataReady: false,
        };

        this.toggle = this.toggle.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.updateFormDate = this.updateFormDate.bind(this);
        this.updateToDate = this.updateToDate.bind(this);
        this.init = this.init.bind(this);
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
            for (let i = 0; i < user.games.length; i++) {
                if (from <= new Date(user.games[i].date) && to >= new Date(user.games[i].date)) {
                    if (user.games[i].buyIn > 0) {
                        counter++;
                        games.push(user.games[i]);
                        sumWon = sumWon + user.games[i].won;
                        sumBuyIn = sumBuyIn + user.games[i].buyIn;

                        buyIn.push(user.games[i].buyIn * -1);
                        won.push(user.games[i].won);
                        total.push(user.games[i].won - user.games[i].buyIn);
                        trend.push(Math.round((sumWon - sumBuyIn) / counter));
                    }
                }
            }
            if (games.length > 0) {
                sumTotal = sumWon - sumBuyIn;
                maxBuyIn = _.min(buyIn) * -1;
                maxWon = _.max(won);
                maxTotal = _.max(total);
                avgTotal = Math.round(sumTotal / games.length);
                avgBuyIn = Math.round(sumBuyIn / games.length);
                avgWon = Math.round(sumWon / games.length);
            }
        }
        console.log("games for stat ", games);

        if (buyIn.length > 1) {
            Statistic.chart(buyIn, won, total, trend, false);
        } else {
            Statistic.chart(buyIn, won, total, trend, true);
        }

        this.setState({
            dataReady: true,
        })
    }

    static chart(buyIn, won, total, trend, showDots) {
        options = {
            chart: {
                height: 190,
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
            xAxis: {},
            legend: {
                itemStyle: {
                    fontSize: '16px',
                    font: '12pt Trebuchet MS, Verdana, sans-serif',
                },
            },
            series: [{
                name: 'Buy In',
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
                data: won,
                lineWidth: 1,
                color: 'rgb(0, 255, 0)',
                marker: {
                    enabled: showDots,
                },
            }, {
                name: 'Trend',
                data: trend,
                lineWidth: 1,
                color: 'rgb(0, 0, 255)',
                marker: {
                    enabled: showDots,
                },
            }, {
                name: 'Total',
                data: total,
                lineWidth: 3,
                color: 'rgb(0, 0, 0)',
                marker: {
                    enabled: showDots,
                },
            },
            ],
        };
    }

    init() {
        games = [];
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
        counter = 0;
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
                    <div>
                        <HighchartsReact
                            style={{visibility: this.state.dataReady ? 'visible' : 'hidden'}}
                            highcharts={Highcharts}
                            options={options}
                        />
                    </div>
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
