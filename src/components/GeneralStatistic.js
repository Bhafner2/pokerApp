import React from 'react';
import {
    Button,
    ButtonGroup,
    Card,
    CardBody,
    CardFooter,
    Col,
    Collapse,
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
import {showNumber} from '../App';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrophy, faFilter} from '@fortawesome/free-solid-svg-icons'

let filteredUsers = [];
let empty = {name: '', won: 0, buyIn: 0, bounty: 0, date: ''};

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
            options: {},
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
            usersTop: [],
            usersBounty: [],
            usersWon: [],
            usersBuyIn: [],
            usersPlayed: [],
            usersHero: [],
            popoverOpen: false,
            showFilter: false,
            filtered: false,
            getAvg: false,
            dates: [],
            filteredUsers: [],
            usersButtons: [],
            avgPlayerPerGame: 0,
            userPercent: []
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
        this.last12m = this.last12m.bind(this);
        this.this12m = this.this12m.bind(this);
        this.showFilter = this.showFilter.bind(this);
        this.resetFilter = this.resetFilter.bind(this);
        this.setSum = this.setSum.bind(this);
        this.setAvg = this.setAvg.bind(this);
        this.userFilter = this.userFilter.bind(this);
        this.chart = this.chart.bind(this);
        this.usersAll = this.usersAll.bind(this);
        this.usersPercentFilter = this.usersPercentFilter.bind(this);
        this.getData = this.getData.bind(this);
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
            }, () => {
                /*
                                this.usersPercentFilter()
                */
            });
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
        let usersBuyIn = [];
        let usersPlayed = [];
        let usersHero = [];
        let usersWon = [];
        let usersTop = [];
        let usersBounty = [];
        let dates = [];
        let usersButtons = [];
        let avgPlayerPerGame = 0;
        let userPercent = [];

        if (this.state.fromDate === '2018-01-01' && this.state.toDate === this.props.today && this.state.filteredUsers.length < 1) {
            this.setState({
                filtered: false,
            })
        } else {
            this.setState({
                filtered: true,
            })
        }
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

            usersTop = _.sortBy(filteredUsers, function (o) {
                return -o.total
            });
            usersWon = _.sortBy(filteredUsers, function (o) {
                return -o.won
            });
            usersBounty = _.sortBy(filteredUsers, function (o) {
                return -o.bounty
            });
            usersBuyIn = _.sortBy(filteredUsers, function (o) {
                return -o.buyIn
            });
            usersPlayed = _.sortBy(filteredUsers, function (o) {
                return -o.played
            });
            usersHero = _.sortBy(filteredUsers, function (o) {
                return -o.hero
            });

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
                usersTop,
                usersWon,
                usersBounty,
                usersBuyIn,
                usersPlayed,
                usersHero,
                dates,
                usersButtons,
                avgPlayerPerGame,
                userPercent,
            });
        }
        this.chart(filteredUsers);
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
            usersTop: [],
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


    last12m() {
        const months = 12;
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
        let value = 25;
        if (!_.isNil(evt) && !_.isNil(evt.target)) {
            value = evt.target.value;
        }

        console.log('filter players with less than ', value, '%');

        let playedLess = _.filter(this.state.userPercent, function (u) {
            return u.percent < value;
        });

        let filteredUsers = _.map(playedLess, 'name');

        console.log('filter players', filteredUsers);

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
            fromDate: '2018-01-01',
            toDate: this.props.today,
            filteredUsers: [],
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
                            <Col xs={3} style={{paddingRight: "0.2em", paddingLeft: "0.2em"}}>
                                <Button style={{fontSize: "0.8em", paddingRight: "0px", paddingLeft: "0px"}}
                                        size="sm"
                                        color="link"
                                        onClick={this.last12m}
                                >
                                    12 Month
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

    chart(users) {
        users = _.sortBy(users, function (g) {
            return -g.total;
        });

        this.setState({
            options: {
                chart: {
                    height: 300,
                    type: 'spline',
                },
                title: {
                    text: 'Players',
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
                    name: 'Played',
                    stack: 'none',
                    type: 'column',
                    data: _.map(users, (u) => {
                        return u.played
                    }),
                    lineWidth: 1,
                    color: '#FFC107',
                    visible: false,
                    marker: {
                        enabled: false,
                    },
                },
                ],
            }
        });
    }

    render() {
        const {sumBuyIn, avgBuyIn, maxWon, maxBuyIn, maxBounty, maxTotal, usersTop, usersBounty, usersWon, usersBuyIn, usersPlayed, usersHero, getAvg, dates, avgPlayerPerGame} = this.state;

        return (<div>
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
                            <Col xs={5}>
                                <ButtonGroup style={{paddingTop: "4px"}}>
                                    <Button size={"sm"} outline color={"primary"} active={!getAvg}
                                            onClick={this.setSum}>
                                        Sum
                                    </Button>
                                    <Button size={"sm"} outline color="primary" active={getAvg}
                                            onClick={this.setAvg}>
                                        Avg
                                    </Button>
                                </ButtonGroup>
                            </Col>
                            <Col xs={1}/>
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
                                Total
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({active: this.state.activeTab === '2'})}
                                onClick={() => {
                                    this.toggleTab('2');
                                }}
                            >
                                Won
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({active: this.state.activeTab === '3'})}
                                onClick={() => {
                                    this.toggleTab('3');
                                }}
                            >
                                Bounty
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({active: this.state.activeTab === '4'})}
                                onClick={() => {
                                    this.toggleTab('4');
                                }}
                            >
                                BuyIn
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({active: this.state.activeTab === '5'})}
                                onClick={() => {
                                    this.toggleTab('5');
                                }}
                            >
                                Played
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({active: this.state.activeTab === '6'})}
                                onClick={() => {
                                    this.toggleTab('6');
                                }}
                            >
                                Chart
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
                        <NavItem>
                            <NavLink
                                className={classnames({active: this.state.activeTab === '8'})}
                                onClick={() => {
                                    this.toggleTab('8');
                                }}
                            >
                                Hero
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="8">
                            <br/>
                            {usersHero.map((user, i) => (
                                <TopList name={'index'} user={user} value={user.hero}
                                         from={this.state.fromDate} to={this.state.toDate} key={i}/>
                            ))}
                        </TabPane>
                    </TabContent>
                    <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="1">
                            <br/>
                            {usersTop.map((user, i) => (
                                <TopList name={'total'} user={user} value={user.total}
                                         from={this.state.fromDate} to={this.state.toDate} key={i}/>
                            ))}
                        </TabPane>
                    </TabContent>
                    <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="2">
                            <br/>

                            {usersWon.map((user, i) => (
                                <TopList name={'won'} user={user} value={user.won}
                                         from={this.state.fromDate} to={this.state.toDate} key={i}/>
                            ))}
                        </TabPane>
                    </TabContent>
                    <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="3">
                            <br/>

                            {usersBounty.map((user, i) => (
                                <TopList name={'bounty'} user={user} value={user.bounty}
                                         from={this.state.fromDate} to={this.state.toDate} key={i}/>
                            ))}
                        </TabPane>
                    </TabContent>
                    <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="4">
                            <br/>
                            {usersBuyIn.map((user, i) => (
                                <TopList name={'buyIn'} user={user} value={user.buyIn}
                                         from={this.state.fromDate} to={this.state.toDate} key={i}/>
                            ))}
                        </TabPane>
                    </TabContent>
                    <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="5">
                            <br/>
                            {usersPlayed.map((user, i) => (
                                <TopList name={'played'} user={user} value={user.played}
                                         extension={getAvg ? "%" : ""}
                                         from={this.state.fromDate} to={this.state.toDate} key={i}/>
                            ))}
                        </TabPane>
                    </TabContent>
                    <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="6">
                            <br/>
                            <HighchartsReact
                                style={{visibility: this.state.dateOk ? 'visible' : 'hidden'}}
                                highcharts={Highcharts}
                                options={this.state.options}
                            />
                        </TabPane>
                    </TabContent>
                    <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="7">
                            <br/>
                            <GameDetail game={maxBuyIn} name={'BuyIn'} value={maxBuyIn.buyIn}/>
                            <GameDetail game={maxWon} name={'Won'} value={maxWon.won}/>
                            <GameDetail game={maxBounty} name={'Bounty'} value={maxBounty.bounty}/>
                            <GameDetail game={maxTotal} name={'Total'}
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
                                    <b>Average</b> Buy In
                                </Col>
                                <Col xs={6}>
                                    {avgBuyIn}
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
                               today={to}/></Col>
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
