import React from 'react';
import {
    Button, Col, FormGroup,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader, Row,
} from "reactstrap";
import {connect} from "react-redux";
import * as _ from 'lodash';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import moment from "moment";

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
            avgBuyIn: 0,
            sumBuyIn: 0,
            dates: [],
            showFilter: false,
            filtered: false,
            onOpen: true,
        };

        this.toggle = this.toggle.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.updateDate = this.updateDate.bind(this);
        this.chart = this.chart.bind(this);
        this.showFilter = this.showFilter.bind(this);
        this.resetFilter = this.resetFilter.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal,
            date: this.props.today,
            dateOk: true,
            activeTab: '1',
            onOpen: true,
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
        let avgBuyIn = 0;
        let sumBuyIn = 0;
        let dates = [];

        for (let user in users) {
            for (let game in users[user].games) {
                if (users[user].games[game].buyIn > 0) {
                    dates.push(users[user].games[game].date);
                }
            }
        }
        dates = _.uniqBy(dates);
        dates = _.sortBy(dates, (d) => {
            return -d
        });
        console.log("dates found", dates);

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
                    sumBuyIn = sumBuyIn + (plainUser.buyIn * -1);
                    filteredUsers.push(plainUser);
                    console.log("filtered users", filteredUsers);
                }
            }
            avgBuyIn = Math.round(sumBuyIn / filteredUsers.length);
        }
        sumOk = sum === 0;
        if (_.isNil(avgBuyIn) || _.isNaN(avgBuyIn)) {
            avgBuyIn = 0;
        }

        if (this.state.onOpen && sumBuyIn < 1) {
            console.log("no games played today, goto game ", dates[0]);
            this.updateDate(null, dates[0]);
        }
        this.setState({
            sum,
            sumOk,
            avgBuyIn,
            sumBuyIn,
            dates,
            filtered: this.state.date === this.props.today,
            onOpen: false,
        });
        this.chart(filteredUsers);
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

    updateDate(evt, date) {
        if (_.isNil(evt)) {
            this.setState({
                date: date,
                dateOk: true,
                showFilter: false,
                onOpen: false,
            }, () => {
                this.getData();
            })
        } else {
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
                            showFilter: false,
                        });
                    }
                    this.getData();
                }
            );
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps !== this.props) {
            this.getData();
        }
    }

    showFilter() {
        this.setState({
            showFilter: !this.state.showFilter,
        })
    }

    resetFilter() {
        this.setState({
            showFilter: false,
            date: this.props.today,
        }, () => {
            this.getData();
        })
    }

    filter() {
        if (this.state.showFilter) {
            return (
                <div style={{}}>
                    {this.state.dates.map((date, i) =>
                        <Row>
                            <Col>
                                <Button color={"link"} value={date} onClick={this.updateDate}
                                        key={i}>{moment(date).format('D.M.YY')}</Button>
                            </Col>
                        </Row>
                    )}
                </div>)
        } else {
            return <div/>
        }
    }

    render() {
        return (<div>
            <i className="fa fa-gamepad" onClick={this.toggle}
               style={{fontSize: "30px", color: this.state.sumOk ? "" : "red"}}/>

            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}
                   onKeyPress={this.handleKeyPress}
                   onBackButtonPress={() => this.setState({modal: false})}
            >
                <ModalHeader toggle={this.toggle}>Game {moment(this.state.date).format('D.M.YY')}</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Row style={{align: "left"}}>
                            <Col xs="5">
                                <div onClick={this.showFilter}
                                     style={{color: this.state.filtered ? "black" : "blue"}}
                                >
                                    <i className="fa fa-list"/> Last Games
                                </div>
                            </Col>
                            <Col xs="7">
                                <div style={{
                                    visibility: this.state.filtered ? "hidden" : "visible",
                                    color: "blue"
                                }}
                                     onClick={this.resetFilter}>
                                    Today
                                </div>
                            </Col>
                        </Row>
                        {this.filter()}
                        <Row style={{
                            color: this.state.sumOk ? "green" : "red"
                        }}>
                            <Col xs="5">
                                <br/>
                                <b>Checksum</b>
                            </Col>
                            <Col xs="7">
                                <br/>
                                <div>{this.state.sum}</div>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="5">
                                <b>Sum BuyIn</b>
                            </Col>
                            <Col xs="7">
                                <div>{this.state.sumBuyIn}</div>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="5">
                                <b>Avg BuyIn</b>
                            </Col>
                            <Col xs="7">
                                <div>{this.state.avgBuyIn}</div>
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
