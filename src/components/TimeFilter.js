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


    lastYear(year) {
        this.setState({
            fromDate: moment(year + '-01-01'),
            toDate: moment(year + '-12-31'),
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
            this.lastYear(moment(this.props.today).year())
        });
    }

    showFilter() {
        this.setState({
            showFilter: !this.state.showFilter,
        })
    }

    calc() {

        const year = moment(this.state.today).year();
        const filtered = !(this.state.fromDate.format() === moment(year + '-01-01').format() && this.state.toDate.format() === moment(year + '-12-31').format());
        this.props.calcData(this.state.fromDate, this.state.toDate);
        this.setState({filtered})
    }

    render() {
        let years = [];
        for (let year = this.state.today.year(); year >= 2018; year--) {
            years.push(<Col key={year} xs={2} style={{paddingRight: "0.2em", paddingLeft: "0.2em"}}>
                <Button style={{fontSize: "0.8em", paddingRight: "0px", paddingLeft: "0px"}}
                        size="sm"
                        color="link"
                        onClick={() => this.lastYear(year)}
                >
                    {year}
                </Button>
            </Col>)
        }

        return (
            <FormGroup>
                <Row>
                    <Col xs={8}>
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
                    {this.props.addition}
                </Row>
                {this.props.result === 0 && !this.state.filtered?
                    <Row>
                        <Col>
                            <Button 
                                color={"link"}
                                onClick={() => this.lastYear(moment().year() - 1)}
                                style={{
                                    color: "#007BFF"
                                }}>
                                    No games found, goto {moment().year() - 1}?
                            </Button>
                        </Col>
                    </Row> 
                :
                    <span  />
                 }
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
                                {years}
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
