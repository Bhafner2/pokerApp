import React from 'react';
import {Button, Col, Input, ListGroupItem, Modal, ModalBody, ModalFooter, ModalHeader, Row} from 'reactstrap';
import 'react-infinite-calendar/styles.css';
import { store } from "../store";
import {saveUsers, updateActualUser} from "../actions";


class UserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            buyIn: 0,
            won: 0,
            date: props.date,
        };

        this.toggle = this.toggle.bind(this);
        this.updateWon = this.updateWon.bind(this);
        this.getActualGame = this.getActualGame.bind(this);
        this.updateWon = this.updateWon.bind(this);
        this.saveGame = this.saveGame.bind(this);
        this.updateBuyIn = this.updateBuyIn.bind(this);
        this.updateDate = this.updateDate.bind(this);
        this.isToday = this.isToday.bind(this);
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
                    this.getActualGame();
                });
            }
        });
    }


    updateDate(evt) {
        this.setState({
                date: evt.target.value
            }, () => {
                console.log("new date " + this.state.date);
                this.getActualGame();
            }
        );


    }

    getActualGame() {
        console.log("search game for user " + store.getState().actualUser.name + " on date " + this.state.date);
        for (let i = 0; i < store.getState().actualUser.games.length; i++) {
            if (this.state.date === store.getState().actualUser.games[i].date) {
                this.setState({
                    buyIn: store.getState().actualUser.games[i].buyIn,
                    won: store.getState().actualUser.games[i].won
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
        this.setState({
            buyIn: parseInt(evt.target.value, 10)
        });
    }

    updateWon(evt) {
        this.setState({
            won: parseInt(evt.target.value, 10)
        });
    }

    saveGame() {
        let found = false;
        for (let i = 0; i < store.getState().actualUser.games.length; i++) {
            if (this.state.date === store.getState().actualUser.games[i].date) {
                store.getState().actualUser.games[i].buyIn = this.state.buyIn;
                store.getState().actualUser.games[i].won = this.state.won;
                found = true;
                console.log("game successfully updated " + store.getState().actualUser.name + ", date: " + this.state.date + " buyIn " + store.getState().actualUser.games[i].buyIn + " won " + store.getState().actualUser.games[i].won);
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
            store.getState().actualUser.games.push(game);
            console.log("game successfully created " + store.getState().actualUser.name + ", date: " + this.state.date + " buyIn " + game.buyIn + " won " + game.won);
        }
        this.toggle();
        this.props.saved();
        store.dispatch(saveUsers(store.getState().users));
    }

    setUsername() {
        store.dispatch(updateActualUser(this.props.user));
        return (store.getState().actualUser.name)
    }

    render() {
        return (<div>
                <ListGroupItem key={this.setUsername()} onClick={this.toggle}>
                    <div>
                        <b>{this.props.user.name}</b>
                    </div>
                </ListGroupItem>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>{store.getState().actualUser.name}</ModalHeader>
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
                                <div>BuyIn</div>
                            </Col>
                            <Col xs="8">
                                <Input autoFocus={true}
                                       type="number" name="buyIn" id="buyIn"
                                       onChange={this.updateBuyIn}
                                       value={this.state.buyIn}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="4">
                                <div style={{display: 'inline-block'}}>Won</div>
                            </Col>
                            <Col xs="8">
                                <Input type="number" name="won" id="won"
                                       onChange={this.updateWon}
                                       value={this.state.won}/>
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.saveGame}>Save</Button>
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default UserList;