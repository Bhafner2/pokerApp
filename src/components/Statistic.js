import React from 'react';
import {Button, Col, FormFeedback, FormGroup, Input, Modal, ModalBody, ModalFooter, ModalHeader, Row} from "reactstrap";
import {connect} from "react-redux";
import * as _ from 'lodash';
import chart from '../chart-bar-regular.svg';

let games = [];

class Statistic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            fromDate: '',
            toDate: '',
            dateOk: true,
        };

        this.toggle = this.toggle.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.updateFormDate = this.updateFormDate.bind(this);
        this.updateToDate = this.updateToDate.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal,
            toDate: this.props.today,
            fromDate: '2018-01-01',
        });
        this.getData()
    }


    handleKeyPress(target) {
        console.log("key pressed");
        if (target.charCode === 13) {
            console.log("enter pressed");
            this.toggle()
        } else if (target.charCode === 27) {
            console.log("esc pressed");
            this.toggle()
        }
    }

    getData() {
        games = [];
        const {user} = this.props;
        if (this.state.dateOk) {
            for (let i = 0; i < user.games.length; i++) {
                if (this.state.fromDate < user.games[i].date || this.state.toDate > user.games[i].date) {
                    if (user.games[i].buyIn > 0) {
                        games.push(user.games[i])
                    }
                }
            }
            console.log("games for stat ", games);
        } else {
            games = [];
        }
    }

    updateFormDate(evt) {
        this.setState({
                fromDate: evt.target.value
            }, () => {
                if (this.state.fromDate === '') {
                    this.setState({
                        dateOk: false,
                    })
                } else {
                    this.setState({
                        dateOk: true,
                    });
                }
                this.getData();
            }
        );
    }

    updateToDate(evt) {
        this.setState({
                toDate: evt.target.value
            }, () => {
                if (this.state.toDate === '') {
                    this.setState({
                        dateOk: false,
                    })
                } else {
                    this.setState({
                        dateOk: true,
                    });
                }
                this.getData();
            }
        );
    }


    render() {
        const {user} = this.props;
        return <div>
            <img className="chart" src={chart} alt={"chart"} onClick={this.toggle}/>

            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}
                   onKeyPress={this.handleKeyPress}>
                <ModalHeader toggle={this.toggle}>Statistic {user.name}</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Row>
                            <Col xs="4">
                                From
                            </Col>
                            <Col xs="8">
                                <Input type="date" name="fromDate" id="fromDate"
                                       onChange={this.updateFormDate}
                                       value={this.state.fromDate}
                                       style={this.state.dateOk ? {backgroundColor: 'white'} : {backgroundColor: 'red'}}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="4">
                                To
                            </Col>
                            <Col xs="8">
                                <Input type="date" name="toDate" id="toDate"
                                       onChange={this.updateToDate}
                                       value={this.state.toDate}
                                       style={this.state.dateOk ? {backgroundColor: 'white'} : {backgroundColor: 'red'}}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="8">
                                <div>Games played</div>
                            </Col>
                            <Col xs="4">
                                <div>{games.length}</div>
                            </Col>
                        </Row>


                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={this.toggle}>Exit</Button>
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
)(Statistic);
