import React from 'react';
import {
    Button,
    ButtonGroup,
    Card,
    CardBody,
    CardFooter,
    Col,
    Collapse, Dropdown, DropdownItem, DropdownMenu, DropdownToggle,
    FormGroup,
    Input,
    InputGroup,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Nav,
    NavItem,
    NavLink,
    Row,
    TabContent,
    TabPane
} from "reactstrap";
import {connect} from "react-redux";
import * as _ from 'lodash';
import classnames from 'classnames';
import Statistic from "./Statistic";
import GameDetail from "./GameDetail";
import moment from "moment/moment";
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import HC_more from 'highcharts/highcharts-more' //module

import {showNumber} from '../App';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrophy, faFilter, faChartBar, faList, faChartPie, faChartLine} from '@fortawesome/free-solid-svg-icons'

let filteredUsers = [];
let empty = {name: '', won: 0, buyIn: 0, bounty: 0, date: ''};

const SPIDER = "SPIDER";
const PIE = "PIE";
const COLUMN = "COLUMN";

const TOTAL = "Total";
const WON = "Won";
const BUYIN = "BuyIn";
const BOUNTY = "Bounty";
const PLAYED = "Played";
const HERO = "Hero";

class GeneralStatistic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            fromDate: '',
            toDate: '',
            dateOk: true,
            activeTab: '1',
            filteredGames: [],
            groupChart: {},
            totalChart: {},
            sumWon: 0,
            sumBuyIn: 0,
            sumTotal: 0,
            sumBounty: 0,
            avgWon: 0,
            avgBuyIn: 0,
            avgTotal: 0,
            avgBounty: 0,
            maxBuyIn: {...empty},
            maxWon: {...empty},
            maxTotal: {...empty},
            maxBounty: {...empty},
            popoverOpen: false,
            showFilter: false,
            filtered: false,
            getAvg: false,
            dates: [],
            filteredUsers: [],
            usersButtons: [],
            avgPlayerPerGame: 0,
            userPercent: [],
            dropdownOpen: false,
            attributeToShow: TOTAL,
            useChart: true,
            chartType: COLUMN,
            useSpider: false,
        };

        this.toggle = this.toggle.bind(this);
        this.toggleDetail = this.toggleDetail.bind(this);
        this.toggleTab = this.toggleTab.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.updateFormDate = this.updateFormDate.bind(this);
        this.updateToDate = this.updateToDate.bind(this);
        this.init = this.init.bind(this);
        this.last3m = this.last3m.bind(this);
        this.last6m = this.last6m.bind(this);
        this.lastYear = this.lastYear.bind(this);
        this.this12m = this.this12m.bind(this);
        this.showFilter = this.showFilter.bind(this);
        this.resetFilter = this.resetFilter.bind(this);
        this.setSum = this.setSum.bind(this);
        this.setAvg = this.setAvg.bind(this);
        this.userFilter = this.userFilter.bind(this);
        this.historyChart = this.historyChart.bind(this);
        this.usersAll = this.usersAll.bind(this);
        this.usersPercentFilter = this.usersPercentFilter.bind(this);
        this.getData = this.getData.bind(this);
        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.getGroupChart = this.getGroupChart.bind(this);
        this.getPieChart = this.getPieChart.bind(this);
        this.getSpiderChart = this.getSpiderChart.bind(this);
        this.togglePieChart = this.togglePieChart.bind(this);
    }

    toggleTab(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab,
                showFilter: false,
            });
        }
    }

    toggle() {
        if (!this.state.modal) {
            this.setState({
                    toDate: this.props.today,
                    fromDate: '2018-01-01',
                    dateOk: true,
                    activeTab: '1',
                    showFilter: false,
                    getAvg: false,
                    reload: false,
                    modal: true,
                    useChart: true,
                    chartType: COLUMN,
                    attributeToShow: TOTAL,
                }, () =>
                    this.this12m()
            );
        } else {
            this.setState({
                modal: false,
            });
        }
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

            console.log("GeneralStatistic getData");

            this.init();
            const {users} = this.props.data;
            const from = new Date(this.state.fromDate);
            const to = new Date(this.state.toDate);
            let maxWon = {...empty};
            let maxBuyIn = {...empty};
            let maxTotal = {...empty};
            let maxBounty = {...empty};
            let sumWon = 0;
            let sumBuyIn = 0;
            let sumTotal = 0;
            let sumBounty = 0;
            let avgWon = 0;
            let avgBuyIn = 0;
            let avgTotal = 0;
            let avgBounty = 0;
            let counter = 0;
            let dates = [];
            let usersButtons = [];
            let avgPlayerPerGame = 0;
            let userPercent = [];
            let filtered;

            let d = new Date(this.props.today);
            filtered = !(this.state.fromDate === d.getFullYear() + '-01-01' && this.state.toDate === d.getFullYear() + '-12-31' && this.state.filteredUsers.length < 1);

            if (this.state.dateOk && !_.isNil(users)) {

                for (let user in users) {
                    for (let game in users[user].games) {
                        if (users[user].games[game].buyIn > 0 && from <= new Date(users[user].games[game].date) && to >= new Date(users[user].games[game].date)) {
                            dates.push(users[user].games[game].date);
                        }
                    }
                }
                dates = _.uniqBy(dates);

                for (let i in users) {
                    let user = {...users[i]};

                    usersButtons.push(user);
                    if (_.indexOf(this.state.filteredUsers, user.name) >= 0) {
                        user.games = _.filter(user.games, function (g) {
                            if (_.isNil(g) || _.isNil(g.date)) {
                                return false;
                            }
                            return (from <= new Date(g.date) && to >= new Date(g.date)) && g.buyIn > 0;
                        });
                        if (user.games.length > 0) {
                            userPercent.push({
                                name: user.name,
                                percent: Math.round((user.games.length / dates.length) * 100)
                            });
                        }
                        continue;
                    }
                    user.games = _.filter(user.games, function (g) {
                        if (_.isNil(g) || _.isNil(g.date)) {
                            return false;
                        }
                        return (from <= new Date(g.date) && to >= new Date(g.date)) && g.buyIn > 0;
                    });

                    user.games = _.sortBy(user.games, function (g) {
                        return g.date;
                    });
                    if (user.games.length > 0) {

                        counter = counter + user.games.length;
                        let maxW = _.maxBy(user.games, function (o) {
                            return o.won
                        });

                        if (maxWon.won < maxW.won) {
                            maxWon = maxW;
                            maxWon.name = user.name;
                        }

                        let maxB = _.maxBy(user.games, function (o) {
                            return o.buyIn
                        });

                        if (maxBuyIn.buyIn < maxB.buyIn) {
                            maxBuyIn = maxB;
                            maxBuyIn.name = user.name;
                        }

                        let maxBo = _.maxBy(user.games, function (o) {
                            return o.bounty
                        });

                        if (maxBounty.bounty < maxBo.bounty) {
                            maxBounty = maxBo;
                            maxBounty.name = user.name;
                        }

                        let maxT = _.maxBy(user.games, function (o) {
                            return o.won - o.buyIn
                        });

                        if (maxTotal.won + maxTotal.bounty - maxTotal.buyIn < maxT.won + maxT.bounty - maxT.buyIn) {
                            maxTotal = maxT;
                            maxTotal.name = user.name;
                        }

                        user.won = _.sumBy(user.games, function (o) {
                            return o.won
                        });

                        user.bounty = _.sumBy(user.games, function (o) {
                            return o.bounty
                        });

                        user.buyIn = _.sumBy(user.games, function (o) {
                            return o.buyIn
                        });

                        user.played = user.games.length;

                        avgPlayerPerGame = avgPlayerPerGame + (user.played / dates.length);

                        sumWon = sumWon + user.won;

                        sumBuyIn = sumBuyIn + user.buyIn;

                        sumBounty = sumBounty + user.bounty;

                        user.total = _.sumBy(user.games, function (o) {
                            return o.won + o.bounty - o.buyIn
                        });

                        sumTotal = sumTotal + user.total;

                        user.hero = (user.played * 5) + (user.won * 3) - (user.total * 2) + (user.buyIn * 5) + (user.bounty * 5);

                        userPercent.push({
                            name: user.name,
                            percent: Math.round((user.games.length / dates.length) * 100)
                        });

                        if (this.state.getAvg) {
                            user.won = Math.round(user.won / user.games.length);
                            user.bounty = Math.round(user.bounty / user.games.length);
                            user.total = Math.round(user.total / user.games.length);
                            user.buyIn = Math.round(user.buyIn / user.games.length);
                            user.played = Math.round((user.played / dates.length) * 100);
                            user.hero = Math.round(user.hero / (user.games.length));
                        }

                        filteredUsers.push(user);
                    }
                }
                console.log("users", filteredUsers);

                avgWon = Math.round(sumWon / counter);
                avgBuyIn = Math.round(sumBuyIn / counter);
                avgBounty = Math.round(sumBounty / counter);
                avgTotal = Math.round(sumTotal / counter);

                this.setState({
                    maxWon,
                    maxBuyIn,
                    maxTotal,
                    maxBounty,
                    sumBuyIn,
                    sumTotal,
                    sumWon,
                    sumBounty,
                    avgBuyIn,
                    avgWon,
                    avgTotal,
                    avgBounty,
                    dates,
                    usersButtons,
                    avgPlayerPerGame,
                    userPercent,
                    filtered,
                });
            }
            this.historyChart(filteredUsers);
        }
    }


    init() {
        filteredUsers = [];
        this.setState({
            sumWon: 0,
            sumBuyIn: 0,
            sumTotal: 0,
            sumBounty: 0,
            avgWon: 0,
            avgBuyIn: 0,
            avgBounty: 0,
            avgTotal: {...empty},
            maxBuyIn: {...empty},
            maxWon: {...empty},
            maxBounty: {...empty},
            maxTotal: 0,
            filteredGames: [],
            usersBounty: [],
            usersWon: [],
            usersBuyIn: [],
            usersPlayed: [],
            usersHero: [],
        });
    }

    updateFormDate(evt) {
        this.setState({
                fromDate: evt.target.value,
            }, () => {
                if (this.state.fromDate === '' || new Date(this.state.toDate) < new Date(this.state.fromDate)) {
                    this.setState({
                        dateOk: false,
                    }, () => {
                        this.getData();
                    });
                } else {
                    this.setState({
                        dateOk: true,
                    }, () => {
                        this.getData();
                    });
                }
            }
        );
    }

    updateToDate(evt) {
        this.setState({
                toDate: evt.target.value,
            }, () => {
                if (this.state.toDate === '' || new Date(this.state.toDate) < new Date(this.state.fromDate)) {
                    this.setState({
                        dateOk: false,
                    }, () => {
                        this.getData();
                    });
                } else {
                    this.setState({
                        dateOk: true,
                    }, () => {
                        this.getData();
                    });
                }
            }
        );
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps !== this.props) {
            this.getData();
        }
    }

    componentDidMount() {
        HC_more(Highcharts); //init module
    }

    toggleDetail() {
        this.setState({
            popoverOpen: !this.state.popoverOpen
        });
    }

    last3m() {
        const months = 3;
        let d = new Date(this.props.today);
        d.setMonth(d.getMonth() - months);
        this.setState({
            fromDate: moment(d).format('YYYY-MM-DD'),
            toDate: this.props.today,
            dateOk: true,
        }, () => {
            this.getData();
        })
    }

    last6m() {
        const months = 6;
        let d = new Date(this.props.today);
        d.setMonth(d.getMonth() - months);
        this.setState({
            fromDate: moment(d).format('YYYY-MM-DD'),
            toDate: this.props.today,
            dateOk: true,
        }, () => {
            this.getData();
        })
    }


    lastYear() {
        let d = new Date(this.props.today);
        this.setState({
            fromDate: (d.getFullYear() - 1) + '-01-01',
            toDate: (d.getFullYear() - 1) + '-12-31',
            dateOk: true,
        }, () => {
            this.getData();
        })
    }

    this12m() {
        let d = new Date(this.props.today);
        this.setState({
            fromDate: d.getFullYear() + '-01-01',
            toDate: d.getFullYear() + '-12-31',
            dateOk: true,
        }, () => {
            this.getData();
        })
    }

    usersAll() {
        this.setState({
            filteredUsers: [],
        }, () => {
            this.getData();
        });
    }


    usersPercentFilter(evt) {
        let filteredUsers;
        let value = 25;

        if (!_.isNil(this.state.userPercent) && this.state.userPercent.length > 0) {
            if (!_.isNil(evt) && !_.isNil(evt.target)) {
                value = evt.target.value;
            }

            let playedLess = _.filter(this.state.userPercent, function (u) {
                return u.percent < value;
            });

            filteredUsers = _.map(playedLess, 'name');

            console.log('filter players', filteredUsers);
        } else {
            const games = this.props.data.games.length;
            filteredUsers = _.map(_.filter(this.props.data.users, (u) => {
                return u.gamesPlayed < (games * value / 100)
            }), 'name');
        }

        console.log('filter players with less than ', value, '%', filteredUsers);

        this.setState({
            filteredUsers,
        }, () => {
            this.getData();
        });
    }

    showFilter() {
        this.setState({
            showFilter: !this.state.showFilter,
        })
    }

    resetFilter() {
        this.setState({
            showFilter: false,
            filteredUsers: [],
        }, () => {
            this.this12m();
        })
    }

    filter() {
        return (
            <Collapse isOpen={this.state.showFilter}>
                <Card outline>
                    <CardBody>
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
                        <Row>
                            <Col xs={3} style={{paddingRight: "0.2em", paddingLeft: "1em"}}>
                                <Button style={{fontSize: "0.8em", paddingRight: "0px", paddingLeft: "0px"}}
                                        size="sm" color="link"
                                        onClick={this.last3m}
                                >
                                    3 Month
                                </Button>
                            </Col>
                            <Col xs={3} style={{paddingRight: "0.2em", paddingLeft: "0.2em"}}>
                                <Button style={{fontSize: "0.8em", paddingRight: "0px", paddingLeft: "0px"}}
                                        size="sm"
                                        color="link"
                                        onClick={this.last6m}
                                >
                                    6 Month
                                </Button>
                            </Col>
                            <Col xs={3} style={{paddingRight: "1em", paddingLeft: "0.2em"}}>
                                <Button style={{fontSize: "0.8em", paddingRight: "0px", paddingLeft: "0px"}}
                                        size="sm"
                                        color="link"
                                        onClick={this.this12m}
                                >
                                    This Year
                                </Button>
                            </Col>
                            <Col xs={3} style={{paddingRight: "0.2em", paddingLeft: "0.2em"}}>
                                <Button style={{fontSize: "0.8em", paddingRight: "0px", paddingLeft: "0px"}}
                                        size="sm"
                                        color="link"
                                        onClick={this.lastYear}
                                >
                                    Last Year
                                </Button>
                            </Col>
                        </Row>
                        <Row style={{paddingTop: "12px"}}>
                            <Col>User filter</Col>
                        </Row>
                        <Row>
                            <Col xs={3}>
                                <Button style={{fontSize: "0.8em"}} size="sm" color="link"
                                        onClick={this.usersAll}>All</Button>
                            </Col>
                            <Col xs={3}>
                                <Button style={{fontSize: "0.8em"}} size="sm" color="link" value={25}
                                        onClick={this.usersPercentFilter}>>25%</Button>
                            </Col>
                            <Col xs={3}>
                                <Button style={{fontSize: "0.8em"}} size="sm" color="link" value={50}
                                        onClick={this.usersPercentFilter}>>50%</Button>
                            </Col>
                            <Col xs={3}>
                                <Button style={{fontSize: "0.8em"}} size="sm" color="link" value={75}
                                        onClick={this.usersPercentFilter}>>75%</Button>
                            </Col>
                        </Row>
                        <Row style={{paddingTop: "6px"}}>
                            {!this.state.reload ?
                                this.state.usersButtons.map((user, i) =>
                                    <Col xs={4} style={{paddingTop: "6px"}} key={i}>
                                        <Button size={"sm"} outline color={"primary"} value={user.name}
                                                active={!this.isFiltered(user)}
                                                onClick={this.userFilter}
                                                key={"filter" + user.name}
                                                style={{fontSize: "0.8em"}}
                                        >
                                            {user.name}
                                        </Button>
                                    </Col>
                                ) : <div/>}
                        </Row>
                    </CardBody>
                    <CardFooter>
                        <Button color="link" size="sm" block style={{padding: "0 0 0 0"}}
                                onClick={this.showFilter}>Apply</Button>
                    </CardFooter>
                </Card>
            </Collapse>)
    }


    isFiltered(user) {
        return _.indexOf(this.state.filteredUsers, user.name) >= 0 || _.isNil(user.buyIn);
    }

    userFilter(evt) {
        let found = _.indexOf(this.state.filteredUsers, evt.target.value);

        if (found >= 0) {
            this.state.filteredUsers.splice(found, 1);
        } else {
            this.state.filteredUsers.push(evt.target.value);
        }
        this.getData();

        this.setState({
            reload: true,
        }, () => {
            this.setState({
                reload: false,
            })
        })
    }

    setAvg() {
        this.setState({
            getAvg: true,
            showFilter: false,
        }, () => {
            this.getData();
        })
    }

    setSum() {
        this.setState({
            getAvg: false,
            showFilter: false,
        }, () => {
            this.getData();
        })
    }

    getGroupChart(users) {
        const {attributeToShow} = this.state;
        return ({
            chart: {
                type: 'spline',
            },
            title: {
                text: attributeToShow,
                style: {
                    display: 'none'
                },
            },
            yAxis: [{ // Primary yAxis
                title: {
                    style: {
                        display: 'none'
                    },
                }
            }, { // Secondary yAxis
                title: {
                    style: {
                        display: 'none'
                    },
                },
                opposite: true
            }, { // 3 yAxis
                title: {
                    style: {
                        display: 'none'
                    },
                },
                opposite: true
            }],
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
                    return -u.buyIn
                }),
                lineWidth: 1,
                color: '#DC3545',
                visible: attributeToShow === BUYIN || attributeToShow === TOTAL,
                marker: {
                    enabled: false,
                },
            }, {
                name: BOUNTY,
                stack: 'data',
                type: 'column',
                data: _.map(users, (u) => {
                    return u.bounty
                }),
                lineWidth: 1,
                color: '#155724',
                visible: attributeToShow === BOUNTY || attributeToShow === TOTAL,
                marker: {
                    enabled: false,
                },
            }, {
                name: WON,
                stack: 'data',
                type: 'column',
                data: _.map(users, (u) => {
                    return u.won
                }),
                lineWidth: 1,
                color: '#28A745',
                visible: attributeToShow === WON || attributeToShow === TOTAL,
                marker: {
                    enabled: false,
                },
            }, {
                name: TOTAL,
                type: 'spline',
                data: _.map(users, (u) => {
                    return u.total
                }),
                color: '#6C757D',
                visible: attributeToShow === TOTAL,
                marker: {
                    enabled: false,
                },
            }, {
                name: PLAYED,
                stack: '2',
                type: 'column',
                yAxis: 1,
                data: _.map(users, (u) => {
                    return u.played
                }),
                lineWidth: 1,
                color: '#FFC107',
                visible: attributeToShow === PLAYED,
                marker: {
                    enabled: false,
                },
            }, {
                name: HERO,
                stack: '3',
                yAxis: 2,
                type: 'column',
                data: _.map(users, (u) => {
                    return u.hero
                }),
                lineWidth: 1,
                color: '#2f7ed8',
                visible: attributeToShow === HERO,
                marker: {
                    enabled: false,
                },
            },
            ],
        })
    }

    getSpiderChart(users) {
        const {attributeToShow} = this.state;
        return ({
            chart: {
                type: 'line',
                polar: true
            },
            title: {
                text: attributeToShow,
                style: {
                    display: 'none'
                },
            },
            xAxis: [{
                categories: [TOTAL, WON, BUYIN, BOUNTY, PLAYED, HERO]
            },
            ],
            legend: {
                itemMarginBottom: 12,
                itemStyle: {
                    fontSize: '1.2em',
                },
            },
            series: this.spiderData(users, attributeToShow),
        })
    }

    spiderData(users, attributeToShow) {
        const data = [];
        for (let i in users) {
            const u = users[i];
            if (attributeToShow === HERO) {
                data.push({name: u.name, data: [u.total, u.won, u.buyIn, u.bounty, u.played, u.hero]});
            } else if (attributeToShow === PLAYED) {
                data.push({name: u.name, data: [u.total, u.won, u.buyIn, u.bounty, u.played]});
            } else {
                data.push({name: u.name, data: [u.total, u.won, u.buyIn, u.bounty]});
            }
        }
        return data;
    }

    getPieChart(users) {
        return ({
            chart: {
                type: 'pie'
            },
            title: {
                text: this.state.attributeToShow,
                style: {
                    display: 'none'
                },
            },
            tooltip: {
                pointFormat: `<div>Percent: <b>{point.percentage:.1f}%</b> </div> <br/>` +
                    `<div>${this.state.attributeToShow}: <b>{point.y}</b> </div> <br/>`
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            legend: {
                itemMarginBottom: 12,
                itemStyle: {
                    fontSize: '1.2em',
                },
            },
            series: [{
                name: this.state.attributeToShow,
                data: this.pieData(users),
            }],
        })
    }

    pieData(users) {
        const data = [];
        for (let i in users) {
            const u = users[i];
            const y = u[this.equaliseFont(this.state.attributeToShow)];
            if (!_.isNil(y)) {
                data.push({name: u.name, y});
            }
        }
        return data;
    }

    historyChart(users) {
        users = _.sortBy(users, function (g) {
            return -g.total;
        });
        this.setState({
            totalChart: {
                chart: {
                    type: 'spline',
                },
                title: {
                    text: TOTAL,
                    style: {
                        fontWeight: 'bold',
                        display: 'none'
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
                xAxis: {
                    type: "datetime",
                    dateTimeLabelFormats: {
                        date: '%e.%b.%Y'
                    }

                },
                legend: {
                    itemMarginBottom: 12,
                    itemStyle: {
                        fontSize: '1.2em',
                    },
                },
                series: this.mapUsersToSeries(users),
            }
        });
    }

    summariseData(games) {
        const summarised = [];
        if (!_.isNil(games) || games.length > 0) {
            let lastTotal = 0;
            for (let i in games) {
                const total = this.getTotalOfGame(games[i]);
                const value = total + lastTotal;
                summarised.push([moment.utc(games[i].date).valueOf(), showNumber(value)]);
                lastTotal += total
            }
        }
        return summarised;
    }

    getTotalOfGame(game) {
        if (!_.isNil(game)) {
            return game.won + game.bounty - game.buyIn
        }
    }


    mapUsersToSeries(users) {
        const data = [];
        for (let i in users) {
            const user = users[i];
            data.push({
                name: user.name,
                data: this.summariseData(user.games),
                marker: {enabled: false},
            })
        }
        return data;
    }

    toggleDropdown() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        })
    }

    equaliseFont(text) {
        return text.charAt(0).toLowerCase() + text.substring(1);
    }

    togglePieChart(chartType) {
        this.setState({
            useChart: false,
            chartType: COLUMN
        }, () => {
            this.forceUpdate();
            this.setState({
                useChart: true,
                chartType
            })
        })
    }

    render() {
        const {sumBuyIn, avgBuyIn, maxWon, maxBuyIn, maxBounty, maxTotal, getAvg, dates, avgPlayerPerGame, attributeToShow, useChart, chartType} = this.state;
        const sortedUsers = _.sortBy(filteredUsers, user => {
            return -user[this.equaliseFont(attributeToShow)]
        });

        let chartOptions;
        switch (chartType) {
            case PIE:
                chartOptions = this.getPieChart(sortedUsers);
                break;
            case SPIDER:
                chartOptions = this.getSpiderChart(sortedUsers);
                break;
            case COLUMN:
                chartOptions = this.getGroupChart(sortedUsers);
                break;
            default:
                chartOptions = this.getGroupChart(sortedUsers);
                break;
        }
        const chart = (
            <div style={{paddingTop: "10px"}}>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={chartOptions}
                />
            </div>
        );
        const list = (
            <div style={{paddingTop: "12px", paddingLeft: "10px"}}>
                {sortedUsers.map((user, i) => (
                    <TopList name={attributeToShow} user={user}
                             value={user[this.equaliseFont(attributeToShow)]}
                             from={this.state.fromDate} to={this.state.toDate} key={i}/>
                ))}
            </div>
        );

        return (

            <div>
                <FontAwesomeIcon icon={faTrophy} onClick={this.toggle} size="lg"/>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}
                       onKeyPress={this.handleKeyPress} onOpened={this.usersPercentFilter}
                >
                    <ModalHeader toggle={this.toggle}>Top List</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Row>
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
                        </FormGroup>
                        <Nav tabs>
                            <NavItem>
                                <NavLink
                                    id={'total'} key={'total'}
                                    className={classnames({active: this.state.activeTab === '1'})}
                                    onClick={() => {
                                        this.toggleTab('1');
                                    }}
                                >
                                    Ranking
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames({active: this.state.activeTab === '9'})}
                                    onClick={() => {
                                        this.toggleTab('9');
                                    }}
                                >
                                    History
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames({active: this.state.activeTab === '7'})}
                                    onClick={() => {
                                        this.toggleTab('7');
                                    }}
                                >
                                    Peaks
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="1">
                                <Row style={{paddingTop: "6px"}}>
                                    <Col xs={3}>
                                        <ButtonGroup style={{paddingTop: "4px"}}>
                                            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
                                                <DropdownToggle caret color="primary" size={"sm"}>
                                                    {this.state.attributeToShow}
                                                </DropdownToggle>
                                                <DropdownMenu>
                                                    <DropdownItem
                                                        onClick={() => this.setState({attributeToShow: TOTAL})}
                                                    >
                                                        Total
                                                    </DropdownItem>
                                                    <DropdownItem
                                                        onClick={() => this.setState({attributeToShow: WON})}
                                                    >
                                                        Won
                                                    </DropdownItem>
                                                    <DropdownItem
                                                        onClick={() => this.setState({attributeToShow: BOUNTY})}
                                                    >
                                                        Bounty
                                                    </DropdownItem>
                                                    <DropdownItem
                                                        onClick={() => this.setState({attributeToShow: BUYIN})}
                                                    >
                                                        BuyIn
                                                    </DropdownItem>
                                                    <DropdownItem
                                                        onClick={() => this.setState({attributeToShow: PLAYED})}
                                                    >
                                                        Played
                                                    </DropdownItem>
                                                    <DropdownItem
                                                        onClick={() => this.setState({attributeToShow: HERO})}
                                                    >
                                                        Hero
                                                    </DropdownItem>
                                                </DropdownMenu>
                                            </Dropdown>
                                        </ButtonGroup>
                                    </Col>
                                    <Col xs={3}>
                                        <ButtonGroup style={{paddingTop: "4px"}}>
                                            <Button size={"sm"} outline color={"primary"} active={!getAvg}
                                                    onClick={this.setSum}>
                                                Σ
                                            </Button>
                                            <Button size={"sm"} outline color="primary" active={getAvg}
                                                    onClick={this.setAvg}>
                                                Ø
                                            </Button>
                                        </ButtonGroup>
                                    </Col>
                                    <Col xs={5} style={{paddingLeft: "4px"}}>
                                        <ButtonGroup style={{paddingTop: "4px"}}>
                                            <Button size={"sm"} outline color="primary"
                                                    active={useChart && chartType === COLUMN}
                                                    onClick={() => this.togglePieChart(COLUMN)}>
                                                <FontAwesomeIcon icon={faChartBar} size={"1x"}/>
                                            </Button>
                                            <Button size={"sm"} outline color={"primary"}
                                                    active={useChart && chartType === PIE}
                                                    onClick={() => this.togglePieChart(PIE)}>
                                                <FontAwesomeIcon icon={faChartPie} size={"1x"}/>
                                            </Button>
                                            <Button size={"sm"} outline color={"primary"}
                                                    active={useChart && chartType === SPIDER}
                                                    onClick={() => this.togglePieChart(SPIDER)}>
                                                <FontAwesomeIcon icon={faChartLine} size={"1x"}/>
                                            </Button>
                                            <Button size={"sm"} outline color={"primary"}
                                                    active={!useChart}
                                                    onClick={() => this.setState({useChart: false, chartType: COLUMN})}>
                                                <FontAwesomeIcon icon={faList} size={"1x"}/>
                                            </Button>
                                        </ButtonGroup>
                                    </Col>
                                    <Col xs={1}/>
                                </Row>
                                {useChart ? chart : list}
                            </TabPane>
                        </TabContent>
                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="7">
                                <br/>
                                <GameDetail game={maxBuyIn} name={BUYIN} value={maxBuyIn.buyIn}/>
                                <GameDetail game={maxWon} name={WON} value={maxWon.won}/>
                                <GameDetail game={maxBounty} name={BOUNTY} value={maxBounty.bounty}/>
                                <GameDetail game={maxTotal} name={TOTAL}
                                            value={maxTotal.won + maxTotal.bounty - maxTotal.buyIn}/>
                                <br/>
                                <Row style={{paddingTop: "12px"}}>
                                    <Col xs={6}>
                                        <b>Sum</b> of all Buy In's
                                    </Col>
                                    <Col xs={6}>
                                        {showNumber(sumBuyIn)}
                                    </Col>
                                </Row>
                                <Row style={{paddingTop: "12px"}}>
                                    <Col xs={6}>
                                        <b>Played</b> games
                                    </Col>
                                    <Col xs={6}>
                                        {dates.length}
                                    </Col>
                                </Row>
                                <Row style={{paddingTop: "12px"}}>
                                    <Col xs={6}>
                                        <b>Players / Game</b>
                                    </Col>
                                    <Col xs={6}>
                                        {Math.round(avgPlayerPerGame)}
                                    </Col>
                                </Row>
                                <Row style={{paddingTop: "12px"}}>
                                    <Col xs={6}>
                                        <b>Average</b> Buy In / Person
                                    </Col>
                                    <Col xs={6}>
                                        {avgBuyIn}
                                    </Col>
                                </Row>
                            </TabPane>
                        </TabContent>
                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="9">
                                <br/>
                                <HighchartsReact
                                    style={{visibility: this.state.dateOk ? 'visible' : 'hidden'}}
                                    highcharts={Highcharts}
                                    options={this.state.totalChart}
                                />
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

class TopList extends React.Component {
    render() {
        const {name, user, value, from, to, i, extension} = this.props;
        return (
            <Row key={i}>
                <Col xs={4}>{user.name}</Col>
                <Col xs={5}>{name}: {showNumber(value)}{extension}</Col>
                <Col xs={1}>
                    <Statistic user={user}
                               fromDate={from}
                               today={to}
                               toggle={false}
                               resetToggle={(v) => (v)}
                    /></Col>
                <Col xs={2}/>
            </Row>
        );
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
