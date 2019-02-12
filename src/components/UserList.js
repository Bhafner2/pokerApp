import React from 'react';
import {Button, Col, Input, ListGroupItem, Modal, ModalBody, ModalFooter, ModalHeader, Row} from 'reactstrap';
import 'react-infinite-calendar/styles.css';
import {store} from "../redux/store";
import {saveUsers} from "../redux/actions";
import {connect} from "react-redux";
import * as _ from 'lodash';
import Statistic from "./Statistic";
import firebase from "../config/firebase";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faDollarSign} from '@fortawesome/free-solid-svg-icons';

class UserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            buyIn: 0,
            won: 0,
            bounty: 0,
            date: props.date,
            dateOk: true,
        };

        this.toggle = this.toggle.bind(this);
        this.updateWon = this.updateWon.bind(this);
        this.updateBounty = this.updateBounty.bind(this);
        this.getActualGame = this.getActualGame.bind(this);
        this.updateWon = this.updateWon.bind(this);
        this.saveGame = this.saveGame.bind(this);
        this.updateBuyIn = this.updateBuyIn.bind(this);
        this.updateDate = this.updateDate.bind(this);
        this.isToday = this.isToday.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    isToday() {
        if (this.state.date === '') {
            return {color: 'red'}
        }
        if (this.state.date !== this.props.today) {
            return {color: '#007BFF'}
        } else {
            return {color: 'black'}
        }
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        }, () => {
            if (this.state.modal) {
                this.setState({
                    date: this.props.date
                }, () => {
                    if (this.state.date === '') {
                        this.setState({
                            dateOk: false,
                        })
                    } else {
                        this.setState({
                            dateOk: true,
                        });
                        this.getActualGame();
                    }
                });
            }
        });
    }


    updateDate(evt) {
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
                    });
                    this.getActualGame();
                }
            }
        );
    }

    getActualGame() {
        const {user} = this.props;
        const {connErr} = this.props.data;

        if (connErr) {
            this.setState({
                dataOk: false,
            });
        } else {
            console.log("search game for user " + user.name + " on date " + this.state.date);
            for (let i in user.games) {
                if (!_.isNil(user.games[i]) && !_.isNil(user.games[i].date)) {
                    if (this.state.date === user.games[i].date) {
                        this.setState({
                            buyIn: user.games[i].buyIn,
                            won: user.games[i].won,
                            bounty: user.games[i].bounty,
                        }, () => {
                            console.log("game found " + this.state.buyIn + " / " + this.state.won, " / ", this.state.bounty);
                        });
                        break;
                    } else {
                        this.setState({
                            buyIn: '',
                            won: '',
                            bounty: '',
                        });
                    }
                }
            }
        }
    }

    updateBuyIn(evt) {
        if (evt.target.value === '' || isNaN(evt.target.value)) {
            this.setState({
                buyIn: ''
            });
        } else {
            this.setState({
                buyIn: _.parseInt(evt.target.value, 10)
            });
        }
    }


    updateWon(evt) {
        if (evt.target.value === '' || isNaN(evt.target.value)) {
            this.setState({
                won: ''
            });
        } else {
            this.setState({
                won: _.parseInt(evt.target.value, 10)
            });
        }
    }

    updateBounty(evt) {
        if (evt.target.value === '' || isNaN(evt.target.value)) {
            this.setState({
                bounty: '',
            });
        } else {
            this.setState({
                bounty: _.parseInt(evt.target.value, 10),
            });
        }
    }

    saveGame() {
        let found = false;
        const {users} = this.props.data;
        const {user} = this.props;
        this.toggle();
        let {buyIn, won, bounty, date} = this.state;
        if (buyIn === '' || isNaN(buyIn)) {
            buyIn = 0;
        }
        if (won === '' || isNaN(won)) {
            won = 0;
        }
        if (bounty === '' || isNaN(bounty)) {
            bounty = 0;
        }

        let sumBuyIn = 0;
        let sumWon = 0;
        let sumBounty = 0;
        let gamesPlayed = 0;


        for (let i = 0; i < user.games.length; i++) {
            if (this.state.date === user.games[i].date) {
                if (user.games[i].buyIn !== buyIn || user.games[i].won !== won || user.games[i].bounty !== bounty) {
                    user.games[i].buyIn = buyIn;
                    user.games[i].won = won;
                    user.games[i].bounty = bounty;
                }
                found = true;
                console.log("game successfully updated " + user.name + ", date: " + date + " buyIn " + user.games[i].buyIn + " won " + user.games[i].won, " bounty ", user.games[i].bounty);
            }
            sumBuyIn += user.games[i].buyIn;
            sumWon += user.games[i].won;
            sumBounty += user.games[i].bounty;
            if (user.games[i].buyIn > 0) {
                gamesPlayed++;
            }
        }
        if (!found) {
            let game = {
                date: '',
                buyIn: 0,
                won: 0,
                bounty: 0,
            };
            game.date = date;
            game.buyIn = buyIn;
            game.won = won;
            game.bounty = bounty;
            user.games.push(game);
            console.log("game successfully created " + user.name + ", date: " + this.state.date + " buyIn " + game.buyIn + " won " + game.won, " bounty ", game.bounty);
        }

        user.sumBuyIn = sumBuyIn;
        user.sumWon = sumWon;
        user.sumBounty = sumBounty;
        user.gamesPlayed = gamesPlayed;
        store.dispatch(saveUsers(users));
        this.props.saved();
    }

    handleKeyPress(target) {
        console.log("key pressed");
        if (target.charCode === 13) {
            console.log("enter pressed");
            this.saveGame()
        } else if (target.charCode === 27) {
            console.log("esc pressed");
            this.toggle()
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps !== this.props) {
            this.getActualGame();
        }
    }

    static isAdmin() {
        if (_.isNil(firebase.auth().currentUser)) {
            return false;
        }
        return firebase.auth().currentUser.email === "admin@statistic.com"
    }

    render() {
        const {user} = this.props;
        return (<div>
                <ListGroupItem key={this.props.key}
                               style={{color: this.props.blue ? "#007BFF" : "black"}}>
                    <Row>
                        <Col xs="4">
                            <Statistic user={user} today={this.props.date}/>
                        </Col>

                        <Col xs="4">
                            <div onClick={this.toggle}>
                                <b>{user.name}</b>
                            </div>
                        </Col>
                        <Col xs="4">
                            <FontAwesomeIcon icon={faDollarSign} onClick={this.toggle} size={"1x"}/>
                        </Col>
                    </Row>
                </ListGroupItem>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}
                       onKeyPress={this.handleKeyPress}>
                    <ModalHeader toggle={this.toggle}>{user.name}</ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col xs="4">
                                Date
                            </Col>
                            <Col xs="8">
                                <Input type="date" name="date" id="date"
                                       onChange={this.updateDate}
                                       value={this.state.date}
                                       style={this.isToday()}
                                />
                            </Col>
                        </Row>

                        {!UserList.isAdmin() ?
                            <div>
                                <Row style={{paddingTop: "6px"}}>
                                    <Col xs="4">
                                        <div style={{display: 'inline-block'}}>Buy In</div>
                                    </Col>
                                    <Col xs="8">
                                        {this.state.buyIn > 0 ? this.state.buyIn : 0}
                                    </Col>
                                </Row>
                                <Row style={{paddingTop: "6px"}}>
                                    <Col xs="4">
                                        <div style={{display: 'inline-block'}}>Won</div>
                                    </Col>
                                    <Col xs="8">
                                        {this.state.won > 0 ? this.state.won : 0}
                                    </Col>
                                </Row>
                                <Row style={{paddingTop: "6px"}}>
                                    <Col xs="4">
                                        <div style={{display: 'inline-block'}}>Bounty's</div>
                                    </Col>
                                    <Col xs="8">
                                        {this.state.bounty > 0 ? this.state.bounty : 0}
                                    </Col>
                                </Row>
                            </div>
                            :
                            <div>
                                <Row>
                                    <Col xs="4">
                                        <div>Buy In</div>
                                    </Col>
                                    <Col xs="8">
                                        <Input autoFocus
                                               type="number" name="buyIn" id="buyIn"
                                               onChange={this.updateBuyIn}
                                               value={this.state.buyIn}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs="4">
                                        <div style={{display: 'inline-block'}}>Won</div>
                                    </Col>
                                    <Col xs="8">
                                        <Input type="number" name="won" id="won"
                                               onChange={this.updateWon}
                                               value={this.state.won}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs="4">
                                        <div style={{display: 'inline-block'}}>Bounty's Won</div>
                                    </Col>
                                    <Col xs="8">
                                        <Input type="number" name="bounty" id="bounty"
                                               onChange={this.updateBounty}
                                               value={this.state.bounty}
                                        />
                                    </Col>
                                </Row>
                            </div>
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.saveGame} disabled={!this.state.dateOk}>Save</Button>
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
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
)(UserList);