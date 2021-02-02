import React from 'react';
import {Popover, PopoverHeader, PopoverBody, Row, Col, Input, Button} from 'reactstrap';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faQuestionCircle} from "@fortawesome/free-solid-svg-icons";
import {BOUNTY_AMOUNT, POT_AMOUNT, showNumber} from "../App";

class Hint extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.getBountyPercent = this.getBountyPercent.bind(this);
        this.update = this.update.bind(this);
        this.state = {
            popoverOpen: false,
            percent: POT_AMOUNT + BOUNTY_AMOUNT,
        };
    }

    toggle() {
        this.setState({
            popoverOpen: !this.state.popoverOpen

        });
    }

    update(evt) {
        this.setState({
                percent: evt.target.value,
            }
        );

    }

    getBountyPercent() {
        return (this.state.percent / 100) + 1;
    }

    render() {
        const {sum, buyIn, won, bounty} = this.props;
        return (
            <div id={'error'}>
                <Row>
                    <Col xs="5" onClick={this.toggle}>
                        <b>Checksum</b>
                    </Col>
                    <Col xs="2" onClick={this.toggle}>
                        {sum}
                    </Col>
                    <Col xs="2">
                        <FontAwesomeIcon icon={faQuestionCircle} onClick={this.toggle} size="lg"/>
                    </Col>
                </Row>
                <Row>
                    <Col xs="12" style={{fontSize: "0.8em"}} onClick={this.toggle}>
                        the checksum should be 0
                    </Col>
                </Row>
                <Popover placement="top" isOpen={this.state.popoverOpen}
                         target={'error'}
                         toggle={this.toggle}>
                    <PopoverHeader> <Button close onClick={this.toggle}/> Checksum error in Game:
                        actual checksum is {sum}
                    </PopoverHeader>
                    <PopoverBody>
                        <Row>
                            <Col xs={5}>
                                <span style={{display: 'inline-block', paddingTop: '1.1em'}}>Bounty's in %</span>
                            </Col>
                            <Col xs={4}>
                                <Input type="text" name="per" id="per"
                                       placeholder="%"
                                       onChange={this.update}
                                       value={this.state.percent}
                                />
                            </Col>
                            <Col xs={3}/>
                        </Row>
                        <br/>
                        <Row>
                            <Col xs={4}/>
                            <Col xs={4}>
                                Actual
                            </Col>
                            <Col xs={4}>
                                Should
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={4}>
                                Buy In
                            </Col>
                            <Col xs={4}>
                                {buyIn}
                            </Col>
                            <Col xs={4}>
                                {buyIn}
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={4}>
                                Won
                            </Col>
                            <Col xs={4}>
                                {won}
                            </Col>
                            <Col xs={4}>
                                {showNumber(buyIn / this.getBountyPercent())}
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={4}>
                                Bounty
                            </Col>
                            <Col xs={4}>
                                {bounty}
                            </Col>
                            <Col xs={4}>
                                {showNumber(buyIn - buyIn / this.getBountyPercent())}
                            </Col>
                        </Row>
                    </PopoverBody>
                </Popover>
            </div>
        );
    }
}

export default Hint;