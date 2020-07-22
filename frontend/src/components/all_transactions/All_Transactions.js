import React, { Component, Fragment } from "react";
import { Link, Route } from "react-router-dom"
import Cookies from "js-cookie"
import axios from "axios";
import { withAlert } from 'react-alert';

class All_Transactions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            transactions: [],
            showSuccessDeleteAlert: false,
            loading: true
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
                    transactions: res.data,
                    loading: false
                });
            })
            .catch(err => {
                console.log("transaction get error: " + err)
            })
        console.log(this.state.transactions);
    };

    // calls delete, passing in transaction id.
    // on success, sets state with new transaction array with the 
    // deleted transaction removed from array
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

    // redirects user to update form, passing in transaction id as state.
    handleUpdateRedirect = (id) => {
        this.props.history.push({
            pathname: '/budget/update',
            state: {
                transactionId: id
            }
        })
    }


    render() {
        return (
            <div>
                <h1>
                    Transaction Page
                </h1>
                {this.state.loading === true ?
                    <h1>
                        Loading
                    </h1> :
                    <div>
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
                                        <button onClick={() => this.handleUpdateRedirect(transaction.id)} className="btn btn-info">Update</button>
                                        <button onClick={() => this.handleDelete(transaction.id)} className="btn btn-danger">Delete</button>
                                    </div>
                                </Fragment>
                            ))}
                        </ul>
                    </div>}
            </div>
        )
    }
}


export default withAlert()(All_Transactions);