import {CardGroup, OddsCalculator} from 'poker-odds-calculator';
import React from 'react';
import {connect} from "react-redux";
import {Button, Col, Input, Modal, ModalBody, ModalFooter, ModalHeader, Row} from "reactstrap";
import * as _ from "lodash";

class Cards extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }


    updateCard(evt) {

        this.props.card = evt.target.value;

   }

    render() {
        return (
            <div>
                <Row>
                    <Col xs="4">
                        <div style={{display: 'inline-block'}}>Player 1</div>
                    </Col>
                    <Col xs="8">
                        <Input type="text" name="p1" id="p1"
                               onChange={this.updateCard}
                               value={this.props.card}
                        />
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
)(Cards);