import React, { Component, Fragment } from "react";
import Cookies from "js-cookie";
import axios from "axios";

class Recent_Transactions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            transactions: [],
        }
    }

    componentDidMount = () => {
        console.log("recent transactions componentDidMount");
        axios.get(`/budget/all_transactions`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${Cookies.get("token")}`
            }
        })
            .then(res => {
                this.setState({
                    transactions: res.data.slice(0, 5),
                    loading: false
                });
                console.log(res.data);
            })
            .catch(err => {
                console.log("transaction get error: " + err)
            })
        console.log(this.state.transactions);
    };


    render() {
        // have a separate page for transaction details?.
        return (
            <Fragment>
                <ul className="list-group flex-column">
                    {this.state.transactions.map((transaction) => (
                        <Fragment key={transaction.id}>
                            <li className="list-group-item flex-grow-1 align-items-stretch">
                                <div className="row">
                                    <div className="col-sm">
                                        <h1>{transaction.source}</h1>
                                    </div>
                                    <div className="col-sm text-center">
                                        <h1>{transaction.category}</h1>
                                    </div>
                                    <div className="col-sm text-right">
                                        {transaction.t_type === "Expense" ?
                                            <h1 style={{ color: "red" }}>-${transaction.amount}</h1>
                                            :
                                            <h1 style={{ color: "limegreen" }}>+${transaction.amount}</h1>}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm text-black-50">
                                        {transaction.date_posted}
                                    </div>
                                    <div className="col-sm text-right text-black-50">
                                        {transaction.t_type}
                                    </div>
                                </div>
                            </li>
                        </Fragment>
                    ))}
                </ul>
            </Fragment>)
    }
}


export default Recent_Transactions;
