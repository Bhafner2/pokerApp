import React from 'react';
import {Popover, PopoverHeader, PopoverBody, Row, Col} from 'reactstrap';

class GameDetail extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            popoverOpen: false
        };
    }

    toggle() {
        this.setState({
            popoverOpen: !this.state.popoverOpen
        });
    }

    render() {
        const {game, name, value} = this.props;
        return (
            <div id={'list' + name} onClick={this.toggle}>
                <Row>
                    <Col xs={4}>
                        <b>{name}</b>
                    </Col>
                    <Col xs={2}>
                        {value}
                    </Col>
                    <Col xs={6}>
                        {game.name}
                    </Col>
                </Row>
                <Popover placement="top" isOpen={this.state.popoverOpen}
                         target={'list' + name}
                         toggle={this.toggle}>
                    <PopoverHeader>The Game with the highest {name}</PopoverHeader>
                    <PopoverBody>
                        <Row>
                            <Col xs={4}>
                                Name
                            </Col>
                            <Col xs={6}>
                                {game.name}
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={4}>
                                BuyIn
                            </Col>
                            <Col xs={6}>
                                {game.buyIn}
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={4}>
                                Won
                            </Col>
                            <Col xs={6}>
                                {game.won}
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={4}>
                                Bounty
                            </Col>
                            <Col xs={6}>
                                {game.bounty}
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={4}>
                                Total
                            </Col>
                            <Col xs={6}>
                                {game.won + game.bounty - game.buyIn}
                            </Col>
                        </Row>
                    </PopoverBody>
                </Popover>
            </div>
        );
    }
}

export default GameDetail;