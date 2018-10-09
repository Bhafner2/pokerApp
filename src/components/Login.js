import React, {Component} from 'react';
import 'react-infinite-calendar/styles.css';

import {connect} from 'react-redux'
import {Button, Col, FormGroup, Input, Label, Row} from "reactstrap";

class Login extends Component {
    constructor(props) {
        super(props);
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
                            <Input type="email" name="email" id="email"/>
                        </FormGroup>
                    </Col>
                    <Col xs={1}/>
                </Row>
                <Row>
                    <Col xs={1}/>
                    <Col xs={10}>
                        <FormGroup>
                            <Label for="password">Password</Label>
                            <Input type="password" name="password" id="password"/>
                        </FormGroup>
                    </Col>
                    <Col xs={1}/>
                </Row>
                <Row>
                    <Col xs={1}/>
                    <Col xs={10}>
                        <FormGroup>
                            <br/>
                            <Button type="primary" name="login" onClick={this.props.login}>Login</Button>
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
