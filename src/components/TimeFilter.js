import React from 'react';
import {
    Button, ButtonGroup, Card, CardBody, CardFooter,
    Col, Collapse, FormGroup,
    Input, InputGroup,
    Row,
} from "reactstrap";
import moment from "moment";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFilter} from "@fortawesome/free-solid-svg-icons";
import * as _ from 'lodash';

const FORMAT = 'YYYY-MM-DD';

class TimeFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showFilter: false,
            fromDate: moment('2018-01-01'),
            toDate: moment(),
            dateOk: true,
            filtered: false,
            today: moment(),
        };

        this.lastMonths = this.lastMonths.bind(this);
        this.lastYear = this.lastYear.bind(this);
        this.thisYear = this.thisYear.bind(this);
        this.showFilter = this.showFilter.bind(this);
        this.resetFilter = this.resetFilter.bind(this);
        this.updateFormDate = this.updateFormDate.bind(this);
        this.updateToDate = this.updateToDate.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount() {
        this.resetFilter();
        const today = _.isNil(this.props.today) ? moment() : moment(this.props.today);
        this.setState({
            today
        })
    }

    updateFormDate(evt) {
        const fromDate = moment(evt.target.value);
        const dateOk = fromDate.isValid() && fromDate < this.state.toDate;

        this.setState({
            dateOk,
            fromDate
        }, () => {
            this.calc()
        });
    }

    updateToDate(evt) {
        const toDate = moment(evt.target.value);
        const dateOk = toDate.isValid() && toDate > this.state.fromDate;

        this.setState({
            dateOk,
            toDate
        }, () => {
            this.calc()
        });
    }

    lastMonths(evt) {
        const months = evt.target.value;
        const date = moment(this.state.today);
        console.log("date", date, this.state.today)

        this.setState({
            fromDate: date.subtract(months, 'months'),
            toDate: this.state.today,
            dateOk: true,
        }, () => {
            this.calc()
        })
    }


    lastYear() {
        const years = 1;
        const start = moment(this.state.today);
        const end = moment(this.state.today);

        this.setState({
            fromDate: start.startOf('year').subtract(years, 'years'),
            toDate: end.endOf('year').subtract(years, 'years'),
            dateOk: true,
        }, () => {
            this.calc()
        })
    }

    thisYear() {
        const start = moment(this.state.today);
        const end = moment(this.state.today);

        this.setState({
            fromDate: start.startOf('year'),
            toDate: end.endOf('year'),
            dateOk: true,
        }, () => {
            this.calc()
        })
    }

    resetFilter() {
        this.setState({
            dateOk: true,
            showFilter: false,
        }, () => {
            this.thisYear()
        });
    }

    showFilter() {
        this.setState({
            showFilter: !this.state.showFilter,
        })
    }

    calc() {

        const start = moment(this.state.today);
        const end = moment(this.state.today);

        const filtered = !(this.state.fromDate.format() === start.startOf('year').format() && this.state.toDate.format() === end.endOf('year').format());
        this.props.calcData(this.state.fromDate, this.state.toDate);
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
                                               value={this.state.fromDate.format(FORMAT)}
                                               style={this.state.dateOk ? {backgroundColor: 'white'} : {backgroundColor: 'red'}}
                                        />
                                        <Input type="date" name="toDate" id="toDate"
                                               onChange={this.updateToDate}
                                               value={this.state.toDate.format(FORMAT)}
                                               style={this.state.dateOk ? {backgroundColor: 'white'} : {backgroundColor: 'red'}}
                                        />
                                    </InputGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={3} style={{paddingRight: "0.2em", paddingLeft: "1em"}}>
                                    <Button style={{fontSize: "0.8em", paddingRight: "0px", paddingLeft: "0px"}}
                                            size="sm" color="link"
                                            onClick={this.lastMonths}
                                            value={3}
                                    >
                                        3 Month
                                    </Button>
                                </Col>
                                <Col xs={3} style={{paddingRight: "0.2em", paddingLeft: "0.2em"}}>
                                    <Button style={{fontSize: "0.8em", paddingRight: "0px", paddingLeft: "0px"}}
                                            size="sm"
                                            color="link"
                                            onClick={this.lastMonths}
                                            value={6}
                                    >
                                        6 Month
                                    </Button>
                                </Col>
                                <Col xs={3} style={{paddingRight: "1em", paddingLeft: "0.2em"}}>
                                    <Button style={{fontSize: "0.8em", paddingRight: "0px", paddingLeft: "0px"}}
                                            size="sm"
                                            color="link"
                                            onClick={this.thisYear}
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