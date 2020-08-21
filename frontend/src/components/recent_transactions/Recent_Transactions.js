import React, { Component, Fragment } from "react";

class Recent_Transactions extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        // have a separate page for transaction details?.
        if(this.props.loading){
            return(<div></div>)
        }

        let recentFiveTransactions = this.props.transactions.slice(0, 5);

        return (
            <Fragment>
                <ul className="list-group flex-column">
                    {recentFiveTransactions.map((transaction) => (
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
