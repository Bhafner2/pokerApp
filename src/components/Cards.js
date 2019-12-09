import React from 'react';
import {connect} from "react-redux";
import {Button, Col, Input, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table} from "reactstrap";

const NO_CARD = {display: "??", color: "#007BFF", value: ''};

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
            this.props.selected(NO_CARD.value);
        }
    }

    setCard(card) {
        console.log("card selected", card.value);

        this.setState({
            myCard: card,
            modal: false,
        });
        this.props.selected(card.value);

    }

    render() {
        const {myCard} = this.state;

        const numbers = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
        const HEART = {shape: "♥", value: "h", color: "#DC3545"};
        const SPADE = {shape: "♠", value: "s", color: "#000000"};
        const DIAMOND = {shape: "♦", value: "d", color: "#DC3545"};
        const CLUB = {shape: "♣", value: "c", color: "#000000"};
        const forms = [SPADE, HEART, CLUB, DIAMOND];

        const selectedCards = (
            <Button onClick={this.toggle}
                    color={"primary"} style={{color: myCard.color, width: "2.8em"}} outline
                    size={"sm"}
            >
                {myCard.display}
            </Button>
        );
        return (
            <span
                style={{padding: "1px"}}
            >
                {selectedCards}
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Select card for {this.props.owner}</ModalHeader>
                    <ModalBody>
                        <Table borderless size="sm" style={{paddingTop: "12px"}}>
                            <tbody>
                            {numbers.map((number) => {
                                return (
                                    <tr key={"cards" + number}>
                                        {forms.map((form) => {
                                            const card = {
                                                display: number + form.shape,
                                                color: form.color,
                                                value: number + form.value,
                                            };

                                            let used = false;
                                            for (let i in this.props.usedCarts) {
                                                if (this.props.usedCarts[i] === card.value) {
                                                    used = true;
                                                    break;
                                                }
                                            }

                                            return (
                                                <td key={"td" + number + form.shape}>
                                                    <Button
                                                        outline={!used}
                                                        color={"secondary"}
                                                        disabled={used}
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
                        <Button color="secondary" onClick={this.toggle}>No Card</Button>
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