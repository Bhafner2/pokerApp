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
    Table, TabPane
} from "reactstrap";
import trophy from '../img/trophy-solid.svg';
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
            top: [],
            popoverOpen: false,
            showFilter: false,
            filtered: false,
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
    }

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
        let top = [];

        console.log("users for generalstat", users);
        if (this.state.fromDate === "2018-01-01" && this.state.toDate === this.props.today){
            this.setState({
                filtered: true,
            })
        }else {
            this.setState({
                filtered: false,
            })
        }
        if (this.state.dateOk && !_.isNil(users)) {

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

                    sumWon = sumWon + _.sumBy(user.games, function (o) {
                        return o.won
                    });

                    sumBuyIn = sumBuyIn + _.sumBy(user.games, function (o) {
                        return o.buyIn
                    });

                    sumBounty = sumBounty + _.sumBy(user.games, function (o) {
                        return o.bounty
                    });

                    user.total = _.sumBy(user.games, function (o) {
                        return o.won + o.bounty - o.buyIn
                    });

                    sumTotal = sumTotal + user.total;
                    console.log("user total", user.total);


                    filteredUsers.push(user);
                    console.log("users", filteredUsers);
                }
            }

            top = _.sortBy(filteredUsers, function (o) {
                return -o.total
            });

            console.log('top', top);
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
                top,
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
            top: [],
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
            showFilter: false,
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
            showFilter: false,
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
            showFilter: false,
        }, () => {
            this.getData();
        })
    }

    this12m() {
        let d = new Date(this.props.today);
        this.setState({
            fromDate: d.getFullYear() + '-01-01',
            toDate: d.getFullYear() + '-12-31',
            showFilter: false,
        }, () => {
            this.getData();
        })
    }

    showFilter() {
        this.setState({
            showFilter: !this.state.showFilter,
        })
    }

    resetFilter(){
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
                            <br/>
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

    render() {
        const {sumBuyIn, avgBuyIn, maxWon, maxBuyIn, maxBounty, maxTotal, top} = this.state;

        return (<div>
            <img className="chart" src={trophy} alt={"chart"} onClick={this.toggle} style={{height: "30px"}}/>

            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}
                   onKeyPress={this.handleKeyPress}
                   onBackButtonPress={() => this.setState({ modal: false })}
                   >
                <ModalHeader toggle={this.toggle}>Top List</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Row>
                            <Col>
                                <ButtonGroup>
                                    <Button color={this.state.filtered ? "link" : "primary"} onClick={this.showFilter}>
                                        Filter
                                    </Button>
                                    <Button style={{visibility: this.state.filtered ? "hidden" : "visible"}} onClick={this.resetFilter}>
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
                                Peaks
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="1">
                            <br/>
                            <Row>
                                <Col>
                                        {top.map((user, i) => (
                                            <Row key={'toplist' + i}>
                                                <Col xs={2}><Statistic user={user} fromDate={this.state.fromDate}
                                                               today={this.state.toDate}/></Col>
                                                <Col xs={4}>{user.name}</Col>
                                                <Col xs={6}>total: {user.total}</Col>
                                            </Row>
                                        ))}
                                </Col>
                            </Row>
                        </TabPane>
                    </TabContent>
                    <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="2">

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
)(GeneralStatistic);
