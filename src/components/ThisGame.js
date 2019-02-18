import React from 'react';
import {
    Button, Card, CardBody, Col, Collapse, FormGroup,
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
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faGamepad, faList} from '@fortawesome/free-solid-svg-icons';

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
            sumBounty: 0,
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
        this.getData = this.getData.bind(this);
    }

    toggle() {
        if (!this.state.modal) {
            this.setState({
                date: this.props.today,
                dateOk: true,
                activeTab: '1',
                onOpen: true,
            }, () => {
                /*
                                this.getData()
                */
            });
        }
        this.setState({
            modal: !this.state.modal,
        });
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

    async getData() {
        console.log("ThisGame getData");

        filteredUsers = [];
        const {users} = this.props.data;
        const date = new Date(this.state.date);
        let sum = 0;
        let sumOk;
        let avgBuyIn = 0;
        let sumBuyIn = 0;
        let sumBounty = 0;
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
            return -new Date(d)
        });

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
                    sumBuyIn = sumBuyIn + (plainUser.buyIn * -1) - plainUser.bounty;
                    sumBounty = sumBounty + plainUser.bounty;
                    filteredUsers.push(plainUser);
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
            sumBounty,
            dates,
            filtered: this.state.date === this.props.today,
            onOpen: false,
        });
        this.chart(filteredUsers);
    }

    chart(users) {

        users = _.sortBy(users, function (g) {
            return -g.total;
        });

        this.setState({
            options: {
                chart: {
                    height: 330,
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
                    itemMarginBottom: 12,
                    itemStyle: {
                        fontSize: '1.2em',
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
                    color: '#DC3545',
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
                    color: '#155724',
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
                    color: '#28A745',
                    marker: {
                        enabled: false,
                    },
                }, {
                    name: 'Total',
                    type: 'spline',
                    data: _.map(users, (u) => {
                        return u.total
                    }),
                    color: '#6C757D',
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
        return (
            <Collapse isOpen={this.state.showFilter}>
                <Card outline>
                    <CardBody>
                        <Row>
                            {this.state.dates.map((date, i) =>
                                <Col xs={6} key={i}>
                                    <Button color={"link"} value={date} onClick={this.updateDate}
                                    >{moment(date).format('dd D.M.YY')}</Button>
                                </Col>
                            )}
                        </Row>
                    </CardBody>
                </Card>
            </Collapse>)
    }

    render() {
        return (<div>
            <FontAwesomeIcon icon={faGamepad} onClick={this.toggle} size="lg"
                             style={{color: this.state.sumOk ? "" : "#DC3545"}}/>

            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}
                   onKeyPress={this.handleKeyPress}
                   onOpened={this.getData}
            >
                <ModalHeader toggle={this.toggle}>Game {moment(this.state.date).format('D.M.YY')}</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Row style={{align: "left"}}>
                            <Col xs="5">
                                <div onClick={this.showFilter}
                                     style={{color: this.state.filtered ? "black" : "#007BFF"}}
                                >
                                    <FontAwesomeIcon icon={faList}/> Last Games
                                </div>
                            </Col>
                        </Row>
                        {this.filter()}
                        {this.state.sumOk ? '' :
                            <div style={{
                                color: "#DC3545",
                                paddingTop: "12px",
                            }}>
                                <Row>
                                    <Col xs="5">
                                        <b>Checksum</b>
                                    </Col>
                                    <Col xs="2">
                                        {this.state.sum}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs="12" style={{fontSize: "0.8em"}}>
                                        the result of won + bounty - buyIn, should be 0
                                    </Col>
                                </Row>
                            </div>}
                        <Row style={{paddingTop: "12px"}}>
                            <Col xs="4">
                                <b>Date</b>
                            </Col>
                            <Col xs="7">
                                <div>{moment(this.state.date).format('dddd DD.MM.YYYY')}</div>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="4">
                                <b>Pot size</b>
                            </Col>
                            <Col xs="7">
                                <div>{this.state.sumBuyIn}</div>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="4">
                                <b>Bounty's</b>
                            </Col>
                            <Col xs="7">
                                <div>{this.state.sumBounty}</div>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="4">
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
