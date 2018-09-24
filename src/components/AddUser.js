import React from 'react';
import {Button, FormFeedback, FormGroup, Input, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {store} from "../redux/store";
import {saveUsers} from "../redux/actions"
import {connect} from "react-redux";
import * as _ from 'lodash';


class AddUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            username: '',
            usernameOk: false,
            onOpen: true,
            field: false,
        };

        this.toggle = this.toggle.bind(this);
        this.addUser = this.addUser.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.checkUser = this.checkUser.bind(this);
    }

    componentDidMount() {
        this.setState({
                field: true,
                onOpen: true,
            }
        );
        if (this.props.data.connErr) {
            this.setState({
                usernameOk: false,
                errorText: 'No connection to Server!'
            });
        }
    }

    toggle() {
        this.setState({
            modal: !this.state.modal,
            onOpen: true,
        }, () => {
            this.setState({
                username: '',
                usernameOk: false,
            })
        });
    }

    updateUser(evt) {
        this.setState({
                username: evt.target.value,
                onOpen: false,
            }, () => {
                this.checkUser()
            }
        );

    }

    checkUser() {
        const {users} = this.props.data;
        if (_.isNil(users)) {
            this.setState({
                usernameOk: false,
                errorText: 'no connection to Server',
            });
        } else {
            if (this.state.username !== '') {
                for (let i = 0; i < users.length; i++) {
                    if (users[i].name.toLowerCase() === this.state.username.toLowerCase()) {
                        this.setState({
                            usernameOk: false,
                            errorText: 'already taken!'
                        });
                    } else {
                        this.setState({
                            usernameOk: true,
                            errorText: '',
                        });
                    }
                }
            } else {
                this.setState({
                    usernameOk: false,
                    errorText: 'empty!'
                });
            }
        }
    }

    handleKeyPress(target) {
        console.log("key pressed");
        if (target.charCode === 13) {
            console.log("enter pressed");
            this.addUser()
        } else if (target.charCode === 27) {
            console.log("esc pressed");
            this.toggle()
        }
    }

    addUser() {
        console.log("users befor adding ", this.props.data.users);
        let users = Object.assign(this.props.data.users);
        let user = {
            name: '',
            games: [
                {
                    date: '2000-01-01',
                    buyIn: 0,
                    won: 0,
                    bounty: 0
                }]
        };
        user.name = this.state.username;
        users.push(user);
        console.log("users after adding ", users);
        console.log("save User :" + user.name);
        this.toggle();
        this.props.saved();
        store.dispatch(saveUsers(users));
        this.setState({
            usernameOk: false,
            errorText: 'Enter a Username',
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps !== this.props) {
            this.checkUser();
        }
    }

    render() {
        return <div>
            <Button key="add" onClick={this.toggle}>
                Add User
            </Button>

            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}
                   onKeyPress={this.handleKeyPress}>
                <ModalHeader toggle={this.toggle}>New User</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Input autoFocus={true}
                               valid={this.state.usernameOk}
                               invalid={!this.state.usernameOk && !this.state.onOpen}
                               type="text" name="user" id="user"
                               placeholder="Username"
                               onChange={this.updateUser}
                               value={this.state.username}
                               onKeyPress={this.handleKeyPress}
                        />
                        <FormFeedback invalid>{this.state.errorText}</FormFeedback>
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.addUser} disabled={!this.state.usernameOk}>Save</Button>
                    <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>;
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
)(AddUser);
