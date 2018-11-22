import {CardGroup, OddsCalculator} from 'poker-odds-calculator';
import React from 'react';
import {connect} from "react-redux";
import {
    Button,
    ButtonDropdown,
    Col, DropdownItem, DropdownMenu,
    DropdownToggle,
    Input,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row
} from "reactstrap";
import * as _ from 'lodash';


class Odds extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            p1: '',
            p2: '',
            p3: '',
            p4: '',
            b: '',
            result: '',
            dropdownOpen: false,
            loading: false,
        };
        this.toggle = this.toggle.bind(this);
        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.calcOdds = this.calcOdds.bind(this);

        /*TODO https://www.npmjs.com/package/poker-odds-calculator*/
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    toggleDropdown() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    calcOdds() {
        this.setState({
            loading: true,
        }, () => {

            try {
                let {p1, p2, p3, p4, b} = this.state;
                let player1Cards;
                let player2Cards;
                let board;

                if (!_.isNil(p1)) {
                    try {
                        player1Cards = CardGroup.fromString(p1.toString());
                    } catch (e) {
                    }
                }
                if (!_.isNil(p2)) {
                    try {
                        player2Cards = CardGroup.fromString(p2.toString());
                    } catch (e) {
                    }
                }
                if (!_.isNil(b)) {
                    try {
                        board = CardGroup.fromString(b.toString());
                    } catch (e) {
                    }
                }

                /*
                JhJs
                JdQd
                7d9dTs
                */

                const result = OddsCalculator.calculate([player1Cards, player2Cards], board);

                this.setState({result});
                console.log(`Player #1 - ${player1Cards} - ${result.equities[0].getEquity()}%`);
                console.log(`Player #2 - ${player2Cards} - ${result.equities[1].getEquity()}%`);
            } catch (e) {
                console.log(e)
            }
        });
        this.setState({
            loading: false
        });
    }

    render() {
        let {p1, p2, p3, p4, b, loading, result} = this.state;

        return (
            <div>
                <i className="fa fa-balance-scale" onClick={this.toggle}
                   style={{fontSize: "30px"}}/>

                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Odds Calculator</ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col>
                                <b>Notation: <br/></b>
                                h = ♥ heart<br/>
                                s = ♠ spades<br/>
                                d = ♦ diamonds<br/>
                                c = ♣ clubs<br/>
                                2-9, T, J, Q, K, A<br/>
                                Write without spaces, e.g. AhTd <br/>
                            </Col>
                        </Row>
                        <br/>
                        <Row>
                            <Col xs="4">
                                <div style={{display: 'inline-block'}}>Player 1</div>
                            </Col>
                            <Col xs="8">
                                <Input type="text" name="p1" id="p1"
                                       onChange={p => this.setState({p1: p.target.value})}
                                       value={p1}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="4">
                                <div style={{display: 'inline-block'}}>Player 2</div>
                            </Col>
                            <Col xs="8">
                                <Input type="text" name="p1" id="p1"
                                       onChange={p => this.setState({p2: p.target.value})}
                                       value={p2}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="4">
                                <div style={{display: 'inline-block'}}>Board</div>
                            </Col>
                            <Col xs="8">
                                <Input type="text" name="p1" id="p1"
                                       onChange={p => this.setState({b: p.target.value})}
                                       value={b}
                                />
                            </Col>
                        </Row>
                        <br/>
                        <div>
                            {_.isNil(result.equities) ? <div/> :
                                <div>
                                    <Row>
                                        <Col xs="4">
                                            <div style={{display: 'inline-block'}}>Player 1</div>
                                        </Col>
                                        <Col xs="4">
                                            Win: {result.equities[0].getEquity()}%
                                        </Col>
                                        <Col xs="4">
                                            Tie: {result.equities[0].getTiePercentage()}%
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="4">
                                            <div style={{display: 'inline-block'}}>Player 2</div>
                                        </Col>
                                        <Col xs="4">
                                            Win: {result.equities[1].getEquity()}%
                                        </Col>
                                        <Col xs="4">
                                            Tie: {result.equities[1].getTiePercentage()}%
                                        </Col>
                                    </Row>
                                </div>
                            }
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" disabled={loading} onClick={this.calcOdds}>Calc</Button>
                        <Button color="secondary" onClick={this.toggle}>Exit</Button>
                    </ModalFooter>
                </Modal>
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
)(Odds);