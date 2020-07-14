import React, { Component } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import {Button, Form} from "react-bootstrap";
import {Link} from "react-router-dom";

class Create_Transaction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            category: "",
            source: "",
            amount: "",
            notes: "",
        }

    }

    // takes care of form info
    handleChange = (e) =>{
        // Changes state with current information
        this.setState({
            [e.target.name]:e.target.value
        })
    };

    handleCreate = (e) => {
        e.preventDefault();
        const transactionObj = {
            category: this.state.category,
            source: this.state.source,
            amount: this.state.amount,
            notes: this.state.notes
        };
        axios.post(`/create/${this.props.transactionType}`, transactionObj, {headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${Cookies.get("token")}`
          }})
          .then(res => {
            console.log("transaction success");
            this.props.history.push("/")
          })
            .catch(err=> {
                console.log("transaction post error: " + err)
            });
    };

    componentDidMount = () => {
        this.props.checkLogin();
    };

    render() {
         return(
             <div>
                 <h1>
                      Create A Transaction
                </h1>
                 <h2>
                     {this.props.transactionType}
                 </h2>
                <Form className =  "col-sm-8">
                    <Form.Group controlId="formCategorySelect">
                        <Form.Label>Category</Form.Label>
                        <Form.Control as="select">
                          <option>figure this out</option>

                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="formSource">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            name = "source"
                            placeholder="title"
                            onChange = {(e) => this.handleChange(e)}/>
                    </Form.Group>

                    <Form.Group controlId="formAmount">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control
                            type="text"
                            name = "amount"
                            placeholder="amount"
                            onChange = {(e) => this.handleChange(e)} />
                    </Form.Group>

                    <Form.Group controlId="formNotes">
                        <Form.Label>Notes</Form.Label>
                        <Form.Control
                            size="lg"
                            type="text"
                            name = "notes"
                            placeholder="Large text"
                            onChange = {(e) => this.handleChange(e)} />
                    </Form.Group>

                    <Button
                        variant="outline-secondary"
                        onClick = {(e) => this.handleCreate(e)}>
                        Create
                    </Button>
                </Form>
             </div>
         )
    }
}


export default Create_Transaction;