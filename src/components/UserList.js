import React from 'react';
import {
    Button,
    Col,
    Input,
    ListGroupItem,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row,
    ButtonGroup,
    Form,
    FormGroup,
    Label,
} from 'reactstrap';
import 'react-infinite-calendar/styles.css';
import { store } from "../redux/store";
import { saveUsers } from "../redux/actions";
import { connect } from "react-redux";
import * as _ from 'lodash';
import Statistic from "./Statistic";
import firebase from "../config/firebase";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRubleSign } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import { isToday } from '../App';

const lastDay = moment().subtract(28, 'h').format();
const firstDay = moment('2018-01-01').format();

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
            stat: false,
            lastBuyInOk: this.props.user.lastBuyInOk,
        };

        this.toggle = this.toggle.bind(this);
        this.updateWon = this.updateWon.bind(this);
        this.updateBounty = this.updateBounty.bind(this);
        this.getActualGame = this.getActualGame.bind(this);
        this.updateWon = this.updateWon.bind(this);
        this.saveGame = this.saveGame.bind(this);
        this.updateBuyIn = this.updateBuyIn.bind(this);
        this.updateDate = this.updateDate.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.toggleStat = this.toggleStat.bind(this);
        this.toggleLastBuyInOk = this.toggleLastBuyInOk.bind(this);
    }

    toggle() {
        if (!this.state.modal) {
            this.setState({
                date: this.props.date,
                dateOk: true,
                modal: true,
            }, () => {
                this.getActualGame();
            });
        } else {
            this.setState({
                modal: false,
            });
        }
    }

    toggleStat() {
        this.setState({
            stat: !this.state.stat
        })
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
                }, () => {
                    this.getActualGame();
                });
            }
        }
        );
    }

    getActualGame() {
        if (this.state.modal) {
            console.log("UserList getData", this.props.user);

            const { user } = this.props;
            const { connErr } = this.props.data;

            if (!connErr) {
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
        let save = true;
        const data = this.props.data;
        const users = data.users;
        const { user } = this.props;
        this.toggle();
        let { buyIn, won, bounty, date } = this.state;
        if (buyIn === '' || isNaN(buyIn)) {
            buyIn = 0;
        }
        if (won === '' || isNaN(won)) {
            won = 0;
        }
        if (bounty === '' || isNaN(bounty)) {
            bounty = 0;
        }
        user.sumBuyIn = 0;
        user.sumWon = 0;
        user.sumBounty = 0;
        user.gamesPlayed = 0;

        for (let i = 0; i < user.games.length; i++) {
            if (this.state.date === user.games[i].date) {
                if (user.games[i].buyIn !== buyIn || user.games[i].won !== won || user.games[i].bounty !== bounty|| user.lastBuyInOk !== this.state.lastBuyInOk) {
                    user.games[i].buyIn = buyIn;
                    user.games[i].won = won;
                    user.games[i].bounty = bounty;
                } else {
                    save = false;
                }
                found = true;
                    console.log("game successfully updated " + user.name + ", date: " + date + " buyIn " + user.games[i].buyIn + " won " + user.games[i].won, " bounty ", user.games[i].bounty);
            }
            if (user.games[i].buyIn > 0) {
                user.sumBuyIn += user.games[i].buyIn;
                user.sumWon += user.games[i].won;
                user.sumBounty += user.games[i].bounty;
                user.gamesPlayed++;
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

            user.sumBuyIn += buyIn;
            user.sumWon += won;
            user.sumBounty += bounty;
            if (buyIn > 0) {
                user.gamesPlayed++;
            }

             console.log("game successfully created " + user.name + ", date: " + this.state.date + " buyIn " + game.buyIn + " won " + game.won, " bounty ", game.bounty);
        }

        user.lastBuyIn = buyIn > 0 && user.lastBuyIn <= moment(date).format() ? moment(date).format() : firstDay;
        user.lastBuyInOk = buyIn > 0 ? this.state.lastBuyInOk : firstDay;

        data.games = this.calcGames(users);
        if (save) {
            store.dispatch(saveUsers(data));
        }
        this.props.saved();
    }

    toggleLastBuyInOk() {
        const { user } = this.props;
        this.setState({
            lastBuyInOk: user.lastBuyInOk < lastDay ? user.lastBuyIn : firstDay
        });
    }

    calcGames(users, ) {
        let list = [];
        for (let i in users) {
            for (let j in users[i].games) {
                if (users[i].games[j].buyIn > 0) {
                    const game = users[i].games[j];
                    let index = _.findIndex(list, o => {
                        console.log("index o", o);
                        return o.date === game.date
                    });
                    console.log("index", index, game.date, list);

                    let data = {};
                    if (index === -1) {
                        index = list.length;
                        data = {
                            date: game.date,
                            buyIn: game.buyIn,
                            won: game.won,
                            bounty: game.bounty,
                            players: 1,
                            rank: [],
                        };
                    } else {
                        data = {
                            date: game.date,
                            buyIn: game.buyIn + list[index].buyIn,
                            won: game.won + list[index].won,
                            bounty: game.bounty + list[index].bounty,
                            players: 1 + list[index].players,
                            rank: list[index].rank,
                        };
                    }
                    if (game.won > 0) {
                        data.rank.push({
                            name: users[i].name,
                            won: game.won,
                        });
                        data.rank = _.sortBy(data.rank, (r) => -r.won);
                    }
                    list[index] = data;
                }
            }
        }

        return _.sortBy(list, (d) => {
            return -new Date(d.date)
        });
    }

    handleKeyPress(target) {
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

    getBackgroundColor(user) {
        if (user.lastBuyInOk > lastDay) {
            return "#D2EDDA";
        }
        if (user.lastBuyIn > lastDay) {
            return "#CCE5FF";
        }
        return "white";
    }

    render() {
        const { user } = this.props;
        return (<div>
            <ListGroupItem key={this.props.key}
                style={{
                    color: this.props.blue ? "#007BFF" : "black",
                    backgroundColor: this.getBackgroundColor(user),
                }}
                className={"userList"}>
                <Row>
                    <Col xs="1"
                        onClick={this.toggleStat}
                        style={{ paddingLeft: "25px" }}
                    >
                        <Statistic user={user} today={this.props.date} toggle={this.state.stat}
                            resetToggle={() => {
                                this.setState({ stat: false })
                            }} />
                    </Col>
                    <Col xs="8" onClick={this.toggleStat}
                        style={{ paddingLeft: "25px", paddingRight: "0" }}
                    >
                        <b>{user.name}</b>
                    </Col>
                    <Col xs="2" onClick={this.toggle} style={{ textAlign: "right", paddingLeft: "0", paddingRight: "10px" }}>
                        <FontAwesomeIcon icon={faRubleSign} />
                    </Col>
                </Row>
            </ListGroupItem>
            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}
                onKeyPress={this.handleKeyPress}>
                <ModalHeader toggle={this.toggle}>{user.name}</ModalHeader>
                <ModalBody>
                    <Row>
                        <Col xs="5">
                            Date
                            </Col>
                        <Col xs="7">
                            <Input type="date" name="date" id="date"
                                onChange={this.updateDate}
                                value={this.state.date}
                                style={{ color: isToday(this.state.date) }}
                            />
                        </Col>
                    </Row>

                    {!UserList.isAdmin() ?
                        <div>
                            <Row style={{ paddingTop: "6px" }}>
                                <Col xs="5">
                                    <div style={{ display: 'inline-block' }}>Buy In</div>
                                </Col>
                                <Col xs="7">
                                    {this.state.buyIn > 0 ? this.state.buyIn : 0}
                                </Col>
                            </Row>
                            <Row style={{ paddingTop: "6px" }}>
                                <Col xs="5">
                                    <div style={{ display: 'inline-block' }}>Won</div>
                                </Col>
                                <Col xs="7">
                                    {this.state.won > 0 ? this.state.won : 0}
                                </Col>
                            </Row>
                            <Row style={{ paddingTop: "6px" }}>
                                <Col xs="5">
                                    <div style={{ display: 'inline-block' }}>Bounty's</div>
                                </Col>
                                <Col xs="7">
                                    {this.state.bounty > 0 ? this.state.bounty : 0}
                                </Col>
                            </Row>
                        </div>
                        :
                        <div>
                            <Row style={{ paddingTop: "6px" }}>
                                <Col xs="5">
                                    <div>Buy In</div>
                                </Col>
                                <Col xs="7">
                                    <ButtonGroup>
                                        <Button onClick={() => this.setState({ buyIn: _.parseInt(this.state.buyIn - 12) })} color="danger">
                                            -
                                            </Button>
                                        <Input autoFocus
                                            type="number" name="buyIn" id="buyIn"
                                            onChange={this.updateBuyIn}
                                            value={this.state.buyIn}
                                        />
                                        <Button onClick={() => this.setState({ buyIn: _.parseInt(this.state.buyIn + 12) })} color="success">
                                            +
                                            </Button>
                                    </ButtonGroup>
                                </Col>
                            </Row>
                            <Row style={{ paddingTop: "6px" }}>
                                <Col xs="5">
                                    <div style={{ display: 'inline-block' }}>Won</div>
                                </Col>
                                <Col xs="7">
                                    <ButtonGroup>
                                        <Button onClick={() => this.setState({ won: _.parseInt(this.state.won - 10) })} color="danger">
                                            -
                                            </Button>
                                        <Input autoFocus
                                            type="number" name="won" id="won"
                                            onChange={this.updateWon}
                                            value={this.state.won}
                                        />
                                        <Button onClick={() => this.setState({ won: _.parseInt(this.state.won + 10) })} color="success">
                                            +
                                            </Button>
                                    </ButtonGroup>
                                </Col>
                            </Row>
                            <Row style={{ paddingTop: "6px" }}>
                                <Col xs="5">
                                    <div style={{ display: 'inline-block' }}>Bounty's Won</div>
                                </Col>
                                <Col xs="7">
                                    <ButtonGroup>
                                        <Button onClick={() => this.setState({ bounty: _.parseInt(this.state.bounty - 2) })} color="danger">
                                            -
                                            </Button>
                                        <Input autoFocus
                                            type="number" name="bounty" id="bounty"
                                            onChange={this.updateBounty}
                                            value={this.state.bounty}
                                        />
                                        <Button onClick={() => this.setState({ bounty: _.parseInt(this.state.bounty + 2) })} color="success">
                                            +
                                            </Button>
                                    </ButtonGroup>
                                </Col>
                            </Row>
                            {user.lastBuyIn > lastDay ?
                                <Row style={{ paddingTop: "12px" }}>
                                    <Col xs="5">
                                    </Col>
                                    <Col xs="7">
                                        <Form>
                                            <FormGroup check inline>
                                                <Label check>
                                                    <Input type="checkbox" checked={this.state.lastBuyInOk > lastDay} onClick={() => this.toggleLastBuyInOk()} /> finished today
                                            </Label>
                                            </FormGroup>
                                        </Form>
                                    </Col>
                                </Row>
                                : <div />}
                        </div>
                    }
                </ModalBody>
                <ModalFooter>
                    {UserList.isAdmin() ?
                        <Button color="primary" onClick={this.saveGame}
                            disabled={!this.state.dateOk}>Save</Button>
                        : <span />
                    }
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
)(UserList);