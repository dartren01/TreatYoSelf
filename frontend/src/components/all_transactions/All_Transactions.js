import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom"
import Cookies from "js-cookie"
import axios from "axios";
import { withAlert } from 'react-alert';

class All_Transactions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            transactions: [],
            showSuccessDeleteAlert: false,
        }
    }

    componentDidMount = () => {
        console.log("all transactions componentDidMount");
        this.props.checkLogin();
        axios.get(`/budget/all_transactions`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${Cookies.get("token")}`
            }
        })
            .then(res => {
                this.setState({
                    transactions: res.data
                });
            })
            .catch(err => {
                console.log("transaction get error: " + err)
            })
        console.log(this.state.transactions);
    };

    handleDelete = (id) => {
        console.log("Delete transaction ", id);
        axios.delete(`/budget/transaction/delete/${id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${Cookies.get("token")}`
            }
        })
            .then(res => {
                let arrCopy = [...this.state.transactions]
                const newTransactions = arrCopy.filter(transaction => transaction.id !== id)
                this.setState({
                    transactions: newTransactions
                })
                const alert = this.props.alert;
                alert.success('Transaction Successfully Deleted');
            })
            .catch(err => {
                console.log("transaction delete error: " + err)
            })
    }


    render() {
        return (
            <div>
                <h1>
                    {console.log("transactions Render")}
                    {console.log(this.props.username)}
                      Transaction Page
                </h1>
                <ul>
                    {this.state.transactions.map((transaction) => (
                        <Fragment key={transaction.id}>
                            <li>
                                {transaction.source}
                                <br />
                                {transaction.t_type}
                                <br />
                                Amount: {transaction.amount}
                                <br />
                                Category: {transaction.category}
                                <br />
                                Date: {transaction.date_posted}
                                <br />
                                Notes: {transaction.notes}
                            </li>
                            <div>
                                <button onClick={() => this.handleDelete(transaction.id)} className="btn btn-danger">Delete</button>
                            </div>
                        </Fragment>
                    ))}
                </ul>
            </div>
        )
    }
}


export default withAlert()(All_Transactions);