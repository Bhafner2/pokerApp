import React, {Component} from 'react';
import './App.css';
import {Col, Input, ListGroup, ListGroupItem, Row} from 'reactstrap';
import moment from "moment/moment";
import 'react-infinite-calendar/styles.css';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import logo from './Poker.png';
import ToDoList from "./Component/ToDoList";

let game1 = {
    date: '2018-09-06',
    buyIn: 20,
    won: 30
};

let game3 = {
    date: '2018-09-06',
    buyIn: 100,
    won: 54
};

let game2 = {
    date: '2018-07-21',
    buyIn: 20,
    won: 30
};

let actualUser;

let user1 = {
    name: 'benj',
    games: [game1, game2]
};

let user2 = {
    name: 'hall1',
    games: [game2, game3]
};

let newUser = {
    name: '',
    games: []
};

let newGame = {
    date: '',
    buyIn: 0,
    won: 0
};

let users = [user1, user2];

let today = moment(new Date()).format('YYYY-MM-DD');
let actualDate = today;

let notToday = function () {
    if (actualDate !== today) {
        return {backgroundColor: 'red'}

    } else {
        return {backgroundColor: 'white'}
    }
};

let renderUsers = function () {
    return (
        <ListGroup key={"group"}>
            {users.map((user) =>
                <UserModal user={user}/>)}
            {console.log("render Users")}
        </ListGroup>
    );
};


class UserModal extends React.Component {
    user;
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            buyIn: 0,
            won: 0,
            date: actualDate
        };

        this.toggle = this.toggle.bind(this);
        this.updateWon = this.updateWon.bind(this);
        this.getActualGame = this.getActualGame.bind(this);
        this.updateWon = this.updateWon.bind(this);
        this.saveGame = this.saveGame.bind(this);
        this.updateBuyIn = this.updateBuyIn.bind(this);
        this.updateDate = this.updateDate.bind(this);

    }

    componentDidMount() {
        this.setState({
            date: actualDate
        });
        console.log("modal open with date : " + actualDate);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        }, () => {
            if (this.state.modal) {
                this.setState({
                    date: actualDate
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
                actualDate = this.state.date;
                console.log("new date " + actualDate);
                this.getActualGame();
            }
        );


    }

    getActualGame() {
        console.log("search game for user " + actualUser.name + " on date " + actualDate);
        for (let i = 0; i < actualUser.games.length; i++) {
            if (actualDate === actualUser.games[i].date) {
                this.setState({
                    buyIn: actualUser.games[i].buyIn,
                    won: actualUser.games[i].won
                });
                console.log("game found");
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
            buyIn: evt.target.value
        });
    }

    updateWon(evt) {
        this.setState({
            won: evt.target.value
        });
    }

    saveGame() {
        let found = false;
        for (let i = 0; i < actualUser.games.length; i++) {
            if (actualDate === actualUser.games[i].date) {
                actualUser.games[i].buyIn = this.state.buyIn;
                actualUser.games[i].won = this.state.won;
                found = true;
                console.log("game successfully updated, date: " + actualDate + " buyIn " + this.state.buyIn + " won " + this.state.won);
                break;
            }
        }
        if (!found) {
            newGame.date = this.state.date;
            newGame.buyIn = this.state.buyIn;
            newGame.won = this.state.won;
            actualUser.games.push(newGame);
            console.log("game successfully created, date: " + actualDate + " buyIn " + this.state.buyIn + " won " + this.state.won)
        }
        this.toggle()
    }

    getUsername() {
        actualUser = this.props.user;
        console.log("update actual user " + actualUser.name);
        return (actualUser.name)
    }

    render() {
        return (<div>
                <ListGroupItem key={this.getUsername()} onClick={this.toggle}>
                    <div>
                        <b>{this.getUsername()}</b>
                    </div>
                </ListGroupItem>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>{actualUser.name}</ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col xs="4">
                                Date
                            </Col>
                            <Col xs="8">
                                <Input type="date" name="date" id="date"
                                       onChange={this.updateDate}
                                       value={this.state.date}
                                       style={notToday()}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="4">
                                <div>BuyIn</div>
                            </Col>
                            <Col xs="8">
                                <Input type="number" name="buyIn" id="buyIn"
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
                {console.log("new date " + this.state.date)}
                {console.log("new won " + this.state.won)}
                {console.log("new buyIn " + this.state.buyIn)}
            </div>
        );
    }
}

class Buttons extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            username: ''
        };

        this.toggle = this.toggle.bind(this);
        this.addUser = this.addUser.bind(this);
        this.updateUser = this.updateUser.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        }, () => {
            this.setState({
                username: ''
            })
        });
    }

    updateUser(evt) {
        this.setState({
            username: evt.target.value
        });
    }

    addUser() {
        let create = true;
        if (this.state.username === '') {
            alert('Username empty!');
            create = false;
        }
        for (let i = 0; i < users.length; i++) {
            if (users[i].name === this.state.username) {
                alert('User already exists!');
                create = false;
            }
        }
        if (create) {
            newUser.name = this.state.username;
            users.push(newUser);
            console.log("save User :" + newUser.name);
            this.toggle();
            alert('Done!');
        }
    }

    render() {
        return <div>
            <Button>
                Statistic
            </Button>
            <Button key="add" onClick={this.toggle}>
                Add User
            </Button>

            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                <ModalHeader toggle={this.toggle}>New User</ModalHeader>
                <ModalBody>
                    <Input type="text" name="user" id="user"
                           placeholder="Username"
                           onChange={this.updateUser}
                           value={this.state.username}/>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.addUser}>Save</Button>
                    <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
            {console.log("username " + this.state.username)}
        </div>;
    }
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            globalDate: actualDate
        };
        this.updateDate = this.updateDate.bind(this);
    }
    componentDidMount() {
        this.setState({
            globalDate: actualDate
        });
        console.log("global with date : " + actualDate);
    }

    updateDate(evt) {
        this.setState({
            globalDate: evt.target.value
        });
        actualDate = evt.target.value;
    }

    render() {
        return (
            <div className="App">
                <header className="header">
                    <Row>
                        <Col xs="4">
                            <img className="logo" src={logo} alt={"logo"}/>
                        </Col>
                        <Col xs="8">
                            <h1>Poker Statistic</h1>
                        </Col>
                    </Row>
                    {console.log("global date: " + actualDate)}
                </header>
                <Buttons/>
                <Input type="date" name="date" id="date"
                       value={this.state.globalDate}
                       onChange={this.updateDate}
                       style={notToday()}
                />
                <div>
                    {renderUsers()}
                </div>



                    {/*<ToDoList />*/}

            </div>
        );
    }
}

export default App;
