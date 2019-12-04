import {CardGroup, OddsCalculator} from 'poker-odds-calculator';
import React from 'react';
import {connect} from "react-redux";
import {Button, Col, Input, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table} from "reactstrap";
import * as _ from "lodash";

const NO_CARD = {display: "? ?", color: "#888888", value: 0};

class Cards extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            myCard: NO_CARD,
        };
        this.toggle = this.toggle.bind(this);
        this.setCard = this.setCard.bind(this);
    }

    toggle() {
        if (this.state.modal) {
            this.setState({
                modal: false,
            });
        } else {
            this.setState({
                modal: true,
                myCard: NO_CARD,
            });
        }
    }

    setCard(card) {
        console.log("card", card.value);
        // this.props.selected({card: value, owner: this.props.owner});

        if (this.state.myCard.value === card.value) {
            this.setState({
                myCard: NO_CARD
            })
        } else {
            this.setState({
                myCard: card,
                modal: false,
            })
        }
    }

    render() {
        const {myCard} = this.state;

        const numbers = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];
        const HEART = {shape: "♥", value: "h", color: "#DC3545"};
        const SPADE = {shape: "♠", value: "s", color: "#000000"};
        const DIAMOND = {shape: "♦", value: "d", color: "#DC3545"};
        const CLUB = {shape: "♣", value: "c", color: "#000000"};
        const forms = [HEART, SPADE, DIAMOND, CLUB];

        const selectedCards = (
            <Button onClick={this.toggle}
                    color={"primary"} style={{color: myCard.color}} outline
            >
                {myCard.display}
            </Button>
        );
        return (
            <span>
                {selectedCards}
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Select Cards for {this.props.owner}</ModalHeader>
                    <ModalBody>
                        <Table borderless size="sm" style={{paddingTop: "12px"}}>
                            <tbody>
                            {numbers.map((number) => {
                                return (
                                    <tr key={"cards" + number}>
                                        {forms.map((form) => {
                                            const card = {
                                                display: number + " "+ form.shape,
                                                color: form.color,
                                                value: number + form.value
                                            };
                                            return (
                                                <td key={"td" + number + form.shape}>
                                                    <Button
                                                        outline color={"primary"}
                                                        active={myCard.value === card.value}
                                                        size={"sm"}
                                                        value={card}
                                                        style={{color: form.color}}
                                                        onClick={() => this.setCard(card)}
                                                    >
                                                        {number} {form.shape}
                                                    </Button>
                                                </td>)
                                        })}
                                    </tr>
                                )
                            })}
                            </tbody>
                        </Table>

                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggle}>Exit</Button>
                    </ModalFooter>
                </Modal>
            </span>
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
)(Cards);