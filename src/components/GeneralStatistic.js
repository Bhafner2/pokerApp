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
let maxWon = 0;
let maxBuyIn = 0;
let maxTotal = 0;
let buyIn = [];
let won = [];
let total = [];


class GeneralStatistic extends React.Component {
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

    componentDidMount(){
        this.getData();
    }

    toggle() {
        this.setState({
            modal: !this.state.modal,
            toDate: this.props.today,
            fromDate: '2018-01-01',
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
        GeneralStatistic.init();
        const {users} = this.props;
       /* if (this.state.dateOk) {
            for (let i = 0; i < users.games.length; i++) {
                if (new Date(this.state.fromDate) < new Date(users.games[i].date) && new Date(this.state.toDate) > new Date(users.games[i].date)) {
                    if (users.games[i].buyIn > 0) {
                        games.push(users.games[i]);
                        sumWon = sumWon + users.games[i].won;
                        sumBuyIn = sumBuyIn + users.games[i].buyIn;

                        buyIn.push(users.games[i].buyIn * -1);
                        won.push(users.games[i].won);
                        total.push(users.games[i].won - users.games[i].buyIn);

                        if (users.games[i].buyIn > maxBuyIn) {
                            maxBuyIn = users.games[i].buyIn;
                        }
                        if (users.games[i].won > maxWon) {
                            maxWon = users.games[i].won;
                        }
                        if (users.games[i].won - users.games[i].buyIn > maxTotal) {
                            maxTotal = users.games[i].won - users.games[i].buyIn;
                        }
                    }
                }
            }
            sumTotal = sumWon - sumBuyIn;

            if (games.length > 0) {
                avgTotal = Math.round(sumTotal / games.length);
                avgBuyIn = Math.round(sumBuyIn / games.length);
                avgWon = Math.round(sumWon / games.length);
            }
            if (buyIn.length > 1) {
                GeneralStatistic.chart(buyIn, won, total, false);
            } else {
                GeneralStatistic.chart(buyIn, won, total, true);
            }
            console.log("games for stat ", games);
        }*/
    }

    static chart(buyIn, won, total, showDots) {
        options = {
            chart: {
                height: 220,
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
                    enabled: showDots,
                },
            }, {
                name: 'Won',
                data: won,
                lineWidth: 1,
                color: 'rgb(0, 255, 0)',
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

    static init() {
        games = [];
        sumWon = 0;
        sumBuyIn = 0;
        sumTotal = 0;
        avgWon = 0;
        avgBuyIn = 0;
        avgTotal = 0;
        maxWon = 0;
        maxBuyIn = 0;
        maxTotal = 0;
        buyIn = [];
        won = [];
        total = [];
        GeneralStatistic.chart([], [], [], true);
    }

    updateFormDate(evt) {
        this.setState({
                fromDate: evt.target.value
            }, () => {
                if (this.state.fromDate === '' || new Date(this.state.toDate) < new Date(this.state.fromDate)) {
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
                if (this.state.toDate === '' || new Date(this.state.toDate) < new Date(this.state.fromDate)) {
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
        const {users} = this.props;
        return <div>
            <img className="chart" src={chart} alt={"chart"} onClick={this.toggle}/>

            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}
                   onKeyPress={this.handleKeyPress}>
                <ModalHeader toggle={this.toggle}>General Statistic</ModalHeader>
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
)(GeneralStatistic);
