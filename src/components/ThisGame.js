import React from 'react';
import {
    Button, Card, CardBody, Col, Collapse, FormGroup,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader, Nav, NavItem, NavLink, Row, TabContent, TabPane,
} from "reactstrap";
import { connect } from "react-redux";
import * as _ from 'lodash';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import moment from "moment";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGamepad, faList } from '@fortawesome/free-solid-svg-icons';
import Hint from "./Hint";
import Games from "./Games";
import classnames from "classnames";
import { showNumber } from "../App";
import { MENU_SIZE, MENU_FONT } from './Home'

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
            players: 0,
            sumBuyIn: 0,
            sumBounty: 0,
            sumWon: 0,
            showFilter: false,
            filtered: false,
            onOpen: true,
            activeTab: 1,
        };

        this.toggle = this.toggle.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.updateDate = this.updateDate.bind(this);
        this.chart = this.chart.bind(this);
        this.showFilter = this.showFilter.bind(this);
        this.getData = this.getData.bind(this);
        this.toggleTab = this.toggleTab.bind(this);
    }

    toggleTab(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab,
            });
        }
    }

    toggle() {
        if (!this.state.modal) {
            this.setState({
                date: this.props.today,
                dateOk: true,
                activeTab: '1',
                onOpen: true,
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
        if (this.state.modal) {

            console.log("ThisGame getData", this.state.date);

            filteredUsers = [];
            const { users } = this.props.data;
            const date = new Date(this.state.date);
            let sum = 0;
            let sumOk;
            let avgBuyIn = 0;
            let sumBuyIn = 0;
            let sumBounty = 0;
            let sumWon = 0;

            if (this.state.dateOk && !_.isNil(users)) {

                for (let i in users) {
                    let user = { ...users[i] };

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
                        sumBounty = sumBounty + plainUser.bounty;
                        sumWon = sumWon + plainUser.won;
                        filteredUsers.push(plainUser);
                    }
                }
                avgBuyIn = showNumber(sumBuyIn / filteredUsers.length);
            }
            sumOk = sum === 0;
            if (_.isNil(avgBuyIn) || _.isNaN(avgBuyIn)) {
                avgBuyIn = 0;
            }

            if (this.state.onOpen && sumBuyIn < 1) {
                console.log("no games played today, goto game ", this.props.data.games[0].date);
                this.updateDate(null, this.props.data.games[0].date);
            }

            this.setState({
                sum,
                sumOk,
                avgBuyIn,
                players: filteredUsers.length,
                sumBuyIn,
                sumBounty,
                sumWon,
                filtered: this.state.date === this.props.today,
                onOpen: false,
            }, () => {
                this.chart(filteredUsers);
            });
        }
    }

    static formatTooltip(tooltip, x = this.x, points = this.points) {
        let s = `<b>${x}</b>`;
        points.forEach((point) => {
            if (point.series.name === "Total") {
                s += `<br/> <b>${point.series.name}: ${point.y}</b>`
            } else {
                s += `<br/>${point.series.name}: ${point.y}`
            }
        });
        return s;
    }

    chart(users) {
        users = _.sortBy(users, function (g) {
            return -g.total;
        });

        this.setState({
            options: {
                chart: {
                    type: 'spline',
                },
                title: {
                    text: 'Players',
                    style: {
                        fontWeight: 'bold',
                        display: 'none',
                    },
                },
                tooltip: {
                    shared: true,
                    useHTML: true,
                },
                yAxis: {
                    title: {
                        text: '',
                        display: 'none',
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
                    itemMarginBottom: 10,
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
                }, {
                    name: 'Avg Buy In',
                    type: 'line',
                    data: _.map(users, (u) => {
                        return -this.state.avgBuyIn
                    }),
                    dashStyle: "ShortDot",
                    color: '#007BFF',
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

    filter() {
        const { games } = this.props.data;
        return (
            <Collapse isOpen={this.state.showFilter}>
                <Card outline>
                    <CardBody>
                        <Row>
                            {_.isArray(games) ?
                                this.props.data.games.map((game, i) =>
                                    <Col xs={6} key={i}>
                                        <Button color={"link"} value={game.date} onClick={this.updateDate}>
                                            {moment(game.date).format('dd D.M.YY')}
                                        </Button>
                                    </Col>
                                ) : <div>No Games played </div>}
                        </Row>
                    </CardBody>
                </Card>
            </Collapse>)
    }

    render() {
        return (<div>
            <FontAwesomeIcon icon={faGamepad} onClick={this.toggle}
                style={{ fontSize: MENU_SIZE, color: this.props.isRed ? "#DC3545" :"black" }} />
            {_.isNil(this.props.noName) ? <div style={{ fontSize: MENU_FONT, color: this.props.isRed ? "#DC3545" :"black" }}>Game</div> : <span />}

            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}
                onKeyPress={this.handleKeyPress}
                onOpened={this.getData}
            >
                <ModalHeader toggle={this.toggle}>Game {moment(this.state.date).format('D.M.YY')}</ModalHeader>
                <ModalBody>
                    <Nav tabs>
                        <NavItem>
                            <NavLink
                                id={'game'} key={'game'}
                                className={classnames({ active: this.state.activeTab === '1' })}
                                onClick={() => {
                                    this.toggleTab('1');
                                }}
                            >
                                Single Game
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: this.state.activeTab === '2' })}
                                onClick={() => {
                                    this.toggleTab('2');
                                }}
                            >
                                All Games
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="1">
                            <div style={{ paddingLeft: "10px" }}>
                                <br />
                                <FormGroup style={{ marginLeft: "6px" }}>
                                    <Row style={{ align: "left" }}>
                                        <Col xs="12">
                                            <div onClick={this.showFilter}
                                                style={{ color: this.state.filtered ? "black" : "#007BFF" }}
                                            >
                                                <FontAwesomeIcon icon={faList} /> Last Games
                                            </div>
                                        </Col>
                                    </Row>
                                    {this.filter()}
                                    {this.state.sumOk ? '' :
                                        <div style={{
                                            color: "#DC3545",
                                            paddingTop: "12px",
                                        }}>
                                            <Hint sum={this.state.sum} won={this.state.sumWon}
                                                buyIn={this.state.sumBuyIn}
                                                bounty={this.state.sumBounty} />
                                        </div>}
                                    <Row style={{ paddingTop: "12px" }}>
                                        <Col xs="5">
                                            <b>Date</b>
                                        </Col>
                                        <Col xs="7">
                                            <div>{moment(this.state.date).format('dddd DD.MM.YYYY')}</div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="5">
                                            <b>Pot size</b>
                                        </Col>
                                        <Col xs="7">
                                            <div>{this.state.sumBuyIn - this.state.sumBounty}</div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="5">
                                            <b>Bounty's</b>
                                        </Col>
                                        <Col xs="7">
                                            <div>{this.state.sumBounty}</div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="5">
                                            <b>Players</b>
                                        </Col>
                                        <Col xs="7">
                                            <div>{this.state.players}</div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="5">
                                            <b>Avg Buy In</b>
                                        </Col>
                                        <Col xs="7">
                                            <div>{this.state.avgBuyIn}</div>
                                        </Col>
                                    </Row>
                                </FormGroup>
                                <br />
                                <Row>
                                    <Col>
                                        <HighchartsReact
                                            style={{ visibility: this.state.dateOk ? 'visible' : 'hidden' }}
                                            highcharts={Highcharts}
                                            options={this.state.options}
                                        />
                                    </Col>
                                </Row>
                            </div>
                        </TabPane>
                    </TabContent>
                    <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="2">
                            <br />
                            <Games games={this.props.data.games} />
                        </TabPane>
                    </TabContent>
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
