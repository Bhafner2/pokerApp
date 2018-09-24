import React from 'react';
import {
    Button,
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
import chart from '../img/chart-bar-regular.svg';
import {connect} from "react-redux";
import * as _ from 'lodash';
import classnames from 'classnames';

let filteredUsers = [];
let empty = {name: '', won: 0, buyIn: 0, date: ''};

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
            avgWon: 0,
            avgBuyIn: 0,
            avgTotal: 0,
            maxBuyIn: {...empty},
            maxWon: {...empty},
            maxTotal: {...empty},
            top: [],
        };

        this.toggle = this.toggle.bind(this);
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
        let sumWon = 0;
        let sumBuyIn = 0;
        let sumTotal = 0;
        let avgWon = 0;
        let avgBuyIn = 0;
        let avgTotal = 0;
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

                    let maxT = _.maxBy(user.games, function (o) {
                        return o.won - o.buyIn
                    });

                    if (maxTotal.won - maxTotal.buyIn < maxT.won - maxT.buyIn) {
                        maxTotal = maxT;
                        maxTotal.name = user.name;
                        console.log('total', maxTotal.won - maxTotal.buyIn)
                    }

                    sumWon = sumWon + _.sumBy(user.games, function (o) {
                        return o.won
                    });

                    sumBuyIn = sumBuyIn + _.sumBy(user.games, function (o) {
                        return o.buyIn
                    });

                    user.total = _.sumBy(user.games, function (o) {
                        return o.won - o.buyIn
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
            avgTotal = Math.round(sumTotal / counter);

            this.setState({
                maxWon,
                maxBuyIn,
                maxTotal,
                sumBuyIn,
                sumTotal,
                sumWon,
                avgBuyIn,
                avgWon,
                avgTotal,
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
            avgWon: 0,
            avgBuyIn: 0,
            avgTotal: {...empty},
            maxBuyIn: {...empty},
            maxWon: {...empty},
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

    render() {
        const {sumBuyIn, avgBuyIn, maxWon, maxBuyIn, maxTotal, top} = this.state;

        return (<div>
            <img className="chart" src={chart} alt={"chart"} onClick={this.toggle} style={{height: "32px"}}/>

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
                                        {top.map((user) => (
                                            <tr>
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
                            </div>
                            <Row>
                                <Col>
                                    <Table borderless size="sm">
                                        <thead>
                                        <tr>
                                            <th/>
                                            <th scope="row">Name</th>
                                            <th>Buy In</th>
                                            <th>Won</th>
                                            <th>Total</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <th>Buy In</th>
                                            <td>{maxBuyIn.name}</td>
                                            <th>{maxBuyIn.buyIn}</th>
                                            <td>{maxBuyIn.won}</td>
                                            <td>{maxBuyIn.won - maxBuyIn.buyIn}</td>
                                        </tr>
                                        <tr>
                                            <th>Won</th>
                                            <td>{maxWon.name}</td>
                                            <td>{maxWon.buyIn}</td>
                                            <th>{maxWon.won}</th>
                                            <td>{maxWon.won - maxWon.buyIn}</td>
                                        </tr>
                                        <tr>
                                            <th>Total</th>
                                            <td>{maxTotal.name}</td>
                                            <td>{maxTotal.buyIn}</td>
                                            <td>{maxTotal.won}</td>
                                            <th>{maxTotal.won - maxTotal.buyIn}</th>
                                        </tr>
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                            <br/>
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
