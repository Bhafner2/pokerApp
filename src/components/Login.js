import React, {Component} from 'react';
import 'react-infinite-calendar/styles.css';
import firebase from "../config/firebase";
import {connect} from 'react-redux'
import {Button, Col, FormFeedback, FormGroup, Input, Label, Row} from "reactstrap";
import {loginError} from "../redux/actions";
import {store} from "../redux/store";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
        };
        this.updatePassword = this.updatePassword.bind(this);
        this.updateEmail = this.updateEmail.bind(this);
        this.login = this.login.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    login() {
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).catch(function (error) {
            store.dispatch(loginError(error.message));
        });
    }

    updateEmail(evt) {
        this.setState({
            email: evt.target.value
        });
        store.dispatch(loginError(''));
    }

    updatePassword(evt) {
        this.setState({
            password: evt.target.value
        });
        store.dispatch(loginError(''));
    }

    handleKeyPress(target) {
        console.log("key pressed");
        if (target.charCode === 13) {
            this.login()
        }
    }

    render() {
        return (
            <div onKeyPress={this.handleKeyPress}>
                <Row>
                    <Col xs={1}/>
                    <Col xs={10}>
                        <FormGroup>
                            <br/>
                            <br/>
                            <Label for="email">Email</Label>
                            <Input type="email" name="email" id="email"
                                   onChange={this.updateEmail}
                                   value={this.state.email}
                            />
                        </FormGroup>
                    </Col>
                    <Col xs={1}/>
                </Row>
                <Row>
                    <Col xs={1}/>
                    <Col xs={10}>
                        <FormGroup>
                            <Label for="password">Password</Label>
                            <Input type="password" name="password" id="password"
                                   onChange={this.updatePassword}
                                   value={this.state.password}
                            />
                        </FormGroup>
                    </Col>
                    <Col xs={1}/>
                </Row>
                <Row>
                    <Col xs={1}/>
                    <Col xs={10}>
                        <FormGroup>
                            <Button type="primary" name="login" onClick={this.login}>Login</Button>
                        </FormGroup>
                    </Col>
                    <Col xs={1}/>
                </Row>
                <Row>
                    <Col xs={1}/>
                    <Col xs={10}>
                        <FormGroup>
                            <div style={{color: "red", fontSize: "0.8em"}}>{this.props.data.loginError}</div>
                        </FormGroup>
                    </Col>
                    <Col xs={1}/>
                </Row>
            </div>
        )
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
)(Login);
