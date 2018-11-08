import React from 'react';
import {
    Button, ButtonGroup, Card, CardBody, CardFooter,
    Col, Collapse,
    FormGroup,
    Input, InputGroup,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader, Nav, NavItem, NavLink,
    Row, TabContent,
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
        this.setState({
            modal: !this.state.modal,
            toDate: this.props.today,
            fromDate: '2018-01-01',
            dateOk: true,
            activeTab: '1',
            showFilter: false,
            filteredUsers: [],
            getAvg: false,
            reload: false,
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

        console.log("users for generalstat", users);
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
                console.log("user for generalstat", user);

                usersButtons.push(user.name);
                if (_.indexOf(this.state.filteredUsers, user.name) >= 0) {
                    console.log("user will be filtered", user);
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
                        console.log('won', maxTotal.won)
                    }

                    let maxB = _.maxBy(user.games, function (o) {
                        return o.buyIn
                    });

                    if (maxBuyIn.buyIn < maxB.buyIn) {
                        maxBuyIn = maxB;
                        maxBuyIn.name = user.name;
                        console.log('buyIn', maxTotal.buyIn)
                    }

                    let maxBo = _.maxBy(user.games, function (o) {
                        return o.bounty
                    });

                    if (maxBounty.bounty < maxBo.bounty) {
                        maxBounty = maxBo;
                        maxBounty.name = user.name;
                        console.log('Bounty', maxBounty.bounty);
                    }

                    let maxT = _.maxBy(user.games, function (o) {
                        return o.won - o.buyIn
                    });

                    if (maxTotal.won + maxTotal.bounty - maxTotal.buyIn < maxT.won + maxT.bounty - maxT.buyIn) {
                        maxTotal = maxT;
                        maxTotal.name = user.name;
                        console.log('total', maxTotal.won + maxTotal.bounty - maxTotal.buyIn)
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

                    user.hero = (user.played * 10) + (user.won * user.played) - user.total + (user.buyIn * 3) + (user.bounty * 5);

                    if (this.state.getAvg) {
                        user.won = Math.round(user.won / user.games.length);
                        user.bounty = Math.round(user.bounty / user.games.length);
                        user.total = Math.round(user.total / user.games.length);
                        user.buyIn = Math.round(user.buyIn / user.games.length);
                        user.played = Math.round((user.played / dates.length) * 100);
                        user.hero = Math.round(user.hero / (user.games.length));
                    }
                    filteredUsers.push(user);
                    console.log("users", filteredUsers);
                }
            }

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
                <Card outline color="primary">
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
                            <Col>
                                <Button size="sm" color="link" onClick={this.last3m}>3 Month</Button>
                            </Col>
                            <Col>
                                <Button size="sm" color="link" onClick={this.last6m}>6 Month</Button>
                            </Col>
                            <Col>
                                <Button size="sm" color="link" onClick={this.last12m}>Year</Button>
                            </Col>
                            <Col>
                                <Button size="sm" color="link" onClick={this.this12m}>This Year</Button>
                            </Col>
                        </Row>
                        <Row style={{paddingTop: "12px"}}>
                            {!this.state.reload ?
                                this.state.usersButtons.map((name) =>
                                    <Col xs={4} style={{paddingTop: "6px"}}>
                                        <Button size={"sm"} outline color={"primary"} value={name}
                                                active={!this.isFiltered(name)}
                                                onClick={this.userFilter}
                                                key={"filter" + name}
                                        >
                                            {name}
                                        </Button>
                                    </Col>
                                ) : <div/>}
                        </Row>
                    </CardBody>
                    <CardFooter>
                        <Button color="link" size="sm" block onClick={this.showFilter}>Apply</Button>
                    </CardFooter>
                </Card>
            </Collapse>)
    }


    isFiltered(name) {
        return _.indexOf(this.state.filteredUsers, name) >= 0;
    }

    userFilter(evt) {
        let found = _.indexOf(this.state.filteredUsers, evt.target.value);

        if (found >= 0) {
            this.state.filteredUsers.splice(found, 1);
        } else {
            this.state.filteredUsers.push(evt.target.value);
        }
        console.log("filtered Users list", this.state.filteredUsers);
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
                    height: 260,
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
            <i className="fa fa-trophy" onClick={this.toggle}
               style={{fontSize: "30px"}}/>
            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}
                   onKeyPress={this.handleKeyPress}

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
                                        <i className="fa fa-filter"/> Filter
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
                                         from={this.state.fromDate} to={this.state.toDate} i={i}/>
                            ))}
                        </TabPane>
                    </TabContent>
                    <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="1">
                            <br/>
                            {usersTop.map((user, i) => (
                                <TopList name={'total'} user={user} value={user.total}
                                         from={this.state.fromDate} to={this.state.toDate} i={i}/>
                            ))}
                        </TabPane>
                    </TabContent>
                    <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="2">
                            <br/>

                            {usersWon.map((user, i) => (
                                <TopList name={'won'} user={user} value={user.won}
                                         from={this.state.fromDate} to={this.state.toDate} i={i}/>
                            ))}
                        </TabPane>
                    </TabContent>
                    <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="3">
                            <br/>

                            {usersBounty.map((user, i) => (
                                <TopList name={'bounty'} user={user} value={user.bounty}
                                         from={this.state.fromDate} to={this.state.toDate} i={i}/>
                            ))}
                        </TabPane>
                    </TabContent>
                    <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="4">
                            <br/>
                            {usersBuyIn.map((user, i) => (
                                <TopList name={'buyIn'} user={user} value={user.buyIn}
                                         from={this.state.fromDate} to={this.state.toDate} i={i}/>
                            ))}
                        </TabPane>
                    </TabContent>
                    <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="5">
                            <br/>
                            {usersPlayed.map((user, i) => (
                                <TopList name={'played'} user={user} value={user.played}
                                         extension={getAvg ? "%" : ""}
                                         from={this.state.fromDate} to={this.state.toDate} i={i}/>
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
