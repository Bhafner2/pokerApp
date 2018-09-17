import React from 'react';
import {
    Button,
    Col,
    FormGroup,
    Input,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row,
    Table
} from "reactstrap";
import chart from '../chart-bar-regular.svg';
import {connect} from "react-redux";
import * as _ from 'lodash';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

let options;

let games = [];
let sumWon = 0;
let sumBuyIn = 0;
let sumTotal = 0;
let avgWon = 0;
let avgBuyIn = 0;
let avgTotal = 0;
let buyIn = [];
let won = [];
let total = [];


class Statistic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            fromDate: '',
            toDate: '',
            dateOk: true,
        };

        this.toggle = this.toggle.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.updateFormDate = this.updateFormDate.bind(this);
        this.updateToDate = this.updateToDate.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal,
            toDate: this.props.today,
            fromDate: '2018-01-01',
        });
        this.getData()
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
        if (this.state.dateOk) {
            for (let i = 0; i < user.games.length; i++) {
                if (this.state.fromDate < user.games[i].date || this.state.toDate > user.games[i].date) {
                    if (user.games[i].buyIn > 0) {
                        games.push(user.games[i]);
                        sumWon = sumWon + user.games[i].won;
                        sumBuyIn = sumBuyIn + user.games[i].buyIn;

                        buyIn.push(user.games[i].buyIn * -1);
                        won.push(user.games[i].won);
                        total.push(user.games[i].won - user.games[i].buyIn);
                    }
                }
            }
            sumTotal = sumWon - sumBuyIn;

            if (games.length > 0) {
                avgTotal = Math.round(sumTotal / games.length);
                avgBuyIn = Math.round(sumBuyIn / games.length);
                avgWon = Math.round(sumWon / games.length);
            }

            this.chart(buyIn, won, total);
            console.log("games for stat ", games);
        } else {
            this.init();
        }
    }

    chart(buyIn, won, total) {
        options = {
            chart: {
                height: 250,
                type: 'spline',
            },
            title: {
                text: 'Game overview'
            },
            yAxis: {
                title: {
                    text: ''
                }
            },
            series: [{
                name: 'Buy In',
                data: buyIn,
                lineWidth: 1,
                color: 'rgb(255, 0, 0)',
                marker: {
                    enabled: false,
                },
            }, {
                name: 'Won',
                data: won,
                lineWidth: 1,
                color: 'rgb(0, 255, 0)',
                marker: {
                    enabled: false,
                },
            }, {
                name: 'Total',
                data: total,
                lineWidth: 3,
                color: 'rgb(0, 0, 0)',
                marker: {
                    enabled: false,
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
        buyIn = [];
        won = [];
        total = [];
        this.chart([], [], []);
    }

    updateFormDate(evt) {
        this.setState({
                fromDate: evt.target.value
            }, () => {
                if (this.state.fromDate === '') {
                    this.setState({
                        dateOk: false,
                    })
                } else {
                    this.setState({
                        dateOk: true,
                    });
                }
                this.getData();
            }
        );
    }

    updateToDate(evt) {
        this.setState({
                toDate: evt.target.value
            }, () => {
                if (this.state.toDate === '') {
                    this.setState({
                        dateOk: false,
                    })
                } else {
                    this.setState({
                        dateOk: true,
                    });
                }
                this.getData();
            }
        );
    }


    render() {
        const {user} = this.props;
        return <div>
            <img className="chart" src={chart} alt={"chart"} onClick={this.toggle}/>

            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}
                   onKeyPress={this.handleKeyPress}>
                <ModalHeader toggle={this.toggle}>Statistic {user.name}</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Row>
                            <Col xs="2">
                                From
                            </Col>
                            <Col xs="10">
                                <Input type="date" name="fromDate" id="fromDate"
                                       onChange={this.updateFormDate}
                                       value={this.state.fromDate}
                                       style={this.state.dateOk ? {backgroundColor: 'white'} : {backgroundColor: 'red'}}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="2">
                                To
                            </Col>
                            <Col xs="10">
                                <Input type="date" name="toDate" id="toDate"
                                       onChange={this.updateToDate}
                                       value={this.state.toDate}
                                       style={this.state.dateOk ? {backgroundColor: 'white'} : {backgroundColor: 'red'}}
                                />
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
                            <td>{sumTotal}</td>
                        </tr>
                        <tr>
                            <th scope="row">Avg</th>
                            <td>{avgBuyIn}</td>
                            <td>{avgWon}</td>
                            <td>{avgTotal}</td>
                        </tr>
                        </tbody>
                    </Table>
                    <div>
                        <HighchartsReact
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
