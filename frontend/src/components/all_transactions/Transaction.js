import React, { Component, Fragment } from 'react';

class Transaction extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <ul className="list-group flex-column ">
                    {this.props.curTrans.map((transaction) => (
                        <Fragment key={transaction.id}>
                            <li className="list-group-item-t flex-grow-1 align-items-stretch">
                                <div className="row">
                                    <div className="col-sm font-to-lato">
                                        <h1>{transaction.source}</h1>
                                    </div>
                                    <div className="col-sm text-center font-to-lato">
                                        <h1>{transaction.category}</h1>
                                    </div>
                                    <div className="col-sm text-right font-to-lato">
                                        {transaction.t_type === "Expense" ?
                                            <h1 style={{ color: "red" }}>-${transaction.amount}</h1>
                                            :
                                            <h1 style={{ color: "#12A874" }}>+${transaction.amount}</h1>}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm text-black-50 font-to-lato">
                                        {transaction.date_posted}
                                    </div>
                                    <div className="col-sm text-right text-black-50 font-to-lato">
                                        {transaction.t_type}
                                    </div>
                                </div>
                                <div className="row pt-2">
                                    <div className="col-lg text-black-50 text-wrap font-to-lato">
                                        Notes: {transaction.notes}
                                    </div>
                                    <div className="trans-buttons">
                                        <button onClick={() => this.props.handleUpdateRedirect(transaction.id)} className="btn btn-info font-to-lato">Update</button>
                                        <button onClick={() => this.props.handleDelete(transaction.id)} className="btn btn-danger font-to-lato">Delete</button>
                                    </div>
                                </div>
                            </li>
                        </Fragment>
                    ))}
                </ul>
            </Fragment>
        )
    }
}

export default Transaction;