import React, { Component } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { withAlert } from 'react-alert';

class Create_Transaction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            category: "",
            source: "",
            amount: "",
            date: "",
            notes: "",
        }

    }

    // takes care of form info
    handleChange = (e) => {
        // Changes state with current information
        this.setState({
            [e.target.name]: e.target.value
        });
        console.log(this.state);
        console.log(typeof (this.state.date));
    };

    handleCreate = (e) => {
        e.preventDefault();
        const transactionObj = {
            t_type: this.props.transactionType,
            category: this.state.category,
            source: this.state.source,
            amount: this.state.amount,
            date_posted: this.state.date,
            notes: this.state.notes
        };
        axios.post(`/budget/create/${this.props.transactionType.toLowerCase()}/`, transactionObj, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${Cookies.get("token")}`
            }
        })
            .then(res => {
                console.log("transaction success");
                const alert = this.props.alert;
                alert.success('Successfully created income transaction');
                this.props.history.push("/")
            })
            .catch(err => {
                console.log("transaction post error: " + err)
            });
    };

    componentDidMount = () => {
        console.log("Create transaction mount");
        // check authentication. currently it calls this after render
        try {
            if (this.props.isLoggedIn) {
                console.log("Authorized");
            } else {
                throw "Not Logged In";
            }
        }
        catch (err) {
            console.log(err);
        }
    };

    render() {
        return (
            <div>
                <h1>
                    Create A Transaction
                </h1>
                <h2>
                    {this.props.transactionType}
                </h2>
                <Form className="col-sm-8">
                    <Form.Group controlId="formSource">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            name="source"
                            placeholder="title"
                            onChange={(e) => this.handleChange(e)} />
                    </Form.Group>

                    <Form.Group controlId="formCategorySelect">
                        <Form.Label>Category</Form.Label>
                        <Form.Control as="select">
                            <option>figure this out</option>

                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="formAmount">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control
                            type="number"
                            step={"0.01"}
                            name="amount"
                            placeholder="amount"
                            onChange={(e) => this.handleChange(e)} />
                    </Form.Group>

                    <Form.Group controlId="formDate">
                        <Form.Label>Date</Form.Label>
                        <Form.Control
                            type="date"
                            name="date"
                            placeholder="date"
                            onChange={(e) => this.handleChange(e)} />
                    </Form.Group>

                    <Form.Group controlId="formNotes">
                        <Form.Label>Notes</Form.Label>
                        <Form.Control
                            type="text"
                            name="notes"
                            placeholder="notes"
                            onChange={(e) => this.handleChange(e)} />
                    </Form.Group>

                    <Button
                        variant="outline-secondary"
                        onClick={(e) => this.handleCreate(e)}>
                        Create
                    </Button>
                </Form>
            </div>
        )
    }
}


export default withAlert()(Create_Transaction);