import React from 'react';
import {
    Button,
    Col,
    FormGroup,
    Input, InputGroup,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader, Nav, NavItem, NavLink, Popover, PopoverBody, PopoverHeader,
    Row, TabContent,
    Table, TabPane
} from "reactstrap";
import trophy from '../img/trophy-solid.svg';
import {connect} from "react-redux";
import * as _ from 'lodash';
import classnames from 'classnames';

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
        };

        this.toggle = this.toggle.bind(this);
        this.toggleDetail = this.toggleDetail.bind(this);
        this.toggleTab = this.toggleTab.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.updateFormDate = this.updateFormDate.bind(this);
        this.updateToDate = this.updateToDate.bind(this);
        this.init = this.init.bind(this);
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

    popOver(game, name) {
        return (<Popover placement="top" isOpen={this.state.popoverOpen}
                         target={name}
                         toggle={this.toggleDetail}>
            <PopoverHeader>The Game with the highest {name}</PopoverHeader>
            <PopoverBody>
                <Row>
                    <Col xs={6}>
                        Name
                    </Col>
                    <Col xs={6}>
                        {game.name}
                    </Col>
                </Row>
                <Row>
                    <Col xs={6}>
                        BuyIn
                    </Col>
                    <Col xs={6}>
                        {game.buyIn}
                    </Col>
                </Row>
                <Row>
                    <Col xs={6}>
                        Won
                    </Col>
                    <Col xs={6}>
                        {game.won}
                    </Col>
                </Row>
                <Row>
                    <Col xs={6}>
                        Bounty
                    </Col>
                    <Col xs={6}>
                        {game.bounty}
                    </Col>
                </Row>
                <Row>
                    <Col xs={6}>
                        Total
                    </Col>
                    <Col xs={6}>
                        {game.won + game.bounty - game.buyIn}
                    </Col>
                </Row>
            </PopoverBody>
        </Popover>)
    }

    render() {
        const {sumBuyIn, avgBuyIn, maxWon, maxBuyIn, maxBounty, maxTotal, top} = this.state;

        return (<div>
            <img className="chart" src={trophy} alt={"chart"} onClick={this.toggle} style={{height: "30px"}}/>

            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}
                   onKeyPress={this.handleKeyPress}>
                <ModalHeader toggle={this.toggle}>General Statistic</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Row>
                            <Col><b>Filter</b></Col>
                        </Row>
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
                    </FormGroup>
                    <Nav tabs>
                        <NavItem>
                            <NavLink
                                className={classnames({active: this.state.activeTab === '1'})}
                                onClick={() => {
                                    this.toggleTab('1');
                                }}
                            >
                                Top List
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({active: this.state.activeTab === '2'})}
                                onClick={() => {
                                    this.toggleTab('2');
                                }}
                            >
                                Table
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="1">
                            <br/>
                            <Row>
                                <Col>
                                    <Table borderless>
                                        <tbody>
                                        {top.map((user, i) => (
                                            <tr key={'toplist' + i}>
                                                <td>{user.name}</td>
                                                <td>{user.total}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                        </TabPane>
                    </TabContent>
                    <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="2">
                            <br/>
                            <div style={{
                                textAlign: "center",
                            }}>
                                <b>Maximum Values</b>
                                <br/>
                            </div>
                            <Row>
                                <Col>
                                    <Table borderless size="sm">
                                        <tbody>
                                        <tr id='BuyIn' onClick={this.toggleDetail}>
                                            <th>Buy In</th>
                                            <td>{maxBuyIn.buyIn}</td>
                                            <td>{maxBuyIn.name}</td>
                                            {this.popOver(maxBuyIn, 'BuyIn')}
                                        </tr>
                                        <tr id='Won' onClick={this.toggleDetail}>
                                            <th>Won</th>
                                            <td>{maxWon.won}</td>
                                            <td>{maxWon.name}</td>
                                            {this.popOver(maxWon, 'Won')}
                                        </tr>
                                        <tr id='Bounty' onClick={this.toggleDetail}>
                                            <th>Bounty</th>
                                            <td>{maxBounty.bounty}</td>
                                            <td>{maxBounty.name}</td>
                                            {this.popOver(maxBounty, 'Bounty')}
                                        </tr>
                                        <tr id='Total' onClick={this.toggleDetail}>
                                            <th>Total</th>
                                            <td>{maxTotal.won + maxTotal.bounty - maxTotal.buyIn}</td>
                                            <td>{maxTotal.name}</td>
                                            {this.popOver(maxTotal, 'Total')}
                                        </tr>
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Table borderless size="sm">
                                        <tbody>
                                        <tr>
                                            <td>Sum of all Buy In's</td>
                                            <td>{sumBuyIn}</td>
                                        </tr>
                                        <tr>
                                            <td>Average Buy In</td>
                                            <td>{avgBuyIn}</td>
                                        </tr>
                                        </tbody>
                                    </Table>
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
