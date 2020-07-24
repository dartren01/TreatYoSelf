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
        // have a separate page for transaction details?.
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
                        <ul className="list-group">
                            {this.state.transactions.map((transaction) => (
                                <Fragment key={transaction.id}>
                                    <li className="list-group-item">
                                        <div className="row">
                                            <div className="col-sm">
                                                <div className="text-black-50">
                                                    {transaction.date_posted}
                                                </div>
                                                <h1>{transaction.source}</h1>
                                            </div>
                                            <div className="col-sm">
                                                {transaction.category}
                                            </div>
                                            <div className="col-sm text-right">
                                                <div className="text-right text-black-50">
                                                    {transaction.t_type}
                                                </div>
                                                {transaction.t_type === "Expense" ?
                                                    <h1 style={{ color: "red" }}>${transaction.amount}</h1>
                                                    :
                                                    <h1 style={{ color: "limegreen" }}>${transaction.amount}</h1>}
                                            </div>
                                        </div>
                                        <div className="col-sm">
                                            <button onClick={() => this.handleUpdateRedirect(transaction.id)} className="btn btn-info">Update</button>
                                            <button onClick={() => this.handleDelete(transaction.id)} className="btn btn-danger">Delete</button>
                                        </div>
                                    </li>
                                </Fragment>
                            ))}
                        </ul>
                    </div>}
            </div>
        )
    }
}


export default withAlert()(All_Transactions);