import React from 'react';
import {
    Button, ButtonGroup,
    Col,
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
            popoverOpen: false,
            showFilter: false,
            filtered: false,
            getAvg: false,
            dates: [],
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
    }

    onBackButtonPressAndroid = () => {
        alert("backbutton");
        if (this.state.modal) {
            this.toggle();
            return true;
        }
        return false;
    };

    toggleTab(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
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
        let usersWon = [];
        let usersTop = [];
        let usersBounty = [];
        let dates = [];

        console.log("users for generalstat", users);
        if (this.state.fromDate === "2018-01-01" && this.state.toDate === this.props.today) {
            this.setState({
                filtered: true,
            })
        } else {
            this.setState({
                filtered: false,
            })
        }
        if (this.state.dateOk && !_.isNil(users)) {

            for (let user in users) {
                for (let game in users[user].games) {
                    if (users[user].games[game].buyIn > 0) {
                        dates.push(users[user].games[game].date);
                    }
                }
            }
            dates = _.uniqBy(dates);


            for (let i in users) {
                let user = {...users[i]};
                console.log("user for generalstat", user);

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

                    sumWon = sumWon + user.won;

                    sumBuyIn = sumBuyIn + user.buyIn;

                    sumBounty = sumBounty + user.bounty;

                    user.total = _.sumBy(user.games, function (o) {
                        return o.won + o.bounty - o.buyIn
                    });

                    sumTotal = sumTotal + user.total;
                    console.log("user total", user.total);

                    if (this.state.getAvg) {
                        user.won = user.won / user.games.length;
                        user.bounty = user.bounty / user.games.length;
                        user.total = user.total / user.games.length;
                        user.played = (user.played / dates.length) * 100;
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
                dates,
            });
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
            usersTop: [],
            usersBounty: [],
            usersWon: [],
            usersBuyIn: [],
            usersPlayed: [],
        });
    }

    updateFormDate(evt) {
        this.setState({
                fromDate: evt.target.value
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
                toDate: evt.target.value
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
        }, () => {
            this.getData();
        })
    }

    filter() {
        if (this.state.showFilter) {
            return (
                <div style={{}}>
                    <Row>
                        <Col>
                            <InputGroup style={{paddingTop: "12px"}}>
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
                            <ButtonGroup>
                                <Button color="link" onClick={this.last3m}>3 Month</Button>
                                <Button color="link" onClick={this.last6m}>6 Month</Button>
                                <Button color="link" onClick={this.last12m}>Year</Button>
                                <Button color="link" onClick={this.this12m}>This Year</Button>
                            </ButtonGroup>
                        </Col>
                    </Row>
                </div>)
        } else {
            return <div/>
        }
    }

    setAvg() {
        this.setState({
            getAvg: true,
        }, () => {
            this.getData();
        })
    }

    setSum() {
        this.setState({
            getAvg: false,
        }, () => {
            this.getData();
        })
    }

    render() {
        const {sumBuyIn, avgBuyIn, maxWon, maxBuyIn, maxBounty, maxTotal, usersTop, usersBounty, usersWon, usersBuyIn, usersPlayed, getAvg, dates} = this.state;

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
                                <Col xs={5}>
                                    <ButtonGroup>
                                        <Button color={"link"} onClick={this.showFilter}
                                                style={{color: this.state.filtered ? "black" : "blue"}}
                                        >
                                            <i className="fa fa-filter"/> Filter
                                        </Button>
                                        <Button color={"link"} style={{
                                            visibility: this.state.filtered ? "hidden" : "visible",
                                            color: "blue"
                                        }}
                                                onClick={this.resetFilter}>
                                            X
                                        </Button>
                                    </ButtonGroup>
                                </Col>
                                <Col xs={5}>
                                    <ButtonGroup>
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
                                <Col xs={2}/>
                            </Row>
                            {this.filter()}
                        </FormGroup>
                        <Nav tabs>
                            <NavItem>
                                <NavLink
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
                                    Peaks
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="1">
                                <br/>
                                <Row>
                                    <Col>
                                        {usersTop.map((user, i) => (
                                            <Row key={'toplist' + i}>
                                                <Col xs={4}>{user.name}</Col>
                                                <Col xs={5}>total: {user.total}</Col>
                                                <Col xs={1}>
                                                    <Statistic user={user}
                                                               fromDate={this.state.fromDate}
                                                               today={this.state.toDate}/></Col>
                                                <Col xs={2}/>
                                            </Row>
                                        ))}
                                    </Col>
                                </Row>
                            </TabPane>
                        </TabContent>
                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="2">
                                <br/>
                                <Row>
                                    <Col>
                                        {usersWon.map((user, i) => (
                                            <Row key={'won' + i}>
                                                <Col xs={4}>{user.name}</Col>
                                                <Col xs={5}>won: {user.won}</Col>
                                                <Col xs={1}>
                                                    <Statistic user={user}
                                                               fromDate={this.state.fromDate}
                                                               today={this.state.toDate}/></Col>
                                                <Col xs={2}/>
                                            </Row>
                                        ))}
                                    </Col>
                                </Row>
                            </TabPane>
                        </TabContent>
                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="3">
                                <br/>
                                <Row>
                                    <Col>
                                        {usersBounty.map((user, i) => (
                                            <Row key={'bounty' + i}>
                                                <Col xs={4}>{user.name}</Col>
                                                <Col xs={5}>bounty: {user.bounty}</Col>
                                                <Col xs={1}>
                                                    <Statistic user={user}
                                                               fromDate={this.state.fromDate}
                                                               today={this.state.toDate}/></Col>
                                                <Col xs={2}/>
                                            </Row>
                                        ))}
                                    </Col>
                                </Row>
                            </TabPane>
                        </TabContent>
                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="4">
                                <br/>
                                <Row>
                                    <Col>
                                        {usersBuyIn.map((user, i) => (
                                            <Row key={'buyIn' + i}>
                                                <Col xs={4}>{user.name}</Col>
                                                <Col xs={5}>buyIn: {user.buyIn}</Col>
                                                <Col xs={1}>
                                                    <Statistic user={user}
                                                               fromDate={this.state.fromDate}
                                                               today={this.state.toDate}/></Col>
                                                <Col xs={2}/>
                                            </Row>
                                        ))}
                                    </Col>
                                </Row>
                            </TabPane>
                        </TabContent>
                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="5">
                                <br/>
                                <Row>
                                    <Col>
                                        {usersPlayed.map((user, i) => (
                                            <Row key={'played' + i}>
                                                <Col xs={4}>{user.name}</Col>
                                                <Col xs={5}>played: {user.played} {getAvg ? "%" : ""}</Col>
                                                <Col xs={1}>
                                                    <Statistic user={user}
                                                               fromDate={this.state.fromDate}
                                                               today={this.state.toDate}/></Col>
                                                <Col xs={2}/>
                                            </Row>
                                        ))}
                                    </Col>
                                </Row>
                            </TabPane>
                        </TabContent>
                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="6">

                                <br/>
                                <GameDetail game={maxBuyIn} name={'BuyIn'} value={maxBuyIn.buyIn}/>
                                <GameDetail game={maxWon} name={'Won'} value={maxWon.won}/>
                                <GameDetail game={maxBounty} name={'Bounty'} value={maxBounty.bounty}/>
                                <GameDetail game={maxTotal} name={'Total'}
                                            value={maxTotal.won + maxTotal.bounty - maxTotal.buyIn}/>
                                <br/>
                                <Row>
                                    <Col xs={6}>
                                        <b>Sum</b> of all Buy In's
                                    </Col>
                                    <Col xs={6}>
                                        {sumBuyIn}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={6}>
                                        <b>Average</b> Buy In
                                    </Col>
                                    <Col xs={6}>
                                        {avgBuyIn}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={6}>
                                        <b>Played</b> games
                                    </Col>
                                    <Col xs={6}>
                                        {dates.length}
                                    </Col>
                                </Row>
                            </TabPane>
                        </TabContent>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggle}>Exit</Button>
                    </ModalFooter>
                </Modal>
            </div>
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
