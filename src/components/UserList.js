import React from 'react';
import {Button, Col, Input, ListGroupItem, Modal, ModalBody, ModalFooter, ModalHeader, Row} from 'reactstrap';
import 'react-infinite-calendar/styles.css';
import {store} from "../redux/store";
import {saveUsers} from "../redux/actions";
import {connect} from "react-redux";
import * as _ from 'lodash';
import Statistic from "./Statistic";

class UserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            buyIn: 0,
            won: 0,
            date: props.date,
            dateOk: true,
        };

        this.toggle = this.toggle.bind(this);
        this.updateWon = this.updateWon.bind(this);
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
            return {backgroundColor: 'red'}
        }
        if (this.state.date !== this.props.today) {
            return {backgroundColor: 'LightSkyBlue'}
        } else {
            return {backgroundColor: 'white'}
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
        console.log("search game for user " + user.name + " on date " + this.state.date);
        for (let i = 0; i < user.games.length; i++) {
            if (this.state.date === user.games[i].date) {
                this.setState({
                    buyIn: user.games[i].buyIn,
                    won: user.games[i].won
                }, () => {
                    console.log("game found " + this.state.buyIn + " / " + this.state.won);
                });
                break;
            } else {
                this.setState({
                    buyIn: 0,
                    won: 0
                });
            }
        }
    }

    updateBuyIn(evt) {
        if (evt.target.value === '' || isNaN(evt.target.value)) {
            this.setState({
                buyIn: 0
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
                won: 0
            });
        } else {
            this.setState({
                won: _.parseInt(evt.target.value, 10)
            });
        }
    }

    saveGame() {
        let found = false;
        const {users} = this.props.data;
        const {user} = this.props;
        this.toggle();

        for (let i = 0; i < user.games.length; i++) {
            if (this.state.date === user.games[i].date) {
                if (user.games[i].buyIn !== this.state.buyIn || user.games[i].won !== this.state.won) {
                    user.games[i].buyIn = this.state.buyIn;
                    user.games[i].won = this.state.won;
                    store.dispatch(saveUsers(users));
                }
                found = true;
                console.log("game successfully updated " + user.name + ", date: " + this.state.date + " buyIn " + user.games[i].buyIn + " won " + user.games[i].won);
            }
        }
        if (!found) {
            let game = {
                date: '',
                buyIn: 0,
                won: 0
            };
            game.date = this.state.date;
            game.buyIn = this.state.buyIn;
            game.won = this.state.won;
            user.games.push(game);
            console.log("game successfully created " + user.name + ", date: " + this.state.date + " buyIn " + game.buyIn + " won " + game.won);
            store.dispatch(saveUsers(users));
        }
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

    render() {
        const {user, today} = this.props;
        return (<div>
                <ListGroupItem key={this.props.key}>
                    <Row>
                        <Col xs="2">
                            <Statistic user={user} today={today}/>
                        </Col>
                        <Col xs="10">
                            <div onClick={this.toggle}>
                                <b>{user.name}</b>
                            </div>
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
                        <Row>
                            <Col xs="4">
                                <div>Buy In</div>
                            </Col>
                            <Col xs="8">
                                <Input autoFocus="true"
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