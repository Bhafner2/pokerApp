import React, {Component} from 'react';
import 'react-infinite-calendar/styles.css';
import firebase from "../config/firebase";
import {connect} from 'react-redux'
import {Button, Col, FormFeedback, FormGroup, Input, Label, Row} from "reactstrap";

let errorText = '';
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
    }

    login() {
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).catch(function (error) {
//TODO show errror
            alert(error.message);
            errorText = error.message;
        });


    }

    updateEmail(evt) {
        this.setState({
            email: evt.target.value
        });
    }

    updatePassword(evt) {
        this.setState({
            password: evt.target.value
        });
    }

    render() {
        return (
            <div>
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
                                   invalid={true}
                            />
                            <FormFeedback invalid>{errorText}</FormFeedback>
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
                            <br/>
                            <Button type="primary" name="login" onClick={this.login}>Login</Button>
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
