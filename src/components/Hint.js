import React from 'react';
import { Popover, PopoverHeader, PopoverBody, Row, Col, Input, Button, Table } from 'reactstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import { showNumber } from '../App';

class Hint extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.getBountyPercent = this.getBountyPercent.bind(this);
        this.update = this.update.bind(this);
        this.updateWonManual = this.updateWonManual.bind(this);
        this.state = {
            popoverOpen: false,
            percent: 0,
            wonManual: 0,
        };
    }

    toggle() {
        const { bountyAmount, potAmount } = this.props.data.config;

        this.setState({
            popoverOpen: !this.state.popoverOpen,
            percent: bountyAmount / potAmount * 100,
        });
    }

    update(evt) {
        this.setState({
            percent: evt.target.value,
        }
        );

    }

    updateWonManual(evt) {
        this.setState({
            wonManual: evt.target.value,
        }
        );

    }

    getBountyPercent() {
        return (this.state.percent / 100) + 1;
    }

    render() {
        const { sum, buyIn, won, wonManual, bounty } = this.props;
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
                        <FontAwesomeIcon icon={faQuestionCircle} onClick={this.toggle} size="lg" />
                    </Col>
                </Row>
                <Row>
                    <Col xs="12" style={{ fontSize: "0.8em" }} onClick={this.toggle}>
                        the checksum should be 0
                    </Col>
                </Row>
                <Popover placement="top" isOpen={this.state.popoverOpen}
                    target={'error'}
                    toggle={this.toggle}>
                    <PopoverHeader> <Button close onClick={this.toggle} /> Checksum error in Game:
                        actual checksum is {sum}
                    </PopoverHeader>
                    <PopoverBody>
                        <Row>
                            <Col xs={7}>
                                <span style={{ display: 'inline-block', paddingTop: '1.1em' }}>Bounty's in %</span>
                            </Col>
                            <Col xs={5}>
                                <Input type="text" name="per" id="per"
                                    placeholder="%"
                                    onChange={this.update}
                                    value={this.state.percent}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={7}>
                                <span style={{ display: 'inline-block', paddingTop: '1.1em' }}>Cash counted</span>
                            </Col>
                            <Col xs={5}>
                                <Input type="text" name="man" id="man"
                                    onChange={this.updateWonManual}
                                    value={this.state.wonManual}
                                />
                            </Col>
                        </Row>
                        <br />
                        <Table borderless size="sm" style={{ paddingTop: "12px" }}>
                            <tbody>
                                <tr>
                                    <td>
                                    </td>
                                    <td>
                                        Actual
                                    </td>
                                    <td>
                                        calc %
                                    </td>
                                    <td>
                                        calc cash
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Buy In
                                    </td>
                                    <td>
                                        {buyIn}
                                    </td>
                                    <td>
                                        {buyIn}
                                    </td>
                                    <td>
                                        {buyIn}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Won
                                    </td>
                                    <td>
                                        {won}
                                    </td>
                                    <td>
                                        {showNumber(buyIn / this.getBountyPercent())}
                                    </td>
                                    <td>
                                        {this.state.wonManual}

                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        Bounty
                                    </td>
                                    <td>
                                        {bounty}
                                    </td>
                                    <td>
                                        {showNumber(buyIn - buyIn / this.getBountyPercent())}
                                    </td>
                                    <td>
                                        {buyIn - this.state.wonManual}
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </PopoverBody>
                </Popover>
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
)(Hint);
