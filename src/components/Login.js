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
                    <Col>
                        <FormGroup>
                            <Label for="email">Email</Label>
                            <Input type="email" name="email" id="email"/>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormGroup>
                            <Label for="password">Password</Label>
                            <Input type="password" name="password" id="password"/>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormGroup>
                            <Button type="primary" name="login" onClick={this.props.login}>Login</Button>
                        </FormGroup>
                    </Col>
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
