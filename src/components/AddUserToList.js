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
    }

    componentDidMount() {
        this.setState({
                field: true,
                onOpen: true,
            }
        )
    }

    toggle() {
        this.setState({
            modal: !this.state.modal,
            onOpen: true,
        }, () => {
            this.setState({
                username: ''
            })
        });
    }

    updateUser(evt) {
        const {users} = this.props.asdf;
        this.setState({
                username: evt.target.value,
                onOpen: false,
            }, () => {
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
                                break;
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
        );
    }

    addUser() {
        console.log("users befor adding ", this.props.asdf.users);
        let users = Object.assign(this.props.asdf.users);
        let user = {
            name: '',
            games: [
                {
                    date: '2000-01-01',
                    buyIn: 0,
                    won: 0
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

    render() {
        return <div>
            <Button key="add" onClick={this.toggle}>
                Add User
            </Button>

            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                <ModalHeader toggle={this.toggle}>New User</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Input
                            valid={this.state.usernameOk}
                            invalid={!this.state.usernameOk && !this.state.onOpen}
                            type="text" name="user" id="user"
                            placeholder="Username"
                            onChange={this.updateUser}
                            value={this.state.username}
                            autoFocus={this.state.field}
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
        asdf: state
    }
};

export default connect(
    mapStateToProps,
    {}
)(AddUser);
