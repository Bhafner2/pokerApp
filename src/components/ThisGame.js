import React from 'react';
import {
    Button, Col, FormGroup, Input, InputGroup,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader, Row,
} from "reactstrap";
import icon from '../img/gamepad-solid.svg';
import {connect} from "react-redux";
import * as _ from 'lodash';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

let filteredUsers = [];

class ThisGame extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            date: '',
            dateOk: true,
            options: {},
            sum: 0,
            sumOk: true,
        };

        this.toggle = this.toggle.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.updateDate = this.updateDate.bind(this);
        this.chart = this.chart.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal,
            date: this.props.today,
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
        filteredUsers = [];
        const {users} = this.props.data;
        const date = new Date(this.state.date);
        let sum = 0;
        let sumOk;

        if (this.state.dateOk && !_.isNil(users)) {

            for (let i in users) {
                let user = {...users[i]};

                user.games = _.filter(user.games, function (g) {
                    if (_.isNil(g) || _.isNil(g.date)) {
                        return false;
                    }
                    return date.getTime() === new Date(g.date).getTime() && g.buyIn > 0;
                });

                if (user.games.length > 0) {


                    let plainUser = {
                        name: user.name,
                        buyIn: -user.games[0].buyIn,
                        won: user.games[0].won,
                        bounty: user.games[0].bounty,
                        total: user.games[0].won + user.games[0].bounty - user.games[0].buyIn
                    };
                    sum = sum + plainUser.total;
                    filteredUsers.push(plainUser);
                    console.log("filtered users", filteredUsers);

                }
            }
            this.chart(filteredUsers);
        }
        sumOk = sum === 0;
        this.setState({
            sum,
            sumOk,
        })
    }

    chart(users) {
        console.log("list", users);

        users = _.sortBy(users, function (g) {
            return -g.total;
        });
        console.log("list", users);
        console.log("name list ", _.map(users, (u) => {
            return u.name
        }));

        this.setState({
            options: {
                chart: {
                    height: 280,
                    type: 'spline',
                },
                title: {
                    text: 'Players',
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
                    categories: _.map(users, (u) => {
                        return u.name
                    }),
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
                    data: _.map(users, (u) => {
                        return u.buyIn
                    }),
                    lineWidth: 1,
                    color: 'rgb(255, 0, 0)',
                    marker: {
                        enabled: false,
                    },
                }, {
                    name: 'Bounty',
                    stack: 'data',
                    type: 'column',
                    data: _.map(users, (u) => {
                        return u.bounty
                    }),
                    lineWidth: 1,
                    color: 'rgb(125, 125, 125)',
                    marker: {
                        enabled: false,
                    },
                }, {
                    name: 'Won',
                    stack: 'data',
                    type: 'column',
                    data: _.map(users, (u) => {
                        return u.won
                    }),
                    lineWidth: 1,
                    color: 'rgb(0, 255, 0)',
                    marker: {
                        enabled: false,
                    },
                }, {
                    name: 'Total',
                    type: 'spline',
                    data: _.map(users, (u) => {
                        return u.total
                    }),
                    color: 'rgb(0, 0, 0)',
                    marker: {
                        enabled: false,
                    },
                },
                ],
            }
        });
    }

    updateDate(evt) {
        this.setState({
                date: evt.target.value
            }, () => {
                console.log("new date " + this.state.date);
                if (this.state.date === '') {
                    this.setState({
                        dateOk: false,
                    })
                } else {
                    this.setState({
                        dateOk: true,
                    });
                    this.getData();
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
        return (<div>
            <img className="chart" src={icon} alt={"chart"} onClick={this.toggle}
                 style={{height: "32px", backgroundColor: this.state.sumOk ? "" : "red"}}/>

            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}
                   onKeyPress={this.handleKeyPress}>
                <ModalHeader toggle={this.toggle}>This Game</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Row>
                            <Col xs="4">
                                <b>Date</b>
                            </Col>
                            <Col xs="8">
                                <InputGroup>
                                    <Input type="date" name="date" id="date"
                                           onChange={this.updateDate}
                                           value={this.state.date}
                                           style={this.state.dateOk ? {backgroundColor: 'white'} : {backgroundColor: 'red'}}
                                    />
                                </InputGroup>
                            </Col>
                        </Row>
                        <br/>
                        <Row style={{
                            color: this.state.sumOk ? "green" : "red"
                        }}>
                            <Col xs="4">
                                <b>Checksum</b>
                            </Col>
                            <Col xs="8">
                                <div>{this.state.sum}</div>
                            </Col>
                        </Row>
                    </FormGroup>
                    <Row>
                        <Col>
                            <HighchartsReact
                                style={{visibility: this.state.dateOk ? 'visible' : 'hidden'}}
                                highcharts={Highcharts}
                                options={this.state.options}
                            />
                        </Col>
                    </Row>

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
)(ThisGame);
