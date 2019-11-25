import React from 'react';
import {
    Button, ButtonGroup, Card, CardBody, CardFooter,
    Col, Collapse, FormGroup,
    Input, InputGroup, ModalBody,
    Row,
} from "reactstrap";
import * as _ from 'lodash';
import moment from "moment";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFilter} from "@fortawesome/free-solid-svg-icons";


class TimeFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showFilter: false,
            fromDate: '',
            toDate: '',
            dateOk: true,
            filtered: false,
        };

        this.last3m = this.last3m.bind(this);
        this.last6m = this.last6m.bind(this);
        this.lastYear = this.lastYear.bind(this);
        this.this12m = this.this12m.bind(this);
        this.showFilter = this.showFilter.bind(this);
        this.resetFilter = this.resetFilter.bind(this);
        this.updateFormDate = this.updateFormDate.bind(this);
        this.updateToDate = this.updateToDate.bind(this);

    }

    componentDidMount() {//TODO beim toggle

    }

    updateFormDate(evt) {
        this.setState({
                fromDate: evt.target.value
            }, () => {
                if (this.state.fromDate === '' || new Date(this.state.toDate) < new Date(this.state.fromDate)) {
                    this.setState({
                        dateOk: false,
                    }, () => {
                        this.props.getData();
                    });
                } else {
                    this.setState({
                        dateOk: true,
                    }, () => {
                        this.props.getData();
                    });
                }
            }
        );
    }

    updateToDate(evt) {
        this.setState({
                toDate: evt.target.value
            }, () => {
                if (this.state.toDate === '' || new Date(this.state.toDate) < new Date(this.state.fromDate)) {
                    this.setState({
                        dateOk: false,
                    }, () => {
                        this.calc()
                    });
                } else {
                    this.setState({
                        dateOk: true,
                    }, () => {
                        this.calc()
                    });
                }
            }
        );
    }

    last3m() {
        const months = 3;
        let d = new Date(this.props.today);
        d.setMonth(d.getMonth() - months);
        this.setState({
            fromDate: moment(d).format('YYYY-MM-DD'),
            toDate: this.props.today,
            dateOk: true,
        }, () => {
            this.calc()
        })
    }

    last6m() {
        const months = 6;
        let d = new Date(this.props.today);
        d.setMonth(d.getMonth() - months);
        this.setState({
            fromDate: moment(d).format('YYYY-MM-DD'),
            toDate: this.props.today,
            dateOk: true,
        }, () => {
            this.calc()
        })
    }


    lastYear() {
        let d = new Date(this.props.today);
        this.setState({
            fromDate: (d.getFullYear() - 1) + '-01-01',
            toDate: (d.getFullYear() - 1) + '-12-31',
            dateOk: true,
        }, () => {
            this.calc()
        })
    }

    this12m() {
        let d = new Date(this.props.today);
        this.setState({
            fromDate: d.getFullYear() + '-01-01',
            toDate: d.getFullYear() + '-12-31',
            dateOk: true,
        }, () => {
            this.calc()
        })
    }

    resetFilter() {
        this.props.reset = false;
        this.setState({
            dateOk: true,
            fromDate: this.props.fromDate || '2018-01-01',
            toDate: this.props.today,
            showFilter: false,
        }, () => {
            this.this12m()
        });
    }

    showFilter() {
        this.setState({
            showFilter: !this.state.showFilter,
        })
    }

    calc() {
        let d = new Date(this.props.today);
        const filtered = !(this.state.fromDate === d.getFullYear() + '-01-01' && this.state.toDate === d.getFullYear() + '-12-31');
        this.props.getData(this.state.fromDate, this.state.toDate);
        this.setState({filtered})
    }

    render() {
        return (
            <FormGroup>
                <Row>
                    <Col>
                        <ButtonGroup>
                            <Button color={"link"} onClick={this.showFilter}
                                    style={{color: this.state.filtered ? "#007BFF" : "black"}}
                            >
                                <FontAwesomeIcon icon={faFilter}/> Filter
                            </Button>
                            <Button
                                color={"link"}
                                onClick={this.resetFilter}
                                style={{
                                    visibility: this.state.filtered ? "visible" : "hidden",
                                    color: "#007BFF"
                                }}>
                                X
                            </Button>
                        </ButtonGroup>
                    </Col>
                </Row>
                <Collapse isOpen={this.state.showFilter}>
                    <Card outline>
                        <CardBody>
                            <Row>
                                <Col>
                                    <InputGroup>
                                        <Input type="date" name="fromDate" id="fromDate"
                                               onChange={this.updateFormDate}
                                               value={this.state.fromDate}
                                               style={this.state.dateOk ? {backgroundColor: 'white'} : {backgroundColor: 'red'}}
                                        />
                                        <Input type="date" name="toDate" id="toDate"
                                               onChange={this.updateToDate}
                                               value={this.state.toDate}
                                               style={this.state.dateOk ? {backgroundColor: 'white'} : {backgroundColor: 'red'}}
                                        />
                                    </InputGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={3} style={{paddingRight: "0.2em", paddingLeft: "1em"}}>
                                    <Button style={{fontSize: "0.8em", paddingRight: "0px", paddingLeft: "0px"}}
                                            size="sm" color="link"
                                            onClick={this.last3m}
                                    >
                                        3 Month
                                    </Button>
                                </Col>
                                <Col xs={3} style={{paddingRight: "0.2em", paddingLeft: "0.2em"}}>
                                    <Button style={{fontSize: "0.8em", paddingRight: "0px", paddingLeft: "0px"}}
                                            size="sm"
                                            color="link"
                                            onClick={this.last6m}
                                    >
                                        6 Month
                                    </Button>
                                </Col>
                                <Col xs={3} style={{paddingRight: "1em", paddingLeft: "0.2em"}}>
                                    <Button style={{fontSize: "0.8em", paddingRight: "0px", paddingLeft: "0px"}}
                                            size="sm"
                                            color="link"
                                            onClick={this.this12m}
                                    >
                                        This Year
                                    </Button>
                                </Col>
                                <Col xs={3} style={{paddingRight: "0.2em", paddingLeft: "0.2em"}}>
                                    <Button style={{fontSize: "0.8em", paddingRight: "0px", paddingLeft: "0px"}}
                                            size="sm"
                                            color="link"
                                            onClick={this.lastYear}
                                    >
                                        Last Year
                                    </Button>
                                </Col>
                            </Row>
                        </CardBody>
                        <CardFooter>
                            <Button color="link" size="sm" block style={{padding: "0 0 0 0"}}
                                    onClick={this.showFilter}>Apply</Button>
                        </CardFooter>
                    </Card>
                </Collapse>
            </FormGroup>

        )
    }
}

export default TimeFilter;
