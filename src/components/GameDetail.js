import React from 'react';
import {Popover, PopoverHeader, PopoverBody, Row, Col, Button} from 'reactstrap';
import moment from "moment/moment";
import ThisGame from "./ThisGame";

class GameDetail extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.close = this.close.bind(this);
        this.state = {
            popoverOpen: false
        };
    }

    toggle() {
        // this.setState({
        //     popoverOpen: !this.state.popoverOpen
        // });
    }

    close() {
        this.setState({
            popoverOpen: false
        });
    }

    render() {
        const {game, name, value} = this.props;
        return (
            <div id={'list' + name}>
                <Row>
                    <Col xs={3} onClick={this.toggle}>
                        <b>{name}</b>
                    </Col>
                    <Col xs={3} onClick={this.toggle}>
                        {value}
                    </Col>
                    <Col xs={3} onClick={this.toggle}>
                        {game.name}
                    </Col>
                    <Col xs={1} onClick={this.close}>
                        <ThisGame today={game.date} style={{height: "1em", backgroundColor: "white"}}/>
                    </Col>
                    <Col xs={2} onClick={this.close}/>
                </Row>
                <Popover placement="top" isOpen={this.state.popoverOpen}
                         target={'list' + name}
                         toggle={this.toggle}>
                    <PopoverHeader> <Button close onClick={this.close}/> The Game with the highest {name}
                    </PopoverHeader>
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
                                Date
                            </Col>
                            <Col xs={6}>
                                {moment(game.date).format('D.M.YY')}
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